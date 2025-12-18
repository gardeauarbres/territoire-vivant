"use client";

import { useState, useEffect } from "react";
import { Spot } from "@/lib/data";
import { Droplets, Sprout, Leaf, MapPin, X, ChevronRight, Lock, Crosshair } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { useSound } from "@/hooks/useSound";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface InteractiveMapProps {
    spots: any[]; // relaxed type for now
}

export function InteractiveMap({ spots }: InteractiveMapProps) {
    const [activeSpot, setActiveSpot] = useState<any | null>(null);
    const [viewState, setViewState] = useState({ scale: 1, x: 0, y: 0 });
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const { playSound } = useSound();

    // Watch Position
    useEffect(() => {
        if (!navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                setUserLocation([pos.coords.latitude, pos.coords.longitude]);
            },
            (err) => console.error(err),
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    const handleLocateMe = () => {
        playSound("scan");
        if (userLocation) {
            const coords = projectCoords(userLocation);
            // Center on user (simplified for this CSS map, we just zoom)
            setViewState({ ...viewState, scale: 2, x: 50 - coords.x, y: 50 - coords.y });
            setTimeout(() => setViewState({ ...viewState, scale: 1, x: 0, y: 0 }), 3000);
        } else {
            // Fallback simulation (Paris)
            setUserLocation([48.8566, 2.3522]);
            setTimeout(() => setViewState({ ...viewState, scale: 1.5 }), 500);
            setTimeout(() => setViewState({ ...viewState, scale: 1 }), 2500);
        }
    };

    // Simple France Projection for demo purposes
    // Lat: 41 (South) to 51 (North)
    // Lon: -5 (West) to 10 (East)
    const projectCoords = (pos: [number, number] | undefined) => {
        if (!pos) return { x: 50, y: 50 };
        const [lat, lng] = pos;

        // Normalize to 0-100%
        // Y is inverted (CSS top is 0)
        // 51 deg Lat -> 0% Top
        // 41 deg Lat -> 100% Top
        const y = 100 - ((lat - 42) / (51 - 42)) * 100;
        const x = ((lng - (-5)) / (10 - (-5))) * 100;

        // Clamp to avoid off-screen
        return {
            x: Math.max(5, Math.min(95, x)),
            y: Math.max(5, Math.min(95, y))
        };
    };

    return (
        <div className="relative w-full h-full bg-[#1e293b] overflow-hidden group">

            {/* Geolocation FAB */}
            <button
                onClick={handleLocateMe}
                className="absolute top-4 right-4 z-20 p-3 rounded-full bg-slate-900/80 border border-white/10 text-white shadow-lg hover:bg-white/10 transition-all active:scale-95"
                title="Me localiser"
            >
                <Crosshair size={20} />
            </button>

            {/* Grid Background - Holographic Mesh */}
            <div className="absolute inset-0 pointer-events-none transition-transform duration-1000"
                style={{
                    transform: `scale(${viewState.scale})`,
                    transformOrigin: '50% 50%'
                }}
            >
                {/* Base Dark Map */}
                <div className="absolute inset-0 bg-[#0f172a]" />

                {/* Digital Terrain Lines */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(52, 211, 153, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(52, 211, 153, 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Topography Glows (Fake Terrain) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-emerald-500/5 blur-[100px] rounded-full" />
                <div className="absolute top-1/4 left-1/4 w-[40%] h-[40%] bg-blue-500/5 blur-[80px] rounded-full" />

                {/* France Approximation (Simplified SVG Polygon) */}
                <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[90%] opacity-10 pointer-events-none drop-shadow-[0_0_10px_rgba(52,211,153,0.2)]" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M40 10 L60 10 L80 30 L70 80 L30 80 L20 40 Z" className="text-emerald-500" stroke="currentColor" strokeWidth="0.5" fill="none" />
                    {/* Abstract Hexagons for "Tech" feel */}
                    <path d="M50 40 L55 45 L50 50 L45 45 Z" className="text-emerald-400" fill="currentColor" opacity="0.5" />
                </svg>
            </div>

            {/* User GPS Marker */}
            <AnimatePresence>
                {userLocation && (() => {
                    const coords = projectCoords(userLocation);
                    return (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
                        >
                            {/* Pulsing Radar */}
                            <div className="absolute inset-0 rounded-full bg-blue-500/30 animate-ping"></div>
                            {/* Core Dot */}
                            <div className="relative w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                            {/* Tooltip */}
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-blue-500/90 text-white text-[10px] font-bold rounded-full whitespace-nowrap">
                                Vous êtes ici
                            </div>
                        </motion.div>
                    );
                })()}
            </AnimatePresence>

            {/* Points interactifs */}
            <AnimatePresence>
                {spots.map((spot) => {
                    const coords = projectCoords(spot.position);
                    const Icon = spot.category === 'water' ? Droplets : spot.category === 'fauna' ? Leaf : Sprout;

                    return (
                        <motion.button
                            key={spot.id}
                            // ... existing button props
                            layout
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => {
                                playSound("click");
                                setActiveSpot(spot);
                            }}
                            style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group/marker z-10"
                        >
                            <div className={`
                                w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] border-2 
                                transition-all duration-300 group-hover/marker:scale-110 active:scale-95
                                ${spot.category === 'water' ? 'bg-blue-600 border-white/20 shadow-blue-500/30'
                                    : spot.category === 'fauna' ? 'bg-amber-600 border-white/20 shadow-amber-500/30'
                                        : 'bg-emerald-600 border-white/20 shadow-emerald-500/30'
                                }
                            `}>
                                <Icon size={20} className="text-white drop-shadow-md" />
                            </div>
                            <span className={`
                                mt-2 px-2 py-1 bg-black/80 backdrop-blur-md rounded-lg text-[10px] md:text-xs font-bold 
                                opacity-0 group-hover/marker:opacity-100 transition-opacity whitespace-nowrap border border-white/10 text-white
                            `}>
                                {spot.name}
                            </span>
                        </motion.button>
                    );
                })}
            </AnimatePresence>

            {/* Popup Détails Rapide */}
            <AnimatePresence>
                {activeSpot && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="absolute bottom-4 left-4 right-4 z-20 backdrop-blur-md"
                    >
                        <GlassCard className="flex items-center justify-between p-4 border-slate-700 bg-slate-900/90">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${activeSpot.category === 'water' ? 'bg-blue-500/20 text-blue-400' :
                                    activeSpot.category === 'fauna' ? 'bg-amber-500/20 text-amber-400' :
                                        'bg-emerald-500/20 text-emerald-400'
                                    }`}>
                                    {activeSpot.category === 'water' ? <Droplets size={24} /> :
                                        activeSpot.category === 'fauna' ? <Leaf size={24} /> :
                                            <Sprout size={24} />}
                                </div>
                                <div>
                                    <h3 className="text-white font-bold flex items-center gap-2 text-sm md:text-base">
                                        {activeSpot.name}
                                    </h3>
                                    <p className="text-slate-400 text-xs truncate max-w-[150px] sm:max-w-xs">
                                        {activeSpot.description}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setActiveSpot(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Légende */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur p-3 rounded-xl border border-white/10 text-xs text-slate-400 pointer-events-none">
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-emerald-500" />
                    <span className="font-bold text-white">France métropolitaine</span>
                </div>
            </div>
        </div>
    );
}
