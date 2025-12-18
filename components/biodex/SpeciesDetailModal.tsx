"use client";

import { motion } from "framer-motion";
import { X, MapPin, Share2, Sparkles } from "lucide-react";
import { Species } from "@/lib/data";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";

interface SpeciesDetailModalProps {
    species: Species;
    onClose: () => void;
}

export function SpeciesDetailModal({ species, onClose }: SpeciesDetailModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-md w-full"
            >
                <GlassCard className="overflow-hidden border-slate-600 bg-slate-900/95">

                    {/* Header Image Area */}
                    <div className={`h-48 w-full ${species.imagePlaceholder} relative flex items-center justify-center`}>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                        <div className="text-6xl animate-bounce">
                            {/* Placeholder Icon fallback */}
                            {species.family === 'flora' ? '🌿' : species.family === 'fauna' ? '🐾' : species.family === 'water' ? '💧' : '🍄'}
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-emerald-500 mb-1 flex items-center gap-2">
                                    {species.rarity === 'legendary' && <Sparkles size={12} className="text-yellow-400" />}
                                    {species.family} • {species.rarity}
                                </div>
                                <h2 className="text-2xl font-bold text-white neon-text">{species.name}</h2>
                            </div>
                            <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-xs text-slate-300">
                                #{species.id.substring(0, 3).toUpperCase()}
                            </div>
                        </div>

                        <p className="text-slate-300 text-sm leading-relaxed">
                            {species.description}
                        </p>

                        <div className="p-4 bg-emerald-900/20 border border-emerald-500/20 rounded-xl">
                            <h4 className="text-emerald-400 text-xs font-bold mb-2 flex items-center gap-2">
                                💡 LE SAVIEZ-VOUS ?
                            </h4>
                            <p className="text-slate-400 text-xs italic">
                                "{species.funFact}"
                            </p>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <NeonButton variant="primary" className="flex-1" icon={MapPin}>
                                Voir Habitat
                            </NeonButton>
                            <NeonButton variant="secondary" icon={Share2}>
                                Partager
                            </NeonButton>
                        </div>
                    </div>

                </GlassCard>
            </motion.div>
        </div>
    );
}
