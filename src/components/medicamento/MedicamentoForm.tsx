'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreateMedicamentoDTO, Medicamento } from '@/types';
import { calcularHorariosDosis } from '@/lib/utils/dosis-calculator';
import { Save, Clock, Calendar as CalendarIcon } from 'lucide-react';

interface MedicamentoFormProps {
    medicamento?: Medicamento;
    onSubmit: (data: CreateMedicamentoDTO) => Promise<void>;
    isLoading?: boolean;
}

export function MedicamentoForm({ medicamento, onSubmit, isLoading = false }: MedicamentoFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<CreateMedicamentoDTO>({
        nombreMedicamento: '',
        nombreEnfermedad: '',
        fechaInicio: new Date().toISOString().split('T')[0],
        fechaFin: '',
        horaInicio: '08:00',
        intervaloHoras: 8,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [horarios, setHorarios] = useState<string[]>([]);

    // Cargar datos si es edición
    useEffect(() => {
        if (medicamento) {
            setFormData({
                nombreMedicamento: medicamento.nombreMedicamento,
                nombreEnfermedad: medicamento.nombreEnfermedad,
                fechaInicio: medicamento.fechaInicio,
                fechaFin: medicamento.fechaFin,
                horaInicio: medicamento.horaInicio,
                intervaloHoras: medicamento.intervaloHoras,
            });
        }
    }, [medicamento]);

    // Calcular horarios cuando cambia hora de inicio o intervalo
    useEffect(() => {
        if (formData.horaInicio && formData.intervaloHoras) {
            const tempMed = {
                ...formData,
                id: '',
                activo: true,
                createdAt: '',
                updatedAt: '',
            } as Medicamento;
            setHorarios(calcularHorariosDosis(tempMed));
        }
    }, [formData.horaInicio, formData.intervaloHoras]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'intervaloHoras' ? parseInt(value) : value,
        }));
        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.nombreMedicamento.trim()) {
            newErrors.nombreMedicamento = 'El nombre del medicamento es requerido';
        }
        if (!formData.nombreEnfermedad.trim()) {
            newErrors.nombreEnfermedad = 'La enfermedad es requerida';
        }
        if (!formData.fechaInicio) {
            newErrors.fechaInicio = 'La fecha de inicio es requerida';
        }
        if (!formData.fechaFin) {
            newErrors.fechaFin = 'La fecha de fin es requerida';
        }
        if (formData.fechaInicio && formData.fechaFin && formData.fechaFin < formData.fechaInicio) {
            newErrors.fechaFin = 'La fecha de fin debe ser posterior a la de inicio';
        }
        if (!formData.horaInicio) {
            newErrors.horaInicio = 'La hora de inicio es requerida';
        }
        if (!formData.intervaloHoras || formData.intervaloHoras < 1 || formData.intervaloHoras > 24) {
            newErrors.intervaloHoras = 'El intervalo debe estar entre 1 y 24 horas';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre del Medicamento */}
            <div className="input-group">
                <label htmlFor="nombreMedicamento" className="input-label required">
                    Nombre del Medicamento
                </label>
                <input
                    type="text"
                    id="nombreMedicamento"
                    name="nombreMedicamento"
                    value={formData.nombreMedicamento}
                    onChange={handleChange}
                    placeholder="Ej: Paracetamol 500mg"
                    className={`input-field ${errors.nombreMedicamento ? 'error' : ''}`}
                />
                {errors.nombreMedicamento && (
                    <span className="input-error">{errors.nombreMedicamento}</span>
                )}
            </div>

            {/* Enfermedad */}
            <div className="input-group">
                <label htmlFor="nombreEnfermedad" className="input-label required">
                    Enfermedad a Tratar
                </label>
                <input
                    type="text"
                    id="nombreEnfermedad"
                    name="nombreEnfermedad"
                    value={formData.nombreEnfermedad}
                    onChange={handleChange}
                    placeholder="Ej: Gripe común"
                    className={`input-field ${errors.nombreEnfermedad ? 'error' : ''}`}
                />
                {errors.nombreEnfermedad && (
                    <span className="input-error">{errors.nombreEnfermedad}</span>
                )}
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4">
                <div className="input-group">
                    <label htmlFor="fechaInicio" className="input-label required">
                        Fecha de Inicio
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            id="fechaInicio"
                            name="fechaInicio"
                            value={formData.fechaInicio}
                            onChange={handleChange}
                            className={`input-field pr-10 ${errors.fechaInicio ? 'error' : ''}`}
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
                    </div>
                    {errors.fechaInicio && (
                        <span className="input-error">{errors.fechaInicio}</span>
                    )}
                </div>

                <div className="input-group">
                    <label htmlFor="fechaFin" className="input-label required">
                        Fecha de Fin
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            id="fechaFin"
                            name="fechaFin"
                            value={formData.fechaFin}
                            onChange={handleChange}
                            className={`input-field pr-10 ${errors.fechaFin ? 'error' : ''}`}
                        />
                        <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
                    </div>
                    {errors.fechaFin && (
                        <span className="input-error">{errors.fechaFin}</span>
                    )}
                </div>
            </div>

            {/* Hora e Intervalo */}
            <div className="grid grid-cols-2 gap-4">
                <div className="input-group">
                    <label htmlFor="horaInicio" className="input-label required">
                        Hora Primera Dosis
                    </label>
                    <div className="relative">
                        <input
                            type="time"
                            id="horaInicio"
                            name="horaInicio"
                            value={formData.horaInicio}
                            onChange={handleChange}
                            className={`input-field pr-10 ${errors.horaInicio ? 'error' : ''}`}
                        />
                        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
                    </div>
                    {errors.horaInicio && (
                        <span className="input-error">{errors.horaInicio}</span>
                    )}
                </div>

                <div className="input-group">
                    <label htmlFor="intervaloHoras" className="input-label required">
                        Cada (horas)
                    </label>
                    <select
                        id="intervaloHoras"
                        name="intervaloHoras"
                        value={formData.intervaloHoras}
                        onChange={handleChange}
                        className={`input-field ${errors.intervaloHoras ? 'error' : ''}`}
                    >
                        {[1, 2, 3, 4, 6, 8, 12, 24].map(h => (
                            <option key={h} value={h}>
                                {h} {h === 1 ? 'hora' : 'horas'}
                            </option>
                        ))}
                    </select>
                    {errors.intervaloHoras && (
                        <span className="input-error">{errors.intervaloHoras}</span>
                    )}
                </div>
            </div>

            {/* Preview de horarios */}
            {horarios.length > 0 && (
                <div className="glass-card p-4">
                    <p className="text-sm text-[var(--text-secondary)] mb-2">
                        Horarios de recordatorio:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {horarios.map((hora, idx) => (
                            <span key={idx} className="badge badge-info">
                                <Clock className="w-3 h-3" />
                                {hora}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Botón Submit */}
            <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full"
            >
                {isLoading ? (
                    <div className="spinner" style={{ width: '1.25rem', height: '1.25rem', borderWidth: '2px' }} />
                ) : (
                    <>
                        <Save className="w-5 h-5" />
                        {medicamento ? 'Guardar Cambios' : 'Guardar Medicamento'}
                    </>
                )}
            </button>
        </form>
    );
}
