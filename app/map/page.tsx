"use client";

import { createClient } from "@/utils/supabase/client";
import { InteractiveMap } from "@/components/InteractiveMap";
import { useEffect, useState } from "react";
import { Filter } from "lucide-react";

export default function MapPage() {
    const [filter, setFilter] = useState<'all' | 'fauna' | 'flora' | 'water'>('all');
    const [spots, setSpots] = useState<any[]>([]);
    const supabase = createClient();

    useEffect(() => {
        async function fetchZones() {
            try {
                // Fetch from our own API route (Server-Side Proxy)
                // This avoids browser-side content blockers effectively
                const res = await fetch('/api/zones');
                if (!res.ok) throw new Error('API Error');

                const data = await res.json();

                if (data) {
                    const formatted = data.map((z: any) => ({
                        id: z.id,
                        name: z.name,
                        description: z.description,
                        position: [z.latitude, z.longitude],
                        category: z.category || 'flora'
                    }));
                    setSpots(formatted);
                }
            } catch (e) {
                console.error("Failed to fetch zones via API proxy", e);
            }
        }
        fetchZones();
    }, []);

    const filteredSpots = filter === 'all'
        ? spots
        : spots.filter(s => s.category === filter);

    return (
        <main className="min-h-screen p-4 pb-24 flex flex-col items-center max-w-lg mx-auto space-y-4">
            <div className="text-center space-y-1 w-full relative z-10">
                <h1 className="text-2xl font-bold neon-text text-white">Carte du Territoire</h1>
                <p className="text-xs text-muted-foreground">Explorez les zones interactives.</p>
            </div>

            {/* Filters */}
            <div className="flex gap-2 p-1 bg-slate-900/80 rounded-full border border-slate-700 backdrop-blur-md relative z-10">
                {[
                    { id: 'all', label: 'Tout', icon: Filter },
                    { id: 'fauna', label: 'Faune 🐾' },
                    { id: 'flora', label: 'Flore 🌿' },
                    { id: 'water', label: 'Eau 💧' },

                ].map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id as any)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all
                            ${filter === f.id
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="w-full h-[60vh] rounded-3xl overflow-hidden border border-slate-700 shadow-2xl relative z-0">
                <InteractiveMap spots={filteredSpots} />
            </div>

        </main>
    )
}
