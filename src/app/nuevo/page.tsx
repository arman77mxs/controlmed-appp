'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { MedicamentoForm } from '@/components/medicamento/MedicamentoForm';
import { useToast } from '@/components/ui/Toast';
import { createMedicamento } from '@/lib/database/repository';
import { CreateMedicamentoDTO } from '@/types';

export default function NuevoMedicamentoPage() {
    const router = useRouter();
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: CreateMedicamentoDTO) => {
        try {
            setIsLoading(true);
            await createMedicamento(data);
            addToast('success', 'Medicamento agregado correctamente');
            router.push('/');
        } catch (error) {
            console.error('Error creating medicamento:', error);
            addToast('error', 'Error al guardar el medicamento');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header showBack />

            <main className="max-w-lg mx-auto px-4 py-6">
                <div className="mb-6">
                    <p className="text-sm text-[var(--text-secondary)]">
                        Completa la información de tu medicamento para comenzar a recibir recordatorios.
                    </p>
                </div>

                <MedicamentoForm onSubmit={handleSubmit} isLoading={isLoading} />
            </main>
        </>
    );
}
