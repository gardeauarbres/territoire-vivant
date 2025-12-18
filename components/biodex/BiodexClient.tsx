"use client";

import { useState, useEffect } from "react";
import { BIODEX, Species } from "@/lib/data";
import { GlassCard } from "@/components/ui/GlassCard";
import { SpeciesDetailModal } from "@/components/biodex/SpeciesDetailModal";
import { Book, Filter, Trophy, Star, History } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function BiodexClient() {
    const { user } = useAuth();
    const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
    const [filter, setFilter] = useState<'all' | 'flora' | 'fauna' | 'history'>('all');
    const [completedQuests, setCompletedQuests] = useState<any[]>([]);

    // Simulate unlocked state (For demo: unlock 3 random items + Quest History)
    const isUnlocked = (id: string) => {
        // In real app, check against user.unlockedSpecies (if implemented)
        const fakeUnlocked = ['ecureuil-roux', 'chene-sessile', 'amanite-tue-mouche'];
        return fakeUnlocked.includes(id);
    };

    const supabase = createClient();

    useEffect(() => {
        async function fetchHistory() {
            if (!user) return;
            const { data } = await supabase
                .from('quests')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'completed')
                .order('created_at', { ascending: false });

            if (data) setCompletedQuests(data);
        }
        fetchHistory();
    }, [user]);

    const displayList = filter === 'history'
        ? [] // History is handled separately 
        : filter === 'all' ? BIODEX : BIODEX.filter(s => s.family === filter);

    const stats = {
        total: BIODEX.length,
        unlocked: BIODEX.filter(s => isUnlocked(s.id)).length,
        quests: completedQuests.length
    };

    return (
        <div className="min-h-screen p-4 pb-24 space-y-6 flex flex-col items-center max-w-lg mx-auto">

            {/* Header Stats */}
            <div className="flex items-center justify-between w-full">
                <div>
                    <h1 className="text-2xl font-bold text-white neon-text flex items-center gap-2">
                        <Book className="text-emerald-500" />
                        BIODEX
                    </h1>
                    <p className="text-xs text-slate-400">Recensement de la biodiversité</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-white flex items-center justify-end gap-2">
                        {stats.quests} <Trophy size={16} className="text-amber-500" />
                    </div>
                    <div className="text-xs text-slate-500">Quêtes Accomplies</div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full">
                {[
                    { id: 'all', label: 'Tout' },
                    { id: 'flora', label: 'Flore 🌿' },
                    { id: 'fauna', label: 'Faune 🐾' },
                    { id: 'history', label: 'Historique 📜' }
                ].map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id as any)}
                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors whitespace-nowrap
                            ${filter === f.id
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                : 'bg-slate-900/50 border-white/10 text-slate-400 hover:bg-white/5'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* QUEST HISTORY VIEW */}
            {filter === 'history' ? (
                <div className="grid grid-cols-1 gap-4 w-full">
                    {completedQuests.length === 0 ? (
                        <div className="text-center text-slate-500 py-10">
                            <p>Aucune quête accomplie pour le moment.</p>
                            <p className="text-xs">Partez explorer le monde !</p>
                        </div>
                    ) : (
                        completedQuests.map((quest) => (
                            <motion.div
                                key={quest.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <GlassCard className="p-4 border-l-4 border-l-amber-500 bg-slate-900/60">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Mission Accomplie</span>
                                            <h3 className="text-white font-bold">{quest.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-900/50 px-2 py-1 rounded">
                                            +{quest.xp_reward} XP
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-400 italic mb-2">"{quest.description}"</p>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                                        <Star size={12} className="text-yellow-500" />
                                        Cible : {quest.objective_species}
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))
                    )}
                </div>
            ) : (
                /* STANDARD GRID VIEW */
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {displayList.map((species, index) => {
                        const unlocked = isUnlocked(species.id);

                        return (
                            <motion.div
                                key={species.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => unlocked && setSelectedSpecies(species)}
                            >
                                <GlassCard
                                    className={`
                                        relative aspect-square flex flex-col items-center justify-center p-2 text-center border-slate-700
                                        transition-all duration-300
                                        ${unlocked
                                            ? 'cursor-pointer hover:border-emerald-500/50 hover:bg-slate-800/80 group'
                                            : 'opacity-50 bg-slate-900/50 grayscale cursor-not-allowed'
                                        }
                                    `}
                                >
                                    {/* ... existing card content ... */}
                                    <div className={`
                                        w-12 h-12 rounded-full flex items-center justify-center mb-2 text-2xl shadow-lg
                                        ${unlocked ? species.imagePlaceholder : 'bg-slate-800 text-slate-600'}
                                    `}>
                                        {unlocked ? (species.family === 'flora' ? '🌿' : '🐾') : '?'}
                                    </div>

                                    {unlocked ? (
                                        <>
                                            <h3 className="text-xs font-bold text-white truncate w-full px-1">{species.name}</h3>
                                            <span className="text-[9px] text-emerald-400/80 uppercase tracking-wider">{species.rarity}</span>
                                        </>
                                    ) : (
                                        <div className="text-slate-600 space-y-1">
                                            <div className="h-1.5 w-10 bg-slate-800 rounded mx-auto"></div>
                                            <div className="text-[9px]">???</div>
                                        </div>
                                    )}
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            <AnimatePresence>
                {selectedSpecies && (
                    <SpeciesDetailModal
                        species={selectedSpecies}
                        onClose={() => setSelectedSpecies(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
