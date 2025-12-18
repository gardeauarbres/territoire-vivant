"use server";

import { createClient } from "@/utils/supabase/server";

export type LeaderboardEntry = {
    username: string;
    xp: number;
    level: number;
    avatar_url: string;
};

export async function getLeaderboard() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('username, xp, level, avatar_url')
        .order('xp', { ascending: false })
        .limit(50);

    if (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }

    return data as LeaderboardEntry[];
}
