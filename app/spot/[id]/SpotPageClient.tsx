"use client";

import { useState } from "react";
import { Spot } from "@/lib/data";
import { NeonButton } from "@/components/ui/NeonButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { SpiritChat } from "@/components/SpiritChat";
import { MissionList } from "@/components/MissionList";
import { Droplets, Sun, Bug, CheckCircle, ArrowLeft, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface SpotPageClientProps {
    spot: Spot;
}

export default function SpotPageClient({ spot }: SpotPageClientProps) {
    const [showChat, setShowChat] = useState(false);

    return (
        <main className="min-h-screen p-6 pb-24 relative">
            {/* Modal Chat Gemini */}
            {showChat && <SpiritChat spot={spot} onClose={() => setShowChat(false)} />}

            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 rounded-full hover:bg-white/5 transition-colors">
                        <ArrowLeft className="text-muted-foreground" />
                    </Link>
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold neon-text text-primary">{spot.name}</h1>
                        <div className="flex items-center gap-2 text-sm text-secondary uppercase tracking-wider font-semibold">
                            <span>Niveau {spot.level}</span>
                            <span className="w-1 h-1 rounded-full bg-secondary"></span>
                            <span>{spot.type}</span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center space-y-2">
                        <Droplets className="w-6 h-6 mx-auto text-blue-400" />
                        <div className="text-xs text-blue-300">Eau</div>
                        <div className="font-bold text-blue-400">{spot.stats.water}%</div>
                    </div>
                    <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-center space-y-2">
                        <Sun className="w-6 h-6 mx-auto text-yellow-400" />
                        <div className="text-xs text-yellow-300">Soleil</div>
                        <div className="font-bold text-yellow-400">{spot.stats.sun}%</div>
                    </div>
                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center space-y-2">
                        <Bug className="w-6 h-6 mx-auto text-purple-400" />
                        <div className="text-xs text-purple-300">Vie</div>
                        <div className="font-bold text-purple-400">{spot.stats.biodiversity}%</div>
                    </div>
                </div>

                {/* Description & Spirit Call */}
                <GlassCard>
                    <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                        {spot.description}
                    </p>
                    {/* BOUTON GEMINI SPIRIT */}
                    <div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 px-6 rounded-xl text-lg font-bold flex items-center justify-center gap-3
                             bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white 
                             shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-white/20
                             bg-[length:200%_100%] animate-shimmer"
                            onClick={() => setShowChat(true)}
                        >
                            <Sparkles size={24} className="text-yellow-200" />
                            <span>Invoquer l'Esprit du Lieu</span>
                        </motion.button>
                        <p className="text-center text-xs text-purple-300/60 mt-3">Discutez avec l'IA incarnée de ce lieu</p>
                    </div>
                </GlassCard>

                {/* Missions (Interactive) */}
                <MissionList missions={spot.missions} />

            </div>

            <style jsx global>{`
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        .animate-shimmer { animation: shimmer 3s linear infinite; }
      `}</style>
        </main>
    );
}
