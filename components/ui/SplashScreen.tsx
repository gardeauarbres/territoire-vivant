"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sprout } from "lucide-react";

export function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Check if we've already shown the splash in this session
        const hasShownSplash = sessionStorage.getItem("splash-shown");

        if (hasShownSplash) {
            setIsVisible(false);
            return;
        }

        // Show splash for 2 seconds then hide
        const timer = setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem("splash-shown", "true");
        }, 2200);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center"
            >
                <div className="relative">
                    {/* Pulsing Glow */}
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute inset-0 bg-emerald-500/30 blur-3xl rounded-full"
                    />

                    {/* Logo Animation */}
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            duration: 0.8,
                            ease: "easeOut",
                            type: "spring",
                            bounce: 0.5
                        }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-900 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] border border-emerald-400/30 mb-6">
                            <Sprout size={48} className="text-white drop-shadow-md" />
                        </div>

                        <h1 className="text-3xl font-bold text-white tracking-widest uppercase">
                            Territoire
                        </h1>
                        <motion.span
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="h-1 bg-emerald-500 rounded-full mt-2"
                        />
                        <p className="text-emerald-400 text-sm font-light mt-2 tracking-widest">
                            VIVANT
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute bottom-12 text-slate-500 text-xs font-mono"
                >
                    Chargement de l'expérience...
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
