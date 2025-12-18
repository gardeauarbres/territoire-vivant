"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// Define the shape of our User Profile (from 'profiles' table)
export type Profile = {
    id: string;
    username: string | null;
    avatar_url: string | null;
    level: number;
    xp: number;
    stat_scientific?: number;
    stat_exploration?: number;
    stat_collection?: number;
    stat_community?: number;
    stat_guardian?: number;
    credits?: number; // Marketplace Currency
};

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    isAuthenticated: boolean;
    login: () => void; // Deprecated, strictly for redirect
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    isAuthenticated: false,
    login: () => { },
    logout: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        let mounted = true;

        // Safety timeout: stuck for 5s? force stop loading.
        const safetyTimeout = setTimeout(() => {
            if (mounted && isLoading) {
                console.warn("Auth initialization timed out, forcing load completion.");
                setProfile({ id: "fallback", username: "Gardien", avatar_url: null, level: 1, xp: 0 }); // Prevent infinite loading
                setIsLoading(false);
            }
        }, 2000);

        const initSession = async () => {
            try {
                console.log("Supabase: Fetching session...");
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) throw error;

                console.log("Supabase: Session found?", !!session);

                if (mounted) {
                    setUser(session?.user ?? null);
                    if (session?.user) {
                        await fetchProfile(session.user.id);
                    }
                }
            } catch (err) {
                console.error("Supabase Auth Init Error:", err);
            } finally {
                if (mounted) setIsLoading(false);
                clearTimeout(safetyTimeout);
            }
        };

        initSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            console.log("Auth State Changed:", _event);
            if (!mounted) return;

            setUser(session?.user ?? null);
            if (session?.user) {
                await fetchProfile(session.user.id);
            } else {
                setProfile(null);
            }
            setIsLoading(false);
        });

        return () => {
            mounted = false;
            clearTimeout(safetyTimeout);
            subscription.unsubscribe();
        };
    }, []);

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", userId)
                .single();

            if (error) throw error;

            if (data) {
                setProfile(data as Profile);
            } else {
                throw new Error("No profile data found");
            }
        } catch (err) {
            console.error("Error fetching profile, using fallback:", err);
            // Fallback for visual consistency if profile missing
            setProfile({
                id: userId,
                username: "Gardien",
                avatar_url: null,
                level: 1,
                xp: 0
            });
        }
    };

    const login = () => {
        router.push("/login"); // Just redirects to login page
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setProfile(null);
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, profile, isAuthenticated: !!user, login, logout }}>
            {isLoading ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-emerald-500">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                        <p className="text-sm font-mono animate-pulse">Initialisation du lien neural...</p>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
