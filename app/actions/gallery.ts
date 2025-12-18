"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type DiscoveryStatus = "pending" | "approved" | "rejected";

export type Discovery = {
    id: string;
    user_id: string;
    species_name: string;
    common_name?: string;
    confidence: number;
    image_url: string;
    status: DiscoveryStatus;
    category?: string;
    created_at: string;
    ai_stats?: {
        scientific: number;
        exploration: number;
        collection: number;
        community: number;
        guardian: number;
    };
    // Admin Fields (Joined)
    user_email?: string;
    user_name?: string;
    quest_title?: string;
    quest_objective?: string; // What to photograph
    latitude?: number;
    longitude?: number;
};

/**
 * Save a new discovery to the database.
 * The image should already be uploaded to Supabase Storage by the client,
 * OR we can handle the upload here if passed as base64 (heavier).
 * For now, let's assume the client will handle the storage upload for better UX (progress bar),
 * or we can simplify and process the base64 -> storage here since we already have the base64 for analysis.
 * 
 * Let's try the Base64 -> Storage approach here for simplicity (Server Action).
 */
export async function saveDiscovery(
    base64Image: string,
    scanResult: {
        name: string;
        scientificName: string;
        confidence: number;
        description: string;
        category?: string;
        stat_bonus?: {
            scientific: number;
            exploration: number;
            collection: number;
        }
    },
    options?: { forceQuestCompletion?: boolean, location?: { lat: number, lng: number } }
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "User not authenticated" };
    }

    try {
        // ... (Upload remains same)
        const buffer = Buffer.from(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        const fileName = `${user.id}/${Date.now()}_scan.jpg`;

        const { error: uploadError } = await supabase
            .storage
            .from('discoveries')
            .upload(fileName, buffer, { contentType: 'image/jpeg', upsert: false });

        if (uploadError) {
            console.error("Storage upload error:", uploadError);
            return { error: "Failed to upload image evidence." };
        }

        const { data: { publicUrl } } = supabase.storage.from('discoveries').getPublicUrl(fileName);

        // Fetch active quest
        const { data: activeQuest } = await supabase
            .from('quests')
            .select('*')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .limit(1)
            .maybeSingle();

        // 2. Insert into DB
        const { error: insertError } = await supabase
            .from('discoveries')
            .insert({
                user_id: user.id,
                species_name: scanResult.scientificName || scanResult.name,
                common_name: scanResult.name,
                confidence: scanResult.confidence,
                image_url: publicUrl,
                status: 'pending',
                quest_id: (activeQuest as any)?.id || null,
                ai_stats: (scanResult.stat_bonus as any) || null,
                category: scanResult.category || 'other',
                latitude: (options?.location?.lat as any) || null,
                longitude: (options?.location?.lng as any) || null
            });

        if (insertError) {
            console.error("DB insert error:", insertError);
            return { error: `DB Error: ${insertError.message}` };
        }

        revalidatePath('/profile');
        return {
            success: true,
            questReward: (activeQuest as any) // Mock or real quest info
        };

    } catch (error: any) {
        console.error("Save discovery exception:", error);
        return { error: error.message || "Internal server error saving discovery.", success: false };
    }
}

export async function getUserDiscoveries() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data } = await supabase
        .from('discoveries')
        .select('*')
        .order('created_at', { ascending: false });

    return data as Discovery[];
}

export async function getPendingDiscoveries() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // In a real app, check if user is admin.
    // Here we assume if they can access the admin page (to be protected), they can call this.
    // OR we just return all pending for everyone in this prototype phase.

    if (!user) return [];

    const { data } = await supabase
        .from('discoveries')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

    return data as Discovery[];
}

export async function updateDiscoveryStatus(id: string, status: DiscoveryStatus, newName?: string) {
    const supabase = await createClient();

    // Check auth/admin normally

    // DELETE IF REJECTED
    if (status === 'rejected') {

        // 1. Get file path to delete from storage
        const { data: discoveryToDelete } = await supabase
            .from('discoveries')
            .select('image_url')
            .eq('id', id)
            .single();

        if (discoveryToDelete?.image_url) {
            try {
                // Extract filename from URL
                // Format: .../discoveries/USERID/FILENAME.jpg
                // or public URL
                const urlParts = discoveryToDelete.image_url.split('/discoveries/');
                if (urlParts.length > 1) {
                    const filePath = urlParts[1]; // Should be "USERID/filename.jpg"
                    console.log("Deleting storage file:", filePath);

                    await supabase.storage
                        .from('discoveries')
                        .remove([filePath]);
                }
            } catch (err) {
                console.warn("Failed to cleanup storage file:", err);
                // Continue to delete row anyway
            }
        }

        // 2. Delete Row
        const { error } = await supabase
            .from('discoveries')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Delete discovery error:", error);
            return { error: "Failed to delete discovery" };
        }
    } else {
        // UPDATE IF APPROVED (or other status)
        const updateData: any = { status };
        if (newName) {
            updateData.common_name = newName;
            // Optionally update scientific name or keep as is
        }

        const { error } = await supabase
            .from('discoveries')
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error("Update status error:", error);
            return { error: "Failed to update status" };
        }

        // AWARD XP IF APPROVED
        if (status === 'approved') {
            // Fetch the user_id and species info for this discovery
            const { data: discovery } = await supabase
                .from('discoveries')
                .select('user_id, species_name, common_name, ai_stats')
                .eq('id', id)
                .single();

            if (discovery?.user_id) {
                let xpBonus = 0;

                // ... (quest logic) ...

                // 2. STANDARD REWARD + QUEST BONUS
                const BASE_XP = 50;
                const totalXP = BASE_XP + xpBonus;

                // Increment Profile XP and Stats
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('xp, level, stat_scientific, stat_exploration, stat_collection, stat_community, stat_guardian, credits')
                    .eq('id', discovery.user_id)
                    .single();

                const profile = profileData as any;

                if (profile) {
                    const newXp = (profile.xp || 0) + totalXP;
                    const newLevel = 1 + Math.floor(newXp / 1000);

                    // Calculate new stats
                    const discoveryAny = discovery as any;
                    const aiStats = discoveryAny.ai_stats || {};
                    const newStats = {
                        stat_scientific: (profile.stat_scientific || 0) + (aiStats.scientific || 0),
                        stat_exploration: (profile.stat_exploration || 0) + (aiStats.exploration || 0),
                        stat_collection: (profile.stat_collection || 0) + (aiStats.collection || 0),
                        stat_community: (profile.stat_community || 0) + (aiStats.community || 0),
                        stat_guardian: (profile.stat_guardian || 0) + (aiStats.guardian || 0),
                        xp: newXp,
                        level: newLevel,
                        credits: (profile.credits || 0) + (totalXP * 10) // 1 XP = 10 Credits
                    };

                    await supabase.from('profiles').update(newStats).eq('id', discovery.user_id);
                }
            }
        }
    }

    revalidatePath('/profile');
    revalidatePath('/admin');
    return { success: true };
}
// ADMIN: Get ALL discoveries with extra info
export async function getAdminDiscoveries() {
    const supabase = await createClient();

    // In real app: Check Admin Role
    // For prototype: Check if user is authenticated at least
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Fetch Discoveries + Associated Profile + Associated Quest
    // Fetch Discoveries + Associated Quest (Quest FK is likely fine, or we can treat it same way)
    // We remove the profile join that was failing.
    // Fetch Discoveries + Associated Profile + Associated Quest
    const { data: discoveries, error } = await supabase
        .from('discoveries')
        .select(`
            *,
            quests:quest_id (title, objective_species)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching admin discoveries:", error);
        return [];
    }

    // Manual Join for Profiles (Robust fallback)
    const userIds = Array.from(new Set(discoveries.map((d: any) => d.user_id))).filter(Boolean);

    let profilesMap: Record<string, { email: string, username: string }> = {};

    if (userIds.length > 0) {
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, email, username')
            .in('id', userIds);

        if (profiles) {
            profiles.forEach((p: any) => {
                profilesMap[p.id] = { email: p.email, username: p.username };
            });
        }
    }

    // Map/Transform
    return discoveries.map((d: any) => ({
        ...d,
        user_email: profilesMap[d.user_id]?.email || "Unknown",
        user_name: profilesMap[d.user_id]?.username || "Explorer",
        quest_title: d.quests?.title || null,
        quest_objective: d.quests?.objective_species || null
    }));
}
