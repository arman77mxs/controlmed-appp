'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { HistorialCard } from '@/components/medicamento/HistorialCard';
import { useToast } from '@/components/ui/Toast';
import { getMedicamentosHistorial, searchMedicamentos } from '@/lib/database/repository';
import { Medicamento } from '@/types';
import { Search, History as HistoryIcon } from 'lucide-react';

export default function HistorialPage() {
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [filteredMedicamentos, setFilteredMedicamentos] = useState<Medicamento[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { addToast } = useToast();

    useEffect(() => {
        loadHistorial();
    }, []);

    const loadHistorial = async () => {
        try {
            setIsLoading(true);
            const data = await getMedicamentosHistorial();
            setMedicamentos(data);
            setFilteredMedicamentos(data);
        } catch (error) {
            console.error('Error loading historial:', error);
            addToast('error', 'Error al cargar el historial');
        } finally {
            setIsLoading(false);
        }
    };

    // Filtrar localmente
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredMedicamentos(medicamentos);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredMedicamentos(
                medicamentos.filter(
                    med =>
                        med.nombreMedicamento.toLowerCase().includes(query) ||
                        med.nombreEnfermedad.toLowerCase().includes(query)
                )
            );
        }
    }, [searchQuery, medicamentos]);

    return (
        <>
            <Header showBack />

            <main className="max-w-lg mx-auto px-4 py-6">
                {/* Barra de Búsqueda */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar medicamento o enfermedad..."
                        className="input-field pl-12"
                    />
                </div>

                {/* Título */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold mb-1">Tratamientos Finalizados</h2>
                    <p className="text-sm text-[var(--text-secondary)]">
                        {filteredMedicamentos.length} tratamiento{filteredMedicamentos.length !== 1 ? 's' : ''} en el historial
                    </p>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center py-12">
                        <div className="spinner" />
                    </div>
                )}

                {/* Lista de Historial */}
                {!isLoading && filteredMedicamentos.length > 0 && (
                    <div className="space-y-4">
                        {filteredMedicamentos.map(med => (
                            <HistorialCard key={med.id} medicamento={med} />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredMedicamentos.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state-icon">
                            <HistoryIcon className="w-16 h-16 text-[var(--text-muted)]" />
                        </div>
                        <h3 className="empty-state-title">
                            {searchQuery ? 'No se encontraron resultados' : 'Sin historial'}
                        </h3>
                        <p className="empty-state-text">
                            {searchQuery
                                ? 'Intenta con otros términos de búsqueda'
                                : 'Los tratamientos finalizados aparecerán aquí'}
                        </p>
                    </div>
                )}
            </main>
        </>
    );
}
