"use client";

// ... imports
import { getAdminDiscoveries, updateDiscoveryStatus, Discovery } from "@/app/actions/gallery";
import { Search, Filter, Trash2, Edit2, Save, User as UserIcon, MapPin, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

interface AdminDashboardProps {
    initialDiscoveries: Discovery[];
}

export function AdminDashboard({ initialDiscoveries }: AdminDashboardProps) {
    const [discoveries, setDiscoveries] = useState<Discovery[]>(initialDiscoveries);
    const [filtered, setFiltered] = useState<Discovery[]>(initialDiscoveries);
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    // Re-fetch on mount/update (optional, better to pass new props via page)
    // Here we assume initialDiscoveries is passed correctly.

    useEffect(() => {
        let result = [...discoveries];

        // Filter Status
        if (filterStatus !== 'all') {
            result = result.filter(d => d.status === filterStatus);
        }

        // Search (User, Quest, Species)
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(d =>
                (d.species_name?.toLowerCase().includes(lower)) ||
                (d.common_name?.toLowerCase().includes(lower)) ||
                (d.user_email?.toLowerCase().includes(lower)) ||
                (d.quest_title?.toLowerCase().includes(lower))
            );
        }

        setFiltered(result);
    }, [discoveries, filterStatus, searchTerm]);

    const handleAction = async (id: string, status: 'approved' | 'rejected', newName?: string) => {
        // Optimistic
        setDiscoveries(prev => prev.map(d => d.id === id ? { ...d, status, common_name: newName || d.common_name } : d));

        const result = await updateDiscoveryStatus(id, status, newName);
        if (result?.error) {
            alert("Erreur: " + result.error);
            router.refresh();
        } else {
            router.refresh();
        }
    };

    // ... Render (Header with stats, Search Bar, Grid)

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row gap-4 bg-slate-900/50 p-4 rounded-xl border border-white/10">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher (Utilisateur, Quête, Espèce)..."
                        className="w-full pl-10 pr-4 py-2 bg-black border border-slate-700 rounded-lg text-white"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto">
                    {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg capitalize border ${filterStatus === status ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                        >
                            {status === 'all' ? 'Tout' : status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-slate-900 p-3 rounded-lg border border-white/5">
                    <div className="text-2xl font-bold text-white">{discoveries.length}</div>
                    <div className="text-xs text-slate-500">Total Photos</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-white/5">
                    <div className="text-2xl font-bold text-amber-500">{discoveries.filter(d => d.status === 'pending').length}</div>
                    <div className="text-xs text-slate-500">En Attente</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg border border-white/5">
                    <div className="text-2xl font-bold text-emerald-500">{discoveries.filter(d => d.status === 'approved').length}</div>
                    <div className="text-xs text-slate-500">Validées</div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filtered.map((discovery) => (
                        <AdminDiscoveryCard
                            key={discovery.id}
                            discovery={discovery}
                            onAction={handleAction}
                        />
                    ))}
                </AnimatePresence>
                {filtered.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-500">
                        Aucun résultat trouvé pour ces critères.
                    </div>
                )}
            </div>
        </div>
    );
}

// Updated Card with User info & Quest link
function AdminDiscoveryCard({ discovery, onAction }: {
    discovery: Discovery,
    onAction: (id: string, status: 'approved' | 'rejected', newName?: string) => void
}) {
    const [name, setName] = useState(discovery.common_name || "");
    const [isEditing, setIsEditing] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`bg-slate-900 border rounded-xl overflow-hidden shadow-xl flex flex-col ${discovery.status === 'pending' ? 'border-amber-500/50' : 'border-slate-700'}`}
        >
            {/* Header: User & Quest Info */}
            <div className="bg-black/40 p-2 flex items-center justify-between text-xs border-b border-white/5">
                <div className="flex items-center gap-2 text-slate-400">
                    <UserIcon size={12} />
                    <span className="max-w-[120px] truncate" title={discovery.user_email}>{discovery.user_email || 'Anonyme'}</span>
                </div>
                {discovery.quest_title && (
                    <div className="flex flex-col gap-0.5 items-end">
                        <div className="flex items-center gap-1 text-indigo-400 font-bold px-2 py-0.5 bg-indigo-500/10 rounded">
                            <MapPin size={10} />
                            <span className="max-w-[100px] truncate" title={discovery.quest_title}>{discovery.quest_title}</span>
                        </div>
                        {discovery.quest_objective && (
                            <span className="text-[10px] text-slate-500">Cible: {discovery.quest_objective}</span>
                        )}
                    </div>
                )}
                {discovery.latitude && discovery.longitude && (
                    <a
                        href={`https://www.google.com/maps?q=${discovery.latitude},${discovery.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-emerald-400 hover:text-emerald-300"
                        title="Voir la position"
                    >
                        <MapPin size={14} />
                    </a>
                )}
            </div>

            <div className="relative aspect-video bg-black group">
                <img
                    src={discovery.image_url}
                    alt={discovery.species_name}
                    className="w-full h-full object-contain"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold text-black border ${discovery.status === 'approved' ? 'bg-emerald-400 border-emerald-500' : discovery.status === 'rejected' ? 'bg-red-400 border-red-500' : 'bg-amber-400 border-amber-500'}`}>
                        {discovery.status}
                    </span>
                </div>
            </div>

            <div className="p-3 space-y-3 flex-1 flex flex-col">
                <div className="flex-1">
                    {/* Editable Name */}
                    <div className="flex items-center gap-2 mb-1">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-transparent text-white font-bold w-full outline-none focus:border-b border-indigo-500"
                            placeholder="Nom..."
                        />
                        <Edit2 size={12} className="text-slate-600" />
                    </div>
                    <div className="text-xs text-slate-500 font-mono">{discovery.species_name}</div>

                    {/* AI Stats Visualization */}
                    {discovery.ai_stats && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {Object.entries(discovery.ai_stats).map(([key, val]) => {
                                if (!val) return null;
                                return (
                                    <div key={key} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 uppercase flex items-center gap-1">
                                        <span>{key.slice(0, 3)}</span>
                                        <span className="text-emerald-400">+{val}</span>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    <div className="text-[10px] text-slate-600 mt-2">Confiance IA: {Math.round(discovery.confidence)}%</div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-white/5">
                    <button
                        onClick={() => onAction(discovery.id, 'rejected')}
                        className="flex-1 flex items-center justify-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 py-1.5 rounded transition-colors text-xs"
                    >
                        <Trash2 size={14} /> Supprimer
                    </button>
                    {discovery.status !== 'approved' && (
                        <button
                            onClick={() => onAction(discovery.id, 'approved', name)}
                            className="flex-1 flex items-center justify-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 py-1.5 rounded transition-colors font-bold text-xs"
                        >
                            <CheckCircle size={14} /> Valider
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
