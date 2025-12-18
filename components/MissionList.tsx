"use client";

import { useState } from "react";
import { NeonButton } from "@/components/ui/NeonButton";
import { CheckCircle } from "lucide-react";
import { Mission } from "@/lib/data";
import { useSound } from "@/hooks/useSound";

interface MissionListProps {
    missions: Mission[];
}

export function MissionList({ missions }: MissionListProps) {
    const [completedMissions, setCompletedMissions] = useState<Set<string>>(new Set());
    const { playSound } = useSound();

    const handleComplete = async (id: string, xp: number) => {
        if (completedMissions.has(id)) return;

        playSound("success");

        // Dynamic Import for performance
        const confetti = (await import("canvas-confetti")).default;

        // Confetti Effect
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00ffa3', '#00b8ff', '#d400ff']
        });

        const newSet = new Set(completedMissions);
        newSet.add(id);
        setCompletedMissions(newSet);

        // Simple Alert for MVP (Ideally a Toast)
        // alert(`Mission Validée ! +${xp} XP gagnés !`);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                Missions Disponibles
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">{missions.length}</span>
            </h2>

            {missions.map((mission) => {
                const isCompleted = completedMissions.has(mission.id);

                return (
                    <div key={mission.id} className="relative group">
                        <div className={`absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-xl transition duration-500 blur ${isCompleted ? 'opacity-50' : 'opacity-20 group-hover:opacity-100'}`}></div>
                        <div className={`relative glass p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${isCompleted ? 'bg-primary/10 border-primary/30' : ''}`}>
                            <div>
                                <h3 className={`font-bold text-lg mb-1 ${isCompleted ? 'text-primary line-through' : ''}`}>{mission.title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{mission.description}</p>
                                <div className="inline-flex items-center gap-1 text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded">
                                    +{mission.xp} XP
                                </div>
                            </div>

                            <NeonButton
                                className={`w-full sm:w-auto text-sm ${isCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                variant={isCompleted ? "secondary" : "primary"}
                                icon={CheckCircle}
                                onClick={() => handleComplete(mission.id, mission.xp)}
                            >
                                {isCompleted ? 'Validé !' : 'Valider'}
                            </NeonButton>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
