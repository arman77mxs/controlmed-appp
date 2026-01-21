'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { MedicamentoForm } from '@/components/medicamento/MedicamentoForm';
import { useToast } from '@/components/ui/Toast';
import { getMedicamentoById, updateMedicamento } from '@/lib/database/repository';
import { CreateMedicamentoDTO, Medicamento } from '@/types';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditarMedicamentoPage({ params }: PageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { addToast } = useToast();
    const [medicamento, setMedicamento] = useState<Medicamento | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadMedicamento();
    }, [id]);

    const loadMedicamento = async () => {
        try {
            setIsLoading(true);
            const data = await getMedicamentoById(id);
            if (data) {
                setMedicamento(data);
            } else {
                addToast('error', 'Medicamento no encontrado');
                router.push('/');
            }
        } catch (error) {
            console.error('Error loading medicamento:', error);
            addToast('error', 'Error al cargar el medicamento');
            router.push('/');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (data: CreateMedicamentoDTO) => {
        try {
            setIsSaving(true);
            await updateMedicamento(id, data);
            addToast('success', 'Medicamento actualizado correctamente');
            router.push('/');
        } catch (error) {
            console.error('Error updating medicamento:', error);
            addToast('error', 'Error al actualizar el medicamento');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <Header showBack />

            <main className="max-w-lg mx-auto px-4 py-6">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="spinner" />
                    </div>
                ) : medicamento ? (
                    <>
                        <div className="mb-6">
                            <p className="text-sm text-[var(--text-secondary)]">
                                Modifica la información de tu medicamento.
                            </p>
                        </div>

                        <MedicamentoForm
                            medicamento={medicamento}
                            onSubmit={handleSubmit}
                            isLoading={isSaving}
                        />
                    </>
                ) : null}
            </main>
        </>
    );
}
