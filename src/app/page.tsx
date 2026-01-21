'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { MedicamentoCard } from '@/components/medicamento/MedicamentoCard';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { getMedicamentosActivos, deleteMedicamento } from '@/lib/database/repository';
import { Medicamento } from '@/types';
import { Plus, Pill } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string | null }>({
    isOpen: false,
    id: null,
  });
  const { addToast } = useToast();

  // Cargar medicamentos
  useEffect(() => {
    loadMedicamentos();
  }, []);

  const loadMedicamentos = async () => {
    try {
      setIsLoading(true);
      const data = await getMedicamentosActivos();
      setMedicamentos(data);
    } catch (error) {
      console.error('Error loading medicamentos:', error);
      addToast('error', 'Error al cargar los medicamentos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;

    try {
      await deleteMedicamento(deleteModal.id);
      setMedicamentos(prev => prev.filter(m => m.id !== deleteModal.id));
      addToast('success', 'Medicamento eliminado correctamente');
    } catch (error) {
      console.error('Error deleting medicamento:', error);
      addToast('error', 'Error al eliminar el medicamento');
    } finally {
      setDeleteModal({ isOpen: false, id: null });
    }
  };

  const openDeleteModal = (id: string) => {
    setDeleteModal({ isOpen: true, id });
  };

  return (
    <>
      <Header />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Título - Más prominente */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Mis Medicamentos Activos</h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)]">
            {medicamentos.length} tratamiento{medicamentos.length !== 1 ? 's' : ''} activo{medicamentos.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="spinner" />
          </div>
        )}

        {/* Lista de Medicamentos - Grid Responsivo con mejor espaciado */}
        {!isLoading && medicamentos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-24 sm:pb-28">
            {medicamentos.map(med => (
              <MedicamentoCard
                key={med.id}
                medicamento={med}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && medicamentos.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Pill className="w-16 h-16 text-[var(--aurora-purple)]" />
            </div>
            <h3 className="empty-state-title text-xl sm:text-2xl">No tienes medicamentos activos</h3>
            <p className="empty-state-text text-base sm:text-lg">
              Agrega tu primer medicamento para comenzar a recibir recordatorios
            </p>
            <Link href="/nuevo" className="btn btn-primary btn-lg">
              <Plus className="w-6 h-6" />
              Agregar Medicamento
            </Link>
          </div>
        )}
      </main>

      {/* Modal de Confirmación */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Eliminar Medicamento"
        message="¿Estás seguro de que deseas eliminar este medicamento? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  );
}
