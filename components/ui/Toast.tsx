"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { useEffect } from "react";

export type NotificationType = "success" | "error" | "info" | "quest";

export interface ToastProps {
    id: string;
    title: string;
    message?: string;
    type: NotificationType;
    onClose: (id: string) => void;
}

const icons = {
    success: <CheckCircle className="text-emerald-400" size={20} />,
    error: <AlertCircle className="text-red-400" size={20} />,
    info: <Info className="text-blue-400" size={20} />,
    quest: <Info className="text-amber-400" size={20} />, // Custom icon for quests later
};

const borderColors = {
    success: "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]",
    error: "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]",
    info: "border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]",
    quest: "border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]",
};

const bgColors = {
    success: "bg-emerald-950/90",
    error: "bg-red-950/90",
    info: "bg-cyan-950/90",
    quest: "bg-amber-950/90",
};

const progressColors = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    info: "bg-cyan-500",
    quest: "bg-amber-500",
};

export function Toast({ id, title, message, type, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, 5000); // Auto close after 5s

        return () => clearTimeout(timer);
    }, [id, onClose]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`
                pointer-events-auto w-full max-w-sm rounded-lg border backdrop-blur-xl
                flex items-start gap-3 p-4 relative overflow-hidden group
                ${bgColors[type]} ${borderColors[type]}
            `}
        >
            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none bg-[length:100%_4px]"
                style={{ backgroundImage: 'linear-gradient(0deg, transparent 50%, rgba(255, 255, 255, 0.05) 50%)' }}
            />

            {/* Progress Bar (Time left indicator simulation) */}
            <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
                className={`absolute bottom-0 left-0 h-1 ${progressColors[type]}`}
            />

            <div className="mt-0.5 shrink-0 relative z-10">{icons[type]}</div>
            <div className="flex-1 min-w-0 relative z-10">
                <h4 className="font-bold text-sm text-white leading-tight tracking-wide uppercase font-mono">{title}</h4>
                {message && <p className="text-xs text-secondary-foreground/80 mt-1 leading-relaxed">{message}</p>}
            </div>
            <button
                onClick={() => onClose(id)}
                className="shrink-0 text-white/40 hover:text-white transition-colors relative z-10"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
}
