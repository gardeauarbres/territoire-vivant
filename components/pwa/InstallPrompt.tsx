"use client";

import { useEffect, useState } from "react";
import { X, Share, PlusSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NeonButton } from "@/components/ui/NeonButton";

export function InstallPrompt() {
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        // Detect if already installed (Standalone mode)
        const isInStandaloneMode =
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone === true;

        setIsStandalone(isInStandaloneMode);

        // Show prompt only if on iOS and not installed
        // Delay slightly to not annoy user immediately
        if (isIosDevice && !isInStandaloneMode) {
            const hasSeenPrompt = localStorage.getItem("ios-install-prompt-seen");
            // Show every time for now (or improve logic to show once per session)
            // Ideally check if user dismissed it recently
            if (!hasSeenPrompt) {
                const timer = setTimeout(() => setShowPrompt(true), 3000);
                return () => clearTimeout(timer);
            }
        }
    }, []);

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem("ios-install-prompt-seen", "true");
    };

    if (!showPrompt) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-8"
            >
                <div className="bg-slate-900/95 backdrop-blur-md border-t border-emerald-500/50 rounded-t-2xl p-6 shadow-[0_-5px_20px_rgba(16,185,129,0.2)] max-w-md mx-auto relative">
                    <button
                        onClick={handleDismiss}
                        className="absolute top-4 right-4 text-slate-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-900 rounded-lg flex items-center justify-center text-2xl">
                                🌿
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg leading-tight">Installer l'Application</h3>
                                <p className="text-emerald-400 text-xs">Pour une meilleure expérience</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm text-slate-300">
                            <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg">
                                <Share size={20} className="text-blue-400" />
                                <span>1. Appuyez sur le bouton <b>Partager</b></span>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-lg">
                                <PlusSquare size={20} className="text-slate-200" />
                                <span>2. Choisissez <b>Sur l'écran d'accueil</b></span>
                            </div>
                        </div>

                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 10, ease: "linear" }}
                                onAnimationComplete={handleDismiss}
                                className="h-full bg-emerald-500/30"
                            />
                        </div>
                    </div>

                    {/* Arrow pointing down usually helps if the bar is at bottom, but layout varies. 
                        Keeping it simple inside the card. */}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
