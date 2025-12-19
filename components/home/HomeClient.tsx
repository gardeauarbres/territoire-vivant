"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { NeonButton } from '@/components/ui/NeonButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { Map, QrCode, Leaf, Wind, Sun, Award } from 'lucide-react';
import { createClient } from "@/utils/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeClient() {
  const { user, profile, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeQuest, setActiveQuest] = React.useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    async function fetchQuest() {
      if (!user) return;
      console.log("Fetching quest for user:", user.id);

      const { data, error } = await supabase
        .from('quests')
        .select('*') // Removed zones(name) for debugging match
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching quest:", error);
      }

      console.log("Quest data:", data);
      if (data) setActiveQuest(data);
    }

    fetchQuest();
  }, [user]);

  if (!user || !profile) {
    return (
      <main className="min-h-screen pb-24 p-6 relative overflow-hidden flex flex-col items-center">
        {/* Header Skeleton */}
        <div className="w-full max-w-lg space-y-2 mt-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-8 w-48" />
            </div>
            <Skeleton className="w-12 h-12 rounded-full border-2 border-white/5" />
          </div>
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>

        {/* Content Skeleton */}
        <div className="w-full max-w-lg space-y-6">
          {/* Active Quest Skeleton */}
          <Skeleton className="h-48 w-full rounded-xl" />

          {/* Weather/Env Skeleton */}
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>

          {/* Shortcuts Skeleton */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-24 p-6 relative overflow-hidden flex flex-col items-center">

      {/* Dynamic Header */}
      <div className="w-full max-w-lg space-y-2 mt-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <p className="text-slate-400 text-sm font-medium">Bonjour, Gardien</p>
            <h1 className="text-3xl font-bold text-white neon-text">{profile.username || "Explorateur"}</h1>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500 overflow-hidden shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full bg-slate-800 object-cover" />
            ) : (
              <div className="w-full h-full bg-emerald-900 flex items-center justify-center text-emerald-300 font-bold">
                {profile.username?.charAt(0).toUpperCase() || "G"}
              </div>
            )}
          </div>
        </motion.div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-900/30 px-3 py-1 rounded-full w-fit border border-emerald-500/20">
          <Award size={14} />
          <span>Niveau {profile.level}</span>
          <span className="text-slate-600">|</span>
          <span>{profile.xp} XP</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-lg space-y-6">

        {/* Current Mission Card */}
        {activeQuest ? (
          <GlassCard className="border-l-4 border-l-emerald-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-50">
              <Leaf size={40} className="text-emerald-500 rotate-12" />
            </div>
            <h3 className="text-xs font-bold text-emerald-400 uppercase mb-1">Mission Active</h3>
            <h2 className="text-xl font-bold text-white mb-2">{activeQuest.title}</h2>
            <p className="text-sm text-slate-300 mb-4 pr-12 line-clamp-2">
              {activeQuest.description}
            </p>
            <div className="flex gap-2">
              <NeonButton href="/map" variant="primary" className="text-xs">
                Localiser la Cible
              </NeonButton>
              <span className="text-xs bg-emerald-900/50 text-emerald-300 px-2 py-2 rounded border border-emerald-500/20 flex items-center">
                Obj: {activeQuest.objective_species}
              </span>
            </div>
          </GlassCard>
        ) : (
          <GlassCard className="border-l-4 border-l-slate-700 relative overflow-hidden opacity-80">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-1">Aucune Mission</h3>
            <p className="text-sm text-slate-400 mb-2">
              Explorez une zone connue pour recevoir une mission.
            </p>
          </GlassCard>
        )}

        {/* Weather / Environment Widget (Decorative) */}
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="flex flex-col items-center justify-center p-4">
            <Sun className="text-yellow-400 mb-2" size={24} />
            <span className="text-2xl font-bold text-white">22°C</span>
            <span className="text-xs text-slate-400">Ensoleillé</span>
          </GlassCard>
          <GlassCard className="flex flex-col items-center justify-center p-4">
            <Wind className="text-blue-400 mb-2" size={24} />
            <span className="text-2xl font-bold text-white">12 km/h</span>
            <span className="text-xs text-slate-400">Vent N.O.</span>
          </GlassCard>
        </div>

        {/* Shortcuts */}
        <h3 className="text-sm font-bold text-white pt-2">Actions Rapides</h3>
        <div className="grid grid-cols-2 gap-4">
          <NeonButton href="/scanner" variant="secondary" className="justify-center h-16 flex-col gap-1" icon={QrCode}>
            Scanner
          </NeonButton>
          <NeonButton href="/biodex" variant="secondary" className="justify-center h-16 flex-col gap-1" icon={Leaf}>
            Biodex
          </NeonButton>
        </div>

      </div>
    </main>
  );
}
