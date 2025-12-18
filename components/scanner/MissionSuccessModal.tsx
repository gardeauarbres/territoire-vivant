"use client";

import { motion } from "framer-motion";
import { CheckCircle, Trophy, X, ArrowRight } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";
import Link from "next/link";
import { useSound } from "@/hooks/useSound";
import { useEffect } from "react";

interface MissionSuccessModalProps {
    missionTitle: string;
    xpEarned: number;
    spotName: string;
    speciesUnlocked?: string; // Name of the species
    confidenceScore?: number; // New prop for AI score
    isPending?: boolean; // Admin validation required
    onClose: () => void;
}

export function MissionSuccessModal({ missionTitle, xpEarned, spotName, speciesUnlocked, confidenceScore, isPending, onClose }: MissionSuccessModalProps) {
    const { playSound } = useSound();

    useEffect(() => {
        playSound("success");
    }, [playSound]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-sm w-full bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)]"
            >
                {/* Background Rays */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg"
                    >
                        <Trophy size={40} className="text-white" />
                    </motion.div>

                    <div>
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-2xl font-bold text-white neon-text mb-1"
                        >
                            Mission Accomplie !
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-sm text-gray-400"
                        >
                            {spotName} : {missionTitle}
                        </motion.p>
                    </div>

                    {/* AI Confidence Score Indicator */}
                    {confidenceScore && (
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-full bg-slate-800 rounded-full h-8 relative overflow-hidden border border-white/10"
                        >
                            <div
                                className="h-full bg-emerald-500/50 flex items-center justify-center text-xs font-bold text-white tracking-widest"
                                style={{ width: `${confidenceScore}%` }}
                            >
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-emerald-100 shadow-sm">
                                IDENTIFICATION : {confidenceScore}%
                            </div>
                        </motion.div>
                    )}

                    <div className="flex gap-2 w-full justify-center">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.6, type: "spring" }}
                            className={`py-2 px-4 rounded-xl border ${isPending ? 'bg-amber-500/10 border-amber-500/50' : 'bg-emerald-500/10 border-emerald-500/50'}`}
                        >
                            <span className={`text-2xl font-bold ${isPending ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {isPending ? "⏳ EN ATTENTE" : `+${xpEarned} XP`}
                            </span>
                        </motion.div>
                    </div>

                    {speciesUnlocked && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="w-full bg-slate-800/50 p-3 rounded-xl border border-white/10 flex items-center gap-3 text-left"
                        >
                            <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-lg shadow">
                                🌿
                            </div>
                            <div>
                                <div className="text-[10px] text-emerald-400 font-bold uppercase">Biodex Mis à jour</div>
                                <div className="text-sm text-white font-bold">{speciesUnlocked}</div>
                            </div>
                            <div className="ml-auto">
                                <CheckCircle size={16} className="text-emerald-500" />
                            </div>
                        </motion.div>
                    )}

                    <div className="flex gap-3 w-full pt-4">
                        <NeonButton className="flex-1" variant="secondary" onClick={onClose}>
                            Scanner +
                        </NeonButton>
                        <Link href="/biodex" className="flex-1">
                            <NeonButton className="w-full" variant="primary">
                                Voir Biodex <ArrowRight size={16} className="ml-1" />
                            </NeonButton>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
