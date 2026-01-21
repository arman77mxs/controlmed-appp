'use client';

import { Medicamento, CreateMedicamentoDTO, UpdateMedicamentoDTO } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'controlmed-medicamentos';

// Obtener medicamentos del storage
function getMedicamentosFromStorage(): Medicamento[] {
    if (typeof window === 'undefined') return [];

    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        // Insertar datos de prueba si no hay datos
        const seedData = getSeedData();
        saveMedicamentosToStorage(seedData);
        return seedData;
    }

    return JSON.parse(data);
}

// Guardar medicamentos en storage
function saveMedicamentosToStorage(medicamentos: Medicamento[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medicamentos));
}

// Datos de prueba según el PRD
function getSeedData(): Medicamento[] {
    const now = new Date().toISOString();
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    return [
        {
            id: '550e8400-e29b-41d4-a716-446655440001',
            nombreMedicamento: 'Paracetamol 500mg',
            nombreEnfermedad: 'Gripe común',
            fechaInicio: today.toISOString().split('T')[0],
            fechaFin: nextWeek.toISOString().split('T')[0],
            horaInicio: '08:00',
            intervaloHoras: 8,
            activo: true,
            createdAt: now,
            updatedAt: now
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440002',
            nombreMedicamento: 'Omeprazol 20mg',
            nombreEnfermedad: 'Gastritis crónica',
            fechaInicio: today.toISOString().split('T')[0],
            fechaFin: nextMonth.toISOString().split('T')[0],
            horaInicio: '07:00',
            intervaloHoras: 24,
            activo: true,
            createdAt: now,
            updatedAt: now
        },
        {
            id: '550e8400-e29b-41d4-a716-446655440003',
            nombreMedicamento: 'Amoxicilina 500mg',
            nombreEnfermedad: 'Infección de garganta',
            fechaInicio: '2025-01-10',
            fechaFin: '2025-01-17',
            horaInicio: '06:00',
            intervaloHoras: 6,
            activo: false,
            createdAt: '2025-01-10T09:00:00Z',
            updatedAt: '2025-01-18T00:00:00Z'
        }
    ];
}

// CRUD Operations

export async function createMedicamento(data: CreateMedicamentoDTO): Promise<Medicamento> {
    const medicamentos = getMedicamentosFromStorage();
    const now = new Date().toISOString();

    const newMedicamento: Medicamento = {
        id: uuidv4(),
        ...data,
        activo: true,
        createdAt: now,
        updatedAt: now,
    };

    medicamentos.push(newMedicamento);
    saveMedicamentosToStorage(medicamentos);

    return newMedicamento;
}

export async function getMedicamentoById(id: string): Promise<Medicamento | null> {
    const medicamentos = getMedicamentosFromStorage();
    return medicamentos.find(m => m.id === id) || null;
}

export async function getMedicamentosActivos(): Promise<Medicamento[]> {
    // Primero mover expirados al historial
    await moveExpiredToHistorial();

    const medicamentos = getMedicamentosFromStorage();
    return medicamentos
        .filter(m => m.activo)
        .sort((a, b) => a.fechaInicio.localeCompare(b.fechaInicio));
}

export async function getMedicamentosHistorial(): Promise<Medicamento[]> {
    const medicamentos = getMedicamentosFromStorage();
    return medicamentos
        .filter(m => !m.activo)
        .sort((a, b) => b.fechaFin.localeCompare(a.fechaFin));
}

export async function getMedicamentosByDateRange(startDate: string, endDate: string): Promise<Medicamento[]> {
    const medicamentos = getMedicamentosFromStorage();
    return medicamentos.filter(m =>
        m.activo &&
        m.fechaInicio <= endDate &&
        m.fechaFin >= startDate
    ).sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
}

export async function updateMedicamento(id: string, data: UpdateMedicamentoDTO): Promise<Medicamento | null> {
    const medicamentos = getMedicamentosFromStorage();
    const index = medicamentos.findIndex(m => m.id === id);

    if (index === -1) return null;

    const now = new Date().toISOString();
    medicamentos[index] = {
        ...medicamentos[index],
        ...data,
        updatedAt: now,
    };

    saveMedicamentosToStorage(medicamentos);
    return medicamentos[index];
}

export async function deleteMedicamento(id: string): Promise<boolean> {
    const medicamentos = getMedicamentosFromStorage();
    const filtered = medicamentos.filter(m => m.id !== id);

    if (filtered.length === medicamentos.length) return false;

    saveMedicamentosToStorage(filtered);
    return true;
}

export async function moveExpiredToHistorial(): Promise<number> {
    const medicamentos = getMedicamentosFromStorage();
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();
    let count = 0;

    const updated = medicamentos.map(m => {
        if (m.activo && m.fechaFin < today) {
            count++;
            return { ...m, activo: false, updatedAt: now };
        }
        return m;
    });

    if (count > 0) {
        saveMedicamentosToStorage(updated);
    }

    return count;
}

export async function searchMedicamentos(query: string): Promise<Medicamento[]> {
    const medicamentos = getMedicamentosFromStorage();
    const lowerQuery = query.toLowerCase();

    return medicamentos.filter(m =>
        m.nombreMedicamento.toLowerCase().includes(lowerQuery) ||
        m.nombreEnfermedad.toLowerCase().includes(lowerQuery)
    ).sort((a, b) => {
        if (a.activo !== b.activo) return a.activo ? -1 : 1;
        return b.fechaFin.localeCompare(a.fechaFin);
    });
}
