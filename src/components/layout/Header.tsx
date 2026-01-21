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
        <header className="sticky top-0 z-40 bg-[var(--bg-dark)]/90 backdrop-blur-xl border-b border-[var(--border-color)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                    {showBack ? (
                        <button
                            onClick={() => router.back()}
                            className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full hover:bg-[var(--bg-card)] active:scale-95 transition-all touch-manipulation"
                        >
                            <ArrowLeft className="w-6 h-6 sm:w-7 sm:h-7" />
                        </button>
                    ) : (
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[var(--aurora-purple)] to-[var(--aurora-pink)] flex items-center justify-center shadow-lg">
                            <span className="text-xl sm:text-2xl">💊</span>
                        </div>
                    )}
                    <h1 className="text-xl sm:text-2xl font-bold">{getTitle()}</h1>
                </div>

                {showNav && pathname === '/' && (
                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            href="/calendario"
                            className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full hover:bg-[var(--bg-card)] active:scale-95 transition-all touch-manipulation"
                        >
                            <Calendar className="w-6 h-6 text-[var(--text-secondary)]" />
                        </Link>
                        <Link
                            href="/historial"
                            className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full hover:bg-[var(--bg-card)] active:scale-95 transition-all touch-manipulation"
                        >
                            <History className="w-6 h-6 text-[var(--text-secondary)]" />
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
