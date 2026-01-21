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
        <nav className="fixed bottom-0 left-0 right-0 z-50">
            <div className="bg-[var(--bg-darker)] border-t border-[var(--border-color)] backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-around py-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            if (item.isMain) {
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="relative -top-4"
                                    >
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--aurora-purple)] to-[var(--aurora-pink)] flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all">
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>
                                    </Link>
                                );
                            }

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-all ${isActive
                                        ? 'text-[var(--aurora-purple)]'
                                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-xs font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
}
