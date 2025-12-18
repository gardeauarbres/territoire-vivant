"use client";

import { Profile } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

export function ProfileDetailedStats({ profile }: { profile: Profile }) {
    // Real Stats with Fallback to Level simulation if undefined
    const stats = {
        scientific: Math.min(100, profile.stat_scientific ?? (20 + profile.level * 5)),
        exploration: Math.min(100, profile.stat_exploration ?? (50 + profile.level * 2)),
        collection: Math.min(100, profile.stat_collection ?? (10 + profile.level * 8)),
        community: Math.min(100, profile.stat_community ?? (5 + profile.level * 3)),
        guardian: Math.min(100, profile.stat_guardian ?? (30 + profile.level * 4)),
    };

    // Radar Chart Mathematics
    // Points on a pentagon. Radius = 100. Center = 150, 150.
    const center = 150;
    const radius = 100;
    const angleStep = (Math.PI * 2) / 5;

    const getPoint = (value: number, index: number) => {
        const angle = index * angleStep - Math.PI / 2;
        const dist = (value / 100) * radius;
        return `${center + Math.cos(angle) * dist},${center + Math.sin(angle) * dist}`;
    };

    const polyPoints = [
        getPoint(stats.scientific, 0),
        getPoint(stats.exploration, 1),
        getPoint(stats.collection, 2),
        getPoint(stats.community, 3),
        getPoint(stats.guardian, 4),
    ].join(" ");

    const fullPoints = [
        getPoint(100, 0),
        getPoint(100, 1),
        getPoint(100, 2),
        getPoint(100, 3),
        getPoint(100, 4),
    ].join(" ");

    const labels = ["SCIENCE", "EXPLORE", "COLLECT", "SOCIAL", "NATURE"];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* ID Card */}
            <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-50">
                    <div className="w-16 h-16 border-2 border-emerald-500/30 rounded-full flex items-center justify-center">
                        <div className="text-[10px] font-mono text-emerald-500 text-center">OFFICIAL<br />MEMBER</div>
                    </div>
                </div>

                <h3 className="text-emerald-400 font-mono text-sm tracking-widest mb-1">IDENTIFICATION</h3>
                <div className="text-4xl font-bold text-white mb-2 font-mono">ID-{1000 + profile.level * 342}</div>

                <div className="space-y-4 mt-6">
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">Rang Actuel</div>
                        <div className="text-xl text-white font-medium">
                            {profile.level < 5 ? "Promeneur Curieux" : profile.level < 10 ? "Observateur Averti" : "Gardien du Territoire"}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wide">Date d'adhésion</div>
                        <div className="text-sm text-slate-300 font-mono">2024.12.13</div>
                    </div>
                </div>

                {/* Holographic foil effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            {/* Radar Chart */}
            <div className="relative flex justify-center py-4">
                <svg width="300" height="300" className="drop-shadow-[0_0_20px_rgba(52,211,153,0.2)]">
                    {/* Background Grid */}
                    <polygon points={fullPoints} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                    <polygon points={[
                        getPoint(50, 0), getPoint(50, 1), getPoint(50, 2), getPoint(50, 3), getPoint(50, 4)
                    ].join(" ")} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                    {/* Data Polygon */}
                    <motion.polygon
                        initial={{ points: [getPoint(0, 0), getPoint(0, 1), getPoint(0, 2), getPoint(0, 3), getPoint(0, 4)].join(" ") }}
                        animate={{ points: polyPoints }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        fill="rgba(52, 211, 153, 0.2)"
                        stroke="#34d399"
                        strokeWidth="2"
                    />

                    {/* Labels */}
                    {labels.map((label, i) => {
                        const angle = i * angleStep - Math.PI / 2;
                        const x = center + Math.cos(angle) * (radius + 20);
                        const y = center + Math.sin(angle) * (radius + 20);
                        return (
                            <text
                                key={i}
                                x={x}
                                y={y}
                                fill="rgba(255,255,255,0.6)"
                                fontSize="10"
                                fontFamily="monospace"
                                textAnchor="middle"
                                alignmentBaseline="middle"
                            >
                                {label}
                            </text>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
