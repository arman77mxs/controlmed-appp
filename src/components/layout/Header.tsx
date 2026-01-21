'use client';

import { ArrowLeft, Calendar, History } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    showNav?: boolean;
}

export function Header({ title, showBack = false, showNav = true }: HeaderProps) {
    const pathname = usePathname();
    const router = useRouter();

    // Determinar título basado en ruta
    const getTitle = () => {
        if (title) return title;

        switch (pathname) {
            case '/':
                return 'ControlMed';
            case '/nuevo':
                return 'Nuevo Medicamento';
            case '/calendario':
                return 'Calendario';
            case '/historial':
                return 'Historial';
            default:
                if (pathname.startsWith('/editar')) return 'Editar Medicamento';
                return 'ControlMed';
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-[var(--bg-dark)]/80 backdrop-blur-xl border-b border-[var(--border-color)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {showBack ? (
                        <button
                            onClick={() => router.back()}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--bg-card)] transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--aurora-purple)] to-[var(--aurora-pink)] flex items-center justify-center">
                            <span className="text-lg">💊</span>
                        </div>
                    )}
                    <h1 className="text-lg font-semibold">{getTitle()}</h1>
                </div>

                {showNav && pathname === '/' && (
                    <div className="flex items-center gap-2">
                        <Link
                            href="/calendario"
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--bg-card)] transition-colors"
                        >
                            <Calendar className="w-5 h-5 text-[var(--text-secondary)]" />
                        </Link>
                        <Link
                            href="/historial"
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--bg-card)] transition-colors"
                        >
                            <History className="w-5 h-5 text-[var(--text-secondary)]" />
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
