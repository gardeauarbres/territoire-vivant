"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { useSound } from "@/hooks/useSound";
import React from "react";

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    href?: string;
    icon?: LucideIcon;
    variant?: "primary" | "secondary" | "accent" | "ghost";
    className?: string;
}

export function NeonButton({ children, href, onClick, icon: Icon, variant = "primary", className = "", disabled, ...props }: NeonButtonProps) {
    const { playSound } = useSound();

    const baseColors = {
        primary: "border-primary text-primary shadow-[0_0_15px_rgba(0,255,163,0.3)] hover:shadow-[0_0_25px_rgba(0,255,163,0.6)] hover:bg-primary/10",
        secondary: "border-secondary text-secondary shadow-[0_0_15px_rgba(0,184,255,0.3)] hover:shadow-[0_0_25px_rgba(0,184,255,0.6)] hover:bg-secondary/10",
        accent: "border-accent text-accent shadow-[0_0_15px_rgba(212,0,255,0.3)] hover:shadow-[0_0_25px_rgba(212,0,255,0.6)] hover:bg-accent/10",
        ghost: "border-transparent text-slate-400 hover:text-white hover:bg-white/5",
    };

    const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none shadow-none hover:shadow-none hover:bg-transparent";

    const handleInteraction = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
        if (disabled) {
            e.preventDefault();
            return;
        }
        playSound("click");
        if (onClick) onClick(e as React.MouseEvent<HTMLButtonElement>);
    };

    const handleMouseEnter = () => {
        if (!disabled) {
            playSound("hover");
        }
    };

    const content = (
        <>
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </>
    );

    const commonClasses = `
        relative px-8 py-3 rounded-xl border-2 font-bold tracking-wider uppercase
        transition-all duration-300 backdrop-blur-sm flex items-center gap-3
        ${baseColors[variant]} ${className}
        ${disabled ? disabledStyles : ''}
    `;

    if (href) {
        return (
            <Link href={href}>
                <motion.div
                    onClick={handleInteraction}
                    onMouseEnter={handleMouseEnter}
                    whileHover={disabled ? {} : { scale: 1.05 }}
                    whileTap={disabled ? {} : { scale: 0.95 }}
                    className={`${commonClasses} cursor-pointer`}
                >
                    {content}
                </motion.div>
            </Link>
        );
    }

    return (
        <motion.button
            onClick={handleInteraction}
            onMouseEnter={handleMouseEnter}
            whileHover={disabled ? {} : { scale: 1.05 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            className={commonClasses}
            disabled={disabled}
            {...(props as HTMLMotionProps<"button">)}
        >
            {content}
        </motion.button>
    );
}
