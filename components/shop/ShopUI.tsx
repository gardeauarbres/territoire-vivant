"use client";

import { useState } from "react";
import { ShopItem, InventoryItem, buyItem } from "@/app/actions/shop";
import { ShopItemCard } from "./ShopItemCard";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Users, Zap, Shield, Crown, Sprout, Loader2 } from "lucide-react";
import { useNotification as useToast } from "@/contexts/NotificationContext";
import { useSound } from "@/hooks/useSound";

interface ShopUIProps {
    initialItems: ShopItem[];
    initialInventory: InventoryItem[];
}

export function ShopUI({ initialItems, initialInventory }: ShopUIProps) {
    const { profile, refreshProfile } = useAuth();
    const { showNotification } = useToast();
    const { playSound } = useSound();
    const [buyingId, setBuyingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("tool");

    const credits = profile?.credits || 0;

    const handleBuy = async (itemId: string) => {
        setBuyingId(itemId);
        try {
            const result = await buyItem(itemId);
            if (result.success) {
                showNotification(result.message || "Achat réussi !", "success");
                playSound("buy"); // Audio Feedback
                await refreshProfile(); // Refresh credits
                // Ideally also refresh inventory props via router refresh in parent or local state
            } else {
                showNotification(result.error || "Erreur lors de l'achat", "error");
                playSound("error");
            }
        } catch (e) {
            showNotification("Erreur inconnue", "error");
        } finally {
            setBuyingId(null);
        }
    };

    const filterItems = (cat: string) => initialItems.filter(i => i.category === cat);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-xl border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="bg-amber-500/20 p-2 rounded-full">
                        <ShoppingBag className="text-amber-400 w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-white font-bold">Boutique du Gardien</h2>
                        <p className="text-slate-400 text-xs">Dépensez vos crédits durement gagnés</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-amber-400 font-mono">{credits}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">Crédits</div>
                </div>
            </div>

            <Tabs defaultValue="tool" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 p-1 rounded-full border border-white/10">
                    <TabsTrigger value="tool" className="rounded-full data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                        <Zap size={14} className="mr-2" /> Outils
                    </TabsTrigger>
                    <TabsTrigger value="cosmetic" className="rounded-full data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                        <Crown size={14} className="mr-2" /> Style
                    </TabsTrigger>
                    <TabsTrigger value="impact" className="rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                        <Sprout size={14} className="mr-2" /> Impact
                    </TabsTrigger>
                    <TabsTrigger value="inventory" className="rounded-full data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                        <Shield size={14} className="mr-2" /> Sac
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <AnimatePresence mode="wait">
                        {["tool", "cosmetic", "impact"].includes(activeTab) && (
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                {filterItems(activeTab).map(item => (
                                    <ShopItemCard
                                        key={item.id}
                                        item={item}
                                        userCredits={credits}
                                        onBuy={handleBuy}
                                        isBuying={buyingId === item.id}
                                    />
                                ))}
                                {filterItems(activeTab).length === 0 && (
                                    <div className="col-span-full text-center py-12 text-slate-500">
                                        Rien à vendre ici pour le moment.
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === "inventory" && (
                            <motion.div
                                key="inventory"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                {initialInventory.map(inv => (
                                    <div key={inv.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-center gap-4 relative overflow-hidden">
                                        <div className="bg-slate-800 p-3 rounded-lg">
                                            {/* We rely on item name to pick icon or basic placeholder */}
                                            <Shield className="text-slate-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold">{inv.item.name}</h4>
                                            <p className="text-emerald-400 text-xs">Acquis le {new Date(inv.purchased_at).toLocaleDateString()}</p>
                                        </div>
                                        {inv.is_active && (
                                            <div className="absolute top-2 right-2 bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                                                ÉQUIPÉ
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {initialInventory.length === 0 && (
                                    <div className="col-span-full text-center py-12 text-slate-500">
                                        Votre sac est vide. Allez dépenser vos crédits !
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Tabs>
        </div>
    );
}
