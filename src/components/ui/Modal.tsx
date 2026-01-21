'use client';

import { AlertTriangle } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export function Modal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger'
}: ModalProps) {
    if (!isOpen) return null;

    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return 'bg-gradient-to-r from-red-500 to-red-600';
            case 'warning':
                return 'bg-gradient-to-r from-amber-500 to-orange-500';
            default:
                return 'bg-gradient-to-r from-blue-500 to-blue-600';
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-full ${getVariantStyles()} flex items-center justify-center flex-shrink-0`}>
                        <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-1">{title}</h3>
                        <p className="text-sm text-[var(--text-secondary)]">{message}</p>
                    </div>
                </div>

                <div className="flex gap-3 justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="btn btn-secondary"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`btn ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
