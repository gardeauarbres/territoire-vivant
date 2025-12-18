"use client";

import { motion } from "framer-motion";
import { Lock, Droplets, Sprout, Map, Camera, Bug, Footprints } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

interface Badge {
    id: string;
    name: string;
    description: string;
    icon: any;
    unlocked: boolean;
    date?: string;
    color: string;
}

const BADGES: Badge[] = [
    { id: "1", name: "Premières Racines", description: "Créer son compte et scanner le premier arbre.", icon: Sprout, unlocked: true, date: "10/12/2025", color: "text-emerald-400" },
    { id: "2", name: "Source de Vie", description: "Arroser 5 plantes en période de sécheresse.", icon: Droplets, unlocked: true, date: "11/12/2025", color: "text-cyan-400" },
    { id: "3", name: "Cartographe", description: "Découvrir 10 nouveaux spots.", icon: Map, unlocked: false, color: "text-amber-400" },
    { id: "4", name: "Photographe Nature", description: "Ajouter 5 photos à la galerie partagée.", icon: Camera, unlocked: false, color: "text-pink-400" },
    { id: "5", name: "Entomologiste", description: "Identifier 3 espèces d'insectes différentes.", icon: Bug, unlocked: false, color: "text-lime-400" },
    { id: "6", name: "Grand Randonneur", description: "Parcourir 50km avec l'application active.", icon: Footprints, unlocked: false, color: "text-orange-400" },
];

export function BadgeGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BADGES.map((badge, index) => (
                <GlassCard key={badge.id} delay={index * 0.1} className={`relative overflow-hidden group border transition-all duration-300 ${badge.unlocked ? "border-white/10 hover:border-emerald-500/50" : "border-white/5 opacity-70"}`}>
                    <div className="flex items-start gap-4">
                        <div className={`
                            w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border
                            ${badge.unlocked
                                ? `bg-white/5 ${badge.color} border-white/10 shadow-[0_0_15px_rgba(0,0,0,0.2)]`
                                : "bg-black/40 text-gray-600 border-white/5"
                            }
                        `}>
                            {badge.unlocked ? <badge.icon size={24} /> : <Lock size={20} />}
                        </div>
                        <div>
                            <h4 className={`font-bold text-sm mb-1 ${badge.unlocked ? "text-white" : "text-gray-500"}`}>
                                {badge.name}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {badge.description}
                            </p>
                            {badge.unlocked && (
                                <div className="mt-2 text-[10px] text-emerald-500/80 font-mono uppercase tracking-widest">
                                    Obtenu le {badge.date}
                                </div>
                            )}
                        </div>
                    </div>
                </GlassCard>
            ))}
        </div>
    );
}
