"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Map, Scan, Book, User, QrCode, Trophy, ShoppingBag } from 'lucide-react';
import { useSound } from '@/hooks/useSound';

export function BottomDock() {
    const pathname = usePathname();
    const { playSound } = useSound();

    // Hide dock on login page
    if (pathname === '/login') return null;

    const navItems = [
        { name: 'Accueil', path: '/', icon: Home },
        { name: 'Carte', path: '/map', icon: Map },
        { name: 'Biodex', path: '/biodex', icon: Book },
        { name: 'Scanner', path: '/scanner', icon: QrCode, isFab: true }, // Centered
        { name: 'Boutique', path: '/shop', icon: ShoppingBag },
        { name: 'Top 50', path: '/leaderboard', icon: Trophy },
        { name: 'Profil', path: '/profile', icon: User },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-2xl flex items-center justify-between relative"
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent rounded-3xl pointer-events-none"></div>

                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    const Icon = item.icon;

                    if (item.isFab) {
                        return (
                            <Link key={item.path} href={item.path} onClick={() => playSound("click")}>
                                <div className="relative -top-6 mx-2 group">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 active:scale-95
                                        ${isActive
                                            ? 'bg-gradient-to-tr from-emerald-400 to-cyan-400 text-white shadow-emerald-500/50'
                                            : 'bg-slate-800 border border-white/10 text-slate-400 group-hover:text-white'
                                        }`
                                    }>
                                        <Icon size={24} />
                                    </div>
                                    {isActive && (
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-400 rounded-full"></div>
                                    )}
                                </div>
                            </Link>
                        );
                    }

                    return (
                        <Link key={item.path} href={item.path} className="flex-1" onClick={() => playSound("click")}>
                            <div className={`flex flex-col items-center justify-center h-12 transition-colors relative
                                ${isActive ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`
                            }>
                                <Icon size={20} className={isActive ? 'drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]' : ''} />
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute -bottom-1 w-1 h-1 bg-emerald-400 rounded-full"
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </motion.div>
        </div>
    );
}
