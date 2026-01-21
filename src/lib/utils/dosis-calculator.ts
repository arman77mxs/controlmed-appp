import { DosisPrograma, Medicamento } from '@/types';

// Calcular todos los horarios de dosis para un medicamento
export function calcularHorariosDosis(medicamento: Medicamento): string[] {
    const [horaI, minI] = medicamento.horaInicio.split(':').map(Number);
    const horasDelDia: string[] = [];

    // Calcular cuántas dosis hay por día
    const dosesPerDay = Math.floor(24 / medicamento.intervaloHoras);

    for (let i = 0; i < dosesPerDay; i++) {
        const hora = (horaI + (i * medicamento.intervaloHoras)) % 24;
        horasDelDia.push(
            `${hora.toString().padStart(2, '0')}:${minI.toString().padStart(2, '0')}`
        );
    }

    return horasDelDia.sort();
}

// Generar programa completo de dosis
export function generarProgramaDosis(
    medicamento: Medicamento,
    startDate?: string,
    endDate?: string
): DosisPrograma[] {
    const dosis: DosisPrograma[] = [];
    const horasDelDia = calcularHorariosDosis(medicamento);

    const fechaInicio = new Date(startDate || medicamento.fechaInicio);
    const fechaFin = new Date(endDate || medicamento.fechaFin);

    const fecha = new Date(fechaInicio);

    while (fecha <= fechaFin) {
        for (const hora of horasDelDia) {
            const fechaStr = fecha.toISOString().split('T')[0];
            dosis.push({
                fecha: fechaStr,
                hora,
                timestamp: new Date(`${fechaStr}T${hora}:00`),
                medicamentoId: medicamento.id,
                nombreMedicamento: medicamento.nombreMedicamento,
            });
        }
        fecha.setDate(fecha.getDate() + 1);
    }

    return dosis;
}

// Obtener próxima dosis
export function getProximaDosis(medicamento: Medicamento): string | null {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const fechaFin = new Date(medicamento.fechaFin);

    if (now > fechaFin) {
        return null;
    }

    const horasDelDia = calcularHorariosDosis(medicamento);
    const currentTime = now.getHours() * 60 + now.getMinutes();

    // Buscar próxima dosis hoy
    for (const hora of horasDelDia) {
        const [h, m] = hora.split(':').map(Number);
        const dosisTime = h * 60 + m;

        if (dosisTime > currentTime) {
            return `Hoy ${hora}`;
        }
    }

    // Si no hay más dosis hoy, la próxima es mañana
    if (horasDelDia.length > 0) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (tomorrow <= fechaFin) {
            return `Mañana ${horasDelDia[0]}`;
        }
    }

    return null;
}

// Obtener dosis para un día específico
export function getDosisParaDia(medicamento: Medicamento, fecha: string): string[] {
    const fechaDate = new Date(fecha);
    const fechaInicio = new Date(medicamento.fechaInicio);
    const fechaFin = new Date(medicamento.fechaFin);

    if (fechaDate < fechaInicio || fechaDate > fechaFin) {
        return [];
    }

    return calcularHorariosDosis(medicamento);
}

// Formatear fecha para mostrar
export function formatearFecha(fecha: string): string {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Formatear rango de fechas
export function formatearRangoFechas(fechaInicio: string, fechaFin: string): string {
    return `${formatearFecha(fechaInicio)} - ${formatearFecha(fechaFin)}`;
}
