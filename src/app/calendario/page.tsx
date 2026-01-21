'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { getMedicamentosByDateRange } from '@/lib/database/repository';
import { getDosisParaDia } from '@/lib/utils/dosis-calculator';
import { Medicamento, DosisPrograma } from '@/types';
import { ChevronLeft, ChevronRight, Pill, Clock } from 'lucide-react';

const DAYS_OF_WEEK = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

interface CalendarDay {
    date: Date;
    day: number;
    isCurrentMonth: boolean;
    isToday: boolean;
}

export default function CalendarioPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Obtener primer y último día del mes visible
    const getMonthBounds = (date: Date) => {
        const start = new Date(date.getFullYear(), date.getMonth(), 1);
        const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return { start, end };
    };

    // Cargar medicamentos del mes
    useEffect(() => {
        loadMedicamentos();
    }, [currentDate]);

    const loadMedicamentos = async () => {
        try {
            setIsLoading(true);
            const { start, end } = getMonthBounds(currentDate);
            const data = await getMedicamentosByDateRange(
                start.toISOString().split('T')[0],
                end.toISOString().split('T')[0]
            );
            setMedicamentos(data);
        } catch (error) {
            console.error('Error loading medicamentos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Generar días del calendario
    const generateCalendarDays = (): CalendarDay[] => {
        const days: CalendarDay[] = [];
        const { start, end } = getMonthBounds(currentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Días del mes anterior para completar la primera semana
        const startDayOfWeek = start.getDay();
        for (let i = startDayOfWeek - 1; i >= 0; i--) {
            const date = new Date(start);
            date.setDate(date.getDate() - i - 1);
            days.push({
                date,
                day: date.getDate(),
                isCurrentMonth: false,
                isToday: date.getTime() === today.getTime(),
            });
        }

        // Días del mes actual
        for (let day = 1; day <= end.getDate(); day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            days.push({
                date,
                day,
                isCurrentMonth: true,
                isToday: date.getTime() === today.getTime(),
            });
        }

        // Días del mes siguiente para completar la última semana
        const remainingDays = 7 - (days.length % 7);
        if (remainingDays < 7) {
            for (let i = 1; i <= remainingDays; i++) {
                const date = new Date(end);
                date.setDate(date.getDate() + i);
                days.push({
                    date,
                    day: date.getDate(),
                    isCurrentMonth: false,
                    isToday: date.getTime() === today.getTime(),
                });
            }
        }

        return days;
    };

    // Verificar si un día tiene medicamentos
    const dayHasMedicamentos = (date: Date): boolean => {
        const dateStr = date.toISOString().split('T')[0];
        return medicamentos.some(med => {
            const inicio = new Date(med.fechaInicio);
            const fin = new Date(med.fechaFin);
            return date >= inicio && date <= fin;
        });
    };

    // Obtener dosis para el día seleccionado
    const getDosisForSelectedDay = (): { medicamento: Medicamento; horarios: string[] }[] => {
        if (!selectedDate) return [];

        const dateStr = selectedDate.toISOString().split('T')[0];
        return medicamentos
            .filter(med => {
                const inicio = new Date(med.fechaInicio);
                const fin = new Date(med.fechaFin);
                return selectedDate >= inicio && selectedDate <= fin;
            })
            .map(med => ({
                medicamento: med,
                horarios: getDosisParaDia(med, dateStr),
            }));
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
            return newDate;
        });
    };

    const calendarDays = generateCalendarDays();
    const selectedDayDosis = getDosisForSelectedDay();

    return (
        <>
            <Header showBack />

            <main className="max-w-lg mx-auto px-4 py-6">
                {/* Navegación del mes */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigateMonth('prev')}
                        className="btn btn-icon btn-ghost"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <h2 className="text-xl font-semibold">
                        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>

                    <button
                        onClick={() => navigateMonth('next')}
                        className="btn btn-icon btn-ghost"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* Calendario */}
                <div className="glass-card p-4 mb-6">
                    {/* Headers */}
                    <div className="calendar-header">
                        {DAYS_OF_WEEK.map(day => (
                            <div key={day} className="calendar-header-cell">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="calendar-grid">
                        {calendarDays.map((day, idx) => {
                            const hasMeds = day.isCurrentMonth && dayHasMedicamentos(day.date);
                            const isSelected = selectedDate &&
                                day.date.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0];

                            return (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedDate(day.date)}
                                    className={`calendar-day
                    ${!day.isCurrentMonth ? 'other-month' : ''}
                    ${day.isToday ? 'today' : ''}
                    ${isSelected ? 'selected' : ''}
                    ${hasMeds ? 'has-meds' : ''}
                  `}
                                >
                                    {day.day}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Detalle del día seleccionado */}
                {selectedDate && (
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Medicamentos para el {selectedDate.getDate()} de {MONTHS[selectedDate.getMonth()]}
                        </h3>

                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <div className="spinner" />
                            </div>
                        ) : selectedDayDosis.length > 0 ? (
                            <div className="space-y-3">
                                {selectedDayDosis.map(({ medicamento, horarios }) => (
                                    <div key={medicamento.id} className="glass-card p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--aurora-purple)] to-[var(--aurora-pink)] flex items-center justify-center">
                                                <Pill className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{medicamento.nombreMedicamento}</p>
                                                <p className="text-sm text-[var(--text-secondary)]">{medicamento.nombreEnfermedad}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {horarios.map((hora, idx) => (
                                                <span key={idx} className="badge badge-info">
                                                    <Clock className="w-3 h-3" />
                                                    {hora}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-[var(--text-muted)]">
                                <Pill className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>No hay medicamentos programados para este día</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </>
    );
}
