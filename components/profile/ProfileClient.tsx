"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { BadgeGrid } from "@/components/profile/BadgeGrid";
import { ProfileDetailedStats } from "@/components/profile/ProfileDetailedStats";
import { NeonButton } from "@/components/ui/NeonButton";
import { LayoutDashboard, Medal, History, Share2, Settings, Loader2, LogOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface ProfileClientProps {
    gallerySlot: React.ReactNode;
}

export function ProfileClient({ gallerySlot }: ProfileClientProps) {
    const { profile, isAuthenticated, logout } = useAuth();
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
            <main className="min-h-screen p-4 md:p-8 pb-24 md:pb-8 flex flex-col items-center max-w-6xl mx-auto space-y-8">
                {/* Header Skeleton */}
                <div className="w-full flex flex-col items-center gap-4 mt-8">
                    <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-slate-800" />
                    <Skeleton className="h-8 w-48 rounded-lg" />
                    <Skeleton className="h-4 w-64 rounded-lg" />
                    <div className="flex gap-4 mt-2">
                        <Skeleton className="h-8 w-24 rounded-full" />
                        <Skeleton className="h-8 w-24 rounded-full" />
                    </div>
                </div>

                {/* Tabs Skeleton */}
                <div className="flex w-full justify-center gap-12 border-b border-white/10 pb-4 mt-8">
                    <Skeleton className="h-6 w-20 rounded" />
                    <Skeleton className="h-6 w-20 rounded" />
                    <Skeleton className="h-6 w-20 rounded" />
                </div>

                {/* Content Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
                    <Skeleton className="h-48 rounded-xl" />
                    <Skeleton className="h-48 rounded-xl" />
                    <Skeleton className="h-48 rounded-xl" />
                </div>
            </main>
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
                    streak={profile.current_streak}
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
                                <div className="mt-4">
                                    <button
                                        onClick={() => logout()}
                                        className="flex items-center gap-2 mx-auto text-red-400 hover:text-red-300 transition-colors text-sm font-bold uppercase tracking-wider px-4 py-2 rounded-lg hover:bg-red-500/10"
                                    >
                                        <LogOut size={16} /> Me déconnecter
                                    </button>
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
