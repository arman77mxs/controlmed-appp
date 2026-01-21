'use client';

import { Medicamento } from '@/types';
import { getProximaDosis, calcularHorariosDosis, formatearRangoFechas } from '@/lib/utils/dosis-calculator';
import { Pill, Clock, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface MedicamentoCardProps {
    medicamento: Medicamento;
    onDelete: (id: string) => void;
}

export function MedicamentoCard({ medicamento, onDelete }: MedicamentoCardProps) {
    const proximaDosis = getProximaDosis(medicamento);
    const horarios = calcularHorariosDosis(medicamento);

    return (
        <div className="glass-card p-4">
            <div className="flex items-start gap-4">
                {/* Icono */}
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--aurora-purple)] to-[var(--aurora-pink)] flex items-center justify-center flex-shrink-0">
                    <Pill className="w-6 h-6 text-white" />
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{medicamento.nombreMedicamento}</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-2">{medicamento.nombreEnfermedad}</p>

                    {/* Próxima dosis */}
                    {proximaDosis && (
                        <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-4 h-4 text-[var(--aurora-cyan)]" />
                            <span className="text-sm text-[var(--aurora-cyan)] font-medium">
                                Próxima: {proximaDosis}
                            </span>
                        </div>
                    )}

                    {/* Horarios */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {horarios.map((hora, idx) => (
                            <span key={idx} className="badge badge-purple">
                                {hora}
                            </span>
                        ))}
                    </div>

                    {/* Fechas */}
                    <p className="text-xs text-[var(--text-muted)]">
                        {formatearRangoFechas(medicamento.fechaInicio, medicamento.fechaFin)}
                    </p>
                </div>
            </div>

            {/* Acciones */}
            {/* Acciones - Botones más grandes para touch */}
            <div className="flex gap-3 mt-4 pt-4 border-t border-[var(--border-color)]">
                <Link
                    href={`/editar/${medicamento.id}`}
                    className="btn btn-secondary flex-1 py-3 text-base active:scale-95 transition-transform"
                >
                    <Edit2 className="w-5 h-5" />
                    Editar
                </Link>
                <button
                    onClick={() => {
                        // Haptic feedback para Samsung/Android
                        if (typeof navigator !== 'undefined' && navigator.vibrate) {
                            navigator.vibrate(50);
                        }
                        onDelete(medicamento.id);
                    }}
                    className="btn btn-ghost px-4 py-3 text-[var(--error)] bg-[var(--bg-input)] hover:bg-red-500/10 active:scale-95 transition-all rounded-xl"
                    aria-label="Eliminar medicamento"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
