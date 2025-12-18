"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { BadgeGrid } from "@/components/profile/BadgeGrid";
import { ProfileDetailedStats } from "@/components/profile/ProfileDetailedStats";
import { NeonButton } from "@/components/ui/NeonButton";
import { LayoutDashboard, Medal, History, Share2, Settings, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface ProfileClientProps {
    gallerySlot: React.ReactNode;
}

export function ProfileClient({ gallerySlot }: ProfileClientProps) {
    const { profile, isAuthenticated } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);

    // Initial State defaults
    const [username, setUsername] = useState("Gardien");
    const [bio, setBio] = useState("Gardien du Territoire Vivant");
    const [activeTab, setActiveTab] = useState<"overview" | "badges" | "journal">("journal"); // Default to journal to show gallery first for demo

    useEffect(() => {
        if (!isAuthenticated) router.push("/login");
        if (profile) {
            setUsername(profile.username || "Gardien");
        }
    }, [profile, isAuthenticated, router]);

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <main className="min-h-screen p-4 md:p-8 pb-24 md:pb-8 flex flex-col items-center max-w-6xl mx-auto space-y-8">

            {/* Header */}
            <div className="w-full">
                <ProfileHeader
                    isEditing={isEditing}
                    onToggleEdit={() => setIsEditing(!isEditing)}
                    username={username}
                    setUsername={setUsername}
                    bio={bio}
                    setBio={setBio}
                    level={profile.level}
                    xp={profile.xp}
                    maxXp={profile.level * 1000}
                />
            </div>

            {/* Navigation Tabs */}
            <div className="flex w-full justify-center md:justify-start gap-4 border-b border-white/10 pb-1">
                <button
                    onClick={() => setActiveTab("overview")}
                    className={`pb-3 px-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === "overview" ? "text-emerald-400" : "text-gray-500 hover:text-gray-300"}`}
                >
                    <LayoutDashboard size={18} /> Aperçu
                    {activeTab === "overview" && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("badges")}
                    className={`pb-3 px-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === "badges" ? "text-cyan-400" : "text-gray-500 hover:text-gray-300"}`}
                >
                    <Medal size={18} /> Badges
                    {activeTab === "badges" && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("journal")}
                    className={`pb-3 px-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-all relative ${activeTab === "journal" ? "text-purple-400" : "text-gray-500 hover:text-gray-300"}`}
                >
                    <History size={18} /> Galerie
                    {activeTab === "journal" && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                    )}
                </button>
            </div>

            {/* Content Area */}
            <div className="w-full min-h-[400px]">
                <AnimatePresence mode="wait">
                    {activeTab === "overview" && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center py-20 text-muted-foreground"
                        >
                            <div className="w-full">
                                <ProfileDetailedStats profile={profile} />
                                <div className="mt-8 flex justify-center gap-4">
                                    <NeonButton variant="primary" icon={Share2}>Partager Profil</NeonButton>
                                    <NeonButton variant="secondary" icon={Settings}>Paramètres</NeonButton>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "badges" && (
                        <motion.div
                            key="badges"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <BadgeGrid />
                        </motion.div>
                    )}

                    {activeTab === "journal" && (
                        <motion.div
                            key="journal"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {/* Inject Server Component Here */}
                            {gallerySlot}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </main>
    );
}
