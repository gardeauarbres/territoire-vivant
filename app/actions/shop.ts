"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type ShopItem = {
    id: string;
    name: string;
    description: string;
    image_url: string;
    cost: number;
    category: 'tool' | 'cosmetic' | 'impact';
    effect_data?: any;
};

export type InventoryItem = {
    id: string; // Inventory ID
    item_id: string;
    purchased_at: string;
    item: ShopItem;
    is_active: boolean; // Equipped
};

export async function getShopItems() {
    const supabase = await createClient();

    const { data } = await supabase
        .from('shop_items')
        .select('*')
        .order('cost', { ascending: true });

    return data as ShopItem[];
}

export async function getUserInventory() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data } = await supabase
        .from('user_inventory')
        .select(`
            id,
            item_id,
            purchased_at,
            is_active,
            item:shop_items (
                *
            )
        `)
        .eq('user_id', user.id);

    return data as unknown as InventoryItem[];
}

export async function buyItem(itemId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Non connecté" };

    // 1. Fetch Item Cost
    const { data: item } = await supabase
        .from('shop_items')
        .select('cost, name')
        .eq('id', itemId)
        .single();

    if (!item) return { error: "Objet introuvable" };

    // 2. Fetch User Credits
    const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .single();

    if (!profile) return { error: "Profil introuvable" };

    if ((profile.credits || 0) < item.cost) {
        return { error: `Pas assez de crédits ! (Manque ${item.cost - (profile.credits || 0)})` };
    }

    // 3. Perform Transaction (Ideally RPC or strict order)
    // A. Deduct Credits
    const { error: deductionError } = await supabase
        .from('profiles')
        .update({ credits: (profile.credits || 0) - item.cost })
        .eq('id', user.id);

    if (deductionError) {
        return { error: "Erreur lors du paiement" };
    }

    // B. Add to Inventory
    const { error: inventoryError } = await supabase
        .from('user_inventory')
        .insert({
            user_id: user.id,
            item_id: itemId
        });

    if (inventoryError) {
        // Critical: Refund (In real app, use database transaction)
        console.error("Inventory error, refunding...", inventoryError);
        await supabase
            .from('profiles')
            .update({ credits: profile.credits }) // Restore original
            .eq('id', user.id);
        return { error: "Erreur d'inventaire. Remboursé." };
    }

    revalidatePath('/shop');
    revalidatePath('/profile');

    return { success: true, message: `Vous avez acheté ${item.name} !` };
}
