"use client";

import { motion } from "framer-motion";
import { User, Edit2, Camera, MapPin, Trophy, Shield } from "lucide-react";
import Link from "next/link";

interface ProfileHeaderProps {
    isEditing: boolean;
    onToggleEdit: () => void;
    username: string;
    setUsername: (name: string) => void;
    bio: string;
    setBio: (bio: string) => void;
    level: number;
    xp: number;
    maxXp: number;
}

export function ProfileHeader({
    isEditing,
    onToggleEdit,
    username,
    setUsername,
    bio,
    setBio,
    level,
    xp,
    maxXp
}: ProfileHeaderProps) {
    const xpPercentage = (xp / maxXp) * 100;

    return (
        <div className="relative p-6 glass-panel rounded-3xl border border-emerald-500/20 bg-black/40 backdrop-blur-xl overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar Section */}
                <div className="relative group">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-emerald-500/30 p-1 relative overflow-hidden bg-black/50">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white">
                            <User size={48} />
                        </div>
                    </div>
                    {/* Level Badge */}
                    <div className="absolute -bottom-2 -right-2 bg-black/80 border border-emerald-500 text-emerald-400 font-bold px-3 py-1 rounded-full text-sm backdrop-blur-md shadow-lg">
                        Lvl {level}
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 text-center md:text-left space-y-4 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="space-y-1 flex-1 relative">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="text-3xl font-bold bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-white w-full md:w-auto focus:border-emerald-500 outline-none"
                                />
                            ) : (
                                <h1 className="text-3xl font-bold text-white neon-text">{username}</h1>
                            )}

                            {isEditing ? (
                                <input
                                    type="text"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="text-sm text-muted-foreground bg-white/10 border border-white/20 rounded-lg px-2 py-1 w-full focus:border-emerald-500 outline-none"
                                />
                            ) : (
                                <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                                    <MapPin size={14} /> {bio}
                                </p>
                            )}
                        </div>

                        <Link
                            href="/admin"
                            className="p-2 rounded-full border border-slate-700 bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors mr-2"
                            title="Accès Admin"
                        >
                            <Shield size={18} />
                        </Link>

                        <button
                            onClick={onToggleEdit}
                            className={`p-2 rounded-full transition-colors ${isEditing
                                ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <Edit2 size={18} />
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 py-2">
                        <div className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Impact</div>
                            <div className="text-lg font-bold text-emerald-400">128 kg</div>
                        </div>
                        <div className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Spots</div>
                            <div className="text-lg font-bold text-cyan-400">14</div>
                        </div>
                        <div className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
                            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Rang</div>
                            <div className="text-lg font-bold text-purple-400">Explorateur</div>
                        </div>
                    </div>

                    {/* XP Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            <span>Experience</span>
                            <span>{xp} / {maxXp} XP</span>
                        </div>
                        <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${xpPercentage}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
