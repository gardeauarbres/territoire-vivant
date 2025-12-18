"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { checkForQuest } from "@/app/actions/quests";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { Scroll, X, Loader2, CheckCircle } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { NeonButton } from "./ui/NeonButton";
import { useNotification } from "@/contexts/NotificationContext";

const MIN_DISTANCE_METERS = 100; // Check every 100m
const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes cooldown between checks

export function QuestTracker() {
    const { user } = useAuth();
    const [lastCheck, setLastCheck] = useState<{ lat: number; lng: number; time: number } | null>(null);
    const [activeQuest, setActiveQuest] = useState<any | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const { playSound } = useSound();
    const { showNotification } = useNotification();
    const pathname = usePathname();
    const router = useRouter(); // Hoist router hook

    // Effect handles its own conditional logic internally
    useEffect(() => {
        if (!user || pathname === '/login') return; // Add pathname check here if needed specifically for the effect 

        if (!("geolocation" in navigator)) {
            console.log("Geolocation not supported");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                const now = Date.now();
                const shouldCheck = !lastCheck ||
                    (getDistanceFromLatLonInM(latitude, longitude, lastCheck.lat, lastCheck.lng) > MIN_DISTANCE_METERS &&
                        now - lastCheck.time > COOLDOWN_MS);

                if (shouldCheck) {
                    setIsScanning(true);
                    setLastCheck({ lat: latitude, lng: longitude, time: now });

                    try {
                        const result = await checkForQuest(latitude, longitude); // Server handles ID now
                        if (result && result.quest) {
                            // Only notify if it is genuinely NEW
                            if (result.type === 'new') {
                                playSound("success");
                                showNotification("Nouvelle Mission !", result.quest.title, "quest");
                                setActiveQuest(result.quest); // Show modal only for new
                            } else {
                                // Existing quest: Just log it or update a "Current Quest" indicator, don't pop modal
                                console.log("Active quest confirmed:", result.quest.title);
                            }
                        }
                    } catch (err) {
                        console.warn("Quest check failed", err);
                    } finally {
                        setIsScanning(false);
                    }
                }
            },
            (error) => {
                console.warn(`GPS Warning (${error.code}): ${error.message}`);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [user, lastCheck, playSound, pathname]); // Added pathname to deps

    const handleAccept = () => {
        playSound("click");
        setActiveQuest(null);
        router.refresh(); // Refresh data without hard reload
    };

    // Valid Early Return strictly for Rendering (Hooks are already called)
    if (!user || pathname === '/login') return null;

    return (
        <>
            {/* DEBUG: Simulation Button (Remove in prod) */}
            <button
                onClick={async () => {
                    // FORCE TEST NOTIFICATION (UI Check)
                    playSound("success");
                    showNotification("Test Notification", "Ceci est un test de simulation.", "quest");

                    // Server Check (for logs)
                    if (!user) return;
                    setIsScanning(true);
                    console.log("Simulating Quest Check for Jardin des Plantes...");
                    try {
                        const result = await checkForQuest(48.8439, 2.3596);
                        if (result?.quest) {
                            if (result.type === 'new') {
                                playSound("success");
                                showNotification("Nouvelle Mission (Debug) !", result.quest.title, "quest");
                                setActiveQuest(result.quest);
                            } else {
                                showNotification("Mission En Cours", "Tu as déjà cette quête active.", "info");
                                console.log("Debug: Quest already active", result.quest);
                                // Optional: Open it anyway if user wants to see it?
                                // For now, let's just notify so they know it didn't generate a new one.
                            }
                        } else {
                            console.log("No quest found or error");
                        }
                    } finally {
                        setIsScanning(false);
                    }
                }}
                className="fixed bottom-24 left-6 z-50 bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded border border-red-500/50 hover:bg-red-500 hover:text-white transition-colors"
                title="Simuler une entrée au Jardin des Plantes"
            >
                [DEBUG] Test Notif & Zone
            </button>

            <AnimatePresence>
                {/* SCANNING INDICATOR */}
                {isScanning && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed top-6 right-6 z-50 bg-black/60 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 border border-emerald-500/30 text-emerald-400 text-xs font-mono"
                    >
                        <Loader2 className="w-3 h-3 animate-spin" />
                        ANALYSE ZONE...
                    </motion.div>
                )}

                {/* QUEST POPUP */}
                {activeQuest && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -50, x: "-50%" }}
                        className="fixed top-24 left-1/2 z-50 w-[90%] max-w-sm"
                    >
                        <div className="glass-panel p-5 rounded-2xl border border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.2)] bg-black/90 backdrop-blur-xl relative overflow-hidden group">
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent animate-shimmer" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-3 items-center">
                                        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/50 shrink-0 animate-pulse">
                                            <Scroll className="text-amber-400 w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-amber-400 font-bold text-xs uppercase tracking-widest">Nouvelle Quête</h4>
                                            <h3 className="text-white font-bold text-lg leading-tight">{activeQuest.title}</h3>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setActiveQuest(null)}
                                        className="text-slate-500 hover:text-white transition-colors p-1"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                <p className="text-slate-300 text-sm italic mb-4 leading-relaxed pl-2 border-l-2 border-amber-500/30">
                                    "{activeQuest.description}"
                                </p>

                                <div className="flex gap-2 mb-6">
                                    <div className="text-[10px] bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-md border border-amber-500/20 font-medium">
                                        🎯 Cible : {activeQuest.objective_species}
                                    </div>
                                    <div className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-500/20 font-medium flex items-center gap-1">
                                        ✨ +{activeQuest.xp_reward} XP
                                    </div>
                                </div>

                                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                                    <p className="text-xs text-amber-200 font-bold mb-1">
                                        🎯 Comment terminer la mission ?
                                    </p>
                                    <p className="text-[11px] text-slate-300 leading-tight">
                                        Utilise le <strong>Scanner</strong> (l'icône appareil photo) pour identifier l'espèce : <span className="text-white font-bold">{activeQuest.objective_species}</span>.
                                    </p>
                                </div>

                                <NeonButton
                                    onClick={() => setActiveQuest(null)}
                                    className="w-full justify-center text-sm py-2 mt-4"
                                    variant="accent"
                                    icon={CheckCircle}
                                >
                                    C'EST NOTÉ
                                </NeonButton>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence >
        </>
    );
}

// Client-side Haversine helper
function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371;
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d * 1000;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
}
