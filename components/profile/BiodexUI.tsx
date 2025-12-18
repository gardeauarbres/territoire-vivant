"use client";

import { useState } from "react";
import { Discovery } from "@/app/actions/gallery";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Leaf, Bug, Sprout, HelpCircle, X, MapPin, ExternalLink, Award, Clock } from "lucide-react";
import { NeonButton } from "@/components/ui/NeonButton";

interface BiodexUIProps {
    initialDiscoveries: Discovery[];
}

const CATEGORIES = [
    { id: 'all', label: 'Tout', icon: Filter },
    { id: 'flora', label: 'Flore', icon: Leaf },
    { id: 'fauna', label: 'Faune', icon: Bug },
    { id: 'fungi', label: 'Fungi', icon: Sprout },
    { id: 'other', label: 'Autre', icon: HelpCircle },
];

export function BiodexUI({ initialDiscoveries }: BiodexUIProps) {
    const [discoveries] = useState<Discovery[]>(initialDiscoveries);
    const [filter, setFilter] = useState('all');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const filtered = discoveries.filter(d =>
        filter === 'all' ? true : (d.category?.toLowerCase() || 'other') === filter
    );

    const selectedDiscovery = discoveries.find(d => d.id === selectedId);

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
                {CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    const isActive = filter === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isActive
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                                : 'bg-slate-900/50 border-white/10 text-slate-400 hover:bg-white/5'
                                }`}
                        >
                            <Icon size={14} />
                            <span className="text-sm font-medium">{cat.label}</span>
                        </button>
                    )
                })}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                    {filtered.map((discovery) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={discovery.id}
                            onClick={() => setSelectedId(discovery.id)}
                            className="group relative aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-700/50 hover:border-emerald-500/50 cursor-pointer shadow-lg hover:shadow-emerald-500/10 transition-all"
                        >
                            <img
                                src={discovery.image_url}
                                alt={discovery.species_name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                            {/* Badge Status */}
                            <div className="absolute top-2 right-2">
                                {discovery.status === 'pending' && (
                                    <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-[10px] backdrop-blur-md">
                                        En attente
                                    </Badge>
                                )}
                            </div>

                            {/* Stats Mini Badges */}
                            {discovery.ai_stats && (
                                <div className="absolute top-2 left-2 flex flex-col gap-1">
                                    {discovery.ai_stats.scientific > 5 && (
                                        <div className="bg-blue-500/20 border border-blue-500/30 p-1 rounded-md" title="Haute valeur scientifique">
                                            <Award size={12} className="text-blue-400" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Name */}
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                                <h4 className="text-white font-bold text-sm truncate leading-tight group-hover:text-emerald-400 transition-colors">
                                    {discovery.common_name || discovery.species_name}
                                </h4>
                                <p className="text-slate-400 text-xs italic truncate opacity-80">
                                    {discovery.species_name}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                    Aucune découverte dans cette catégorie.
                </div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedId && selectedDiscovery && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedId(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative"
                        >
                            <button
                                onClick={() => setSelectedId(null)}
                                className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full text-white hover:bg-white/20 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="relative aspect-video">
                                <img
                                    src={selectedDiscovery.image_url}
                                    alt={selectedDiscovery.species_name}
                                    className="w-full h-full object-contain bg-black"
                                />
                                <div className="absolute bottom-4 left-4">
                                    <Badge className={`backdrop-blur-md ${selectedDiscovery.category === 'flora' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                        {selectedDiscovery.category?.toUpperCase() || 'INCONNU'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-white neon-text">{selectedDiscovery.common_name || "Espèce Inconnue"}</h2>
                                    <p className="text-emerald-400 italic font-mono">{selectedDiscovery.species_name}</p>
                                </div>

                                {/* Stats Grid */}
                                {selectedDiscovery.ai_stats && (
                                    <div className="grid grid-cols-3 gap-2 py-4 border-y border-white/5">
                                        {Object.entries(selectedDiscovery.ai_stats).map(([k, v]) => {
                                            if (!v) return null;
                                            return (
                                                <div key={k} className="bg-white/5 p-2 rounded text-center">
                                                    <div className="text-[10px] uppercase text-slate-500">{k.slice(0, 3)}</div>
                                                    <div className="text-lg font-bold text-emerald-400">+{v}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-xs text-slate-500">
                                    <div>
                                        Confiance IA: {Math.round(selectedDiscovery.confidence)}%
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={12} />
                                        {new Date(selectedDiscovery.created_at).toLocaleDateString()}
                                    </div>
                                </div>

                                <NeonButton className="w-full" onClick={() => setSelectedId(null)}>
                                    Fermer
                                </NeonButton>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
