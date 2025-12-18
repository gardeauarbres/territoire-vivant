import { motion } from "framer-motion";
import { useSound } from "@/hooks/useSound";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function GlassCard({ children, className = "", delay = 0 }: GlassCardProps) {
    const { playSound } = useSound();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            onMouseEnter={() => playSound("hover")}
            className={`glass-card p-6 rounded-2xl ${className}`}
        >
            {children}
        </motion.div>
    );
}
