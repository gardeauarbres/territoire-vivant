"use client";

import { ShopItem } from "@/app/actions/shop";
import { NeonButton } from "@/components/ui/NeonButton";
import { Badge } from "@/components/ui/badge";
import { Coins, Zap, Shield, Crown, Sprout, Radar, VenetianMask, Medal } from "lucide-react";
import { motion } from "framer-motion";

interface ShopItemCardProps {
    item: ShopItem;
    userCredits: number;
    onBuy: (id: string) => void;
    isBuying: boolean;
}

const ICONS: Record<string, any> = {
    'radar': Radar,
    'venetian-mask': VenetianMask,
    'crown': Crown,
    'medal': Medal,
    'tree-deciduous': Sprout,
};

export function ShopItemCard({ item, userCredits, onBuy, isBuying }: ShopItemCardProps) {
    const canAfford = userCredits >= item.cost;
    const Icon = ICONS[item.image_url] || Zap;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden shadow-lg hover:border-emerald-500/50 transition-all flex flex-col"
        >
            {/* Visual Header */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 flex flex-col items-center justify-center relative aspect-video">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <Icon className={`w-12 h-12 ${item.category === 'impact' ? 'text-green-400' : item.category === 'cosmetic' ? 'text-amber-400' : 'text-blue-400'} drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]`} />

                <div className="absolute top-2 right-2">
                    <Badge variant="outline" className="bg-black/40 border-slate-600 font-mono text-xs">
                        {item.category.toUpperCase()}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-white font-bold text-lg mb-1">{item.name}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-grow">
                    {item.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div className="flex items-center text-amber-400 font-bold font-mono">
                        <Coins size={14} className="mr-1.5" />
                        {item.cost}
                    </div>

                    <NeonButton
                        size="sm"
                        onClick={() => onBuy(item.id)}
                        disabled={!canAfford || isBuying}
                        variant={canAfford ? "primary" : "outline"}
                        className={!canAfford ? "opacity-50 cursor-not-allowed border-red-500/50 text-red-500 hover:bg-transparent" : ""}
                    >
                        {isBuying ? "..." : "Acheter"}
                    </NeonButton>
                </div>
            </div>
        </motion.div>
    );
}
