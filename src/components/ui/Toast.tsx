'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Toast as ToastType, ToastType as ToastVariant } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface ToastContextType {
    toasts: ToastType[];
    addToast: (type: ToastVariant, message: string) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastType[]>([]);

    const addToast = useCallback((type: ToastVariant, message: string) => {
        const id = uuidv4();
        setToasts(prev => [...prev, { id, type, message }]);

        // Auto-remove después de 4 segundos
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

function ToastContainer({ toasts, onRemove }: { toasts: ToastType[], onRemove: (id: string) => void }) {
    const getIcon = (type: ToastVariant) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-[var(--success)]" />;
            case 'error': return <AlertCircle className="w-5 h-5 text-[var(--error)]" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-[var(--warning)]" />;
            case 'info': return <Info className="w-5 h-5 text-[var(--info)]" />;
        }
    };

    if (toasts.length === 0) return null;

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <div key={toast.id} className={`toast ${toast.type}`}>
                    {getIcon(toast.type)}
                    <span className="text-sm flex-1">{toast.message}</span>
                    <button
                        onClick={() => onRemove(toast.id)}
                        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
