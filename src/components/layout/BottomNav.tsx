'use client';

import { Home, Calendar, Plus, History } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { href: '/', icon: Home, label: 'Inicio' },
    { href: '/calendario', icon: Calendar, label: 'Calendario' },
    { href: '/nuevo', icon: Plus, label: 'Nuevo', isMain: true },
    { href: '/historial', icon: History, label: 'Historial' },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="bottom-nav">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-around h-full pt-3 sm:pt-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        if (item.isMain) {
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="relative -top-6 sm:-top-7 group touch-manipulation"
                                >
                                    <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-[var(--aurora-purple)] to-[var(--aurora-pink)] flex items-center justify-center shadow-xl shadow-purple-500/40 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all">
                                        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                                    </div>
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center gap-1 px-4 sm:px-5 py-2 rounded-xl transition-all active:scale-95 touch-manipulation ${isActive
                                    ? 'text-[var(--aurora-purple)]'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                                <span className="text-xs sm:text-sm font-semibold tracking-wide">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
