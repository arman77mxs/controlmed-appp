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
        <div className="glass-card p-5 sm:p-6">
            <div className="flex items-start gap-4 sm:gap-5">
                {/* Icono - Más grande para mejor visualización */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[var(--aurora-purple)] to-[var(--aurora-pink)] flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Pill className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl sm:text-2xl truncate leading-tight">{medicamento.nombreMedicamento}</h3>
                    <p className="text-base sm:text-lg text-[var(--text-secondary)] mb-3 mt-1">{medicamento.nombreEnfermedad}</p>

                    {/* Próxima dosis - Más prominente */}
                    {proximaDosis && (
                        <div className="flex items-center gap-2.5 mb-3 bg-[var(--aurora-cyan)]/10 px-3 py-2 rounded-lg -mx-1">
                            <Clock className="w-5 h-5 text-[var(--aurora-cyan)]" />
                            <span className="text-base sm:text-lg text-[var(--aurora-cyan)] font-semibold">
                                Próxima: {proximaDosis}
                            </span>
                        </div>
                    )}

                    {/* Horarios - Badges más grandes */}
                    <div className="flex flex-wrap gap-2 sm:gap-2.5 mb-4">
                        {horarios.map((hora, idx) => (
                            <span key={idx} className="badge badge-purple text-sm sm:text-base px-3 py-1.5">
                                {hora}
                            </span>
                        ))}
                    </div>

                    {/* Fechas - Texto más legible */}
                    <p className="text-sm sm:text-base text-[var(--text-muted)]">
                        {formatearRangoFechas(medicamento.fechaInicio, medicamento.fechaFin)}
                    </p>
                </div>
            </div>

            {/* Acciones - Botones optimizados para pantallas grandes */}
            <div className="flex gap-3 sm:gap-4 mt-5 pt-5 border-t border-[var(--border-color)]">
                <Link
                    href={`/editar/${medicamento.id}`}
                    className="btn btn-secondary flex-1 py-3.5 sm:py-4 text-base sm:text-lg font-semibold active:scale-95 transition-transform touch-manipulation"
                >
                    <Edit2 className="w-5 h-5 sm:w-6 sm:h-6" />
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
                    className="btn btn-ghost px-4 sm:px-5 py-3.5 sm:py-4 text-[var(--error)] bg-[var(--bg-input)] hover:bg-red-500/10 active:scale-95 transition-all rounded-xl touch-manipulation"
                    aria-label="Eliminar medicamento"
                >
                    <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>
        </div>
    );
}
