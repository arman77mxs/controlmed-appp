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
                <div className="flex items-center justify-around h-full pt-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        if (item.isMain) {
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="relative -top-5 group"
                                >
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--aurora-purple)] to-[var(--aurora-pink)] flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all">
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-xl transition-all active:scale-95 ${isActive
                                    ? 'text-[var(--aurora-purple)]'
                                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                    }`}
                            >
                                <Icon className="w-6 h-6" />
                                <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
