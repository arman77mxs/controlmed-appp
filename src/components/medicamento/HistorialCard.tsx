'use client';

import { Medicamento } from '@/types';
import { formatearRangoFechas } from '@/lib/utils/dosis-calculator';
import { Pill, CheckCircle } from 'lucide-react';

interface HistorialCardProps {
    medicamento: Medicamento;
}

export function HistorialCard({ medicamento }: HistorialCardProps) {
    return (
        <div className="glass-card p-4">
            <div className="flex items-start gap-4">
                {/* Icono */}
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-card-hover)] flex items-center justify-center flex-shrink-0">
                    <Pill className="w-6 h-6 text-[var(--text-muted)]" />
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h3 className="font-semibold truncate">{medicamento.nombreMedicamento}</h3>
                            <p className="text-sm text-[var(--text-secondary)]">{medicamento.nombreEnfermedad}</p>
                        </div>
                        <span className="badge badge-success flex-shrink-0">
                            <CheckCircle className="w-3 h-3" />
                            Completado
                        </span>
                    </div>

                    {/* Fechas */}
                    <p className="text-sm text-[var(--text-muted)] mt-2">
                        {formatearRangoFechas(medicamento.fechaInicio, medicamento.fechaFin)}
                    </p>
                </div>
            </div>
        </div>
    );
}
