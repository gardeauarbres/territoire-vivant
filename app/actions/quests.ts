"use server";

import { createClient } from "@/utils/supabase/server";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Simple Haversine formula for distance (in meters)
function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d * 1000;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
}


import { getLocalSpecies } from "@/lib/inpn";

export async function checkForQuest(lat: number, lng: number) {
    const supabase = await createClient();

    // 1. Get Authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return null;
    const userId = user.id;

    // 2. Get Zones
    const { data: zones } = await supabase.from('zones').select('*');

    // 3. Find Nearest Zone
    let nearestZone: any = null;
    let minDistance = Infinity;

    if (zones && zones.length > 0) {
        zones.forEach((zone: any) => {
            const dist = getDistanceFromLatLonInM(lat, lng, zone.latitude, zone.longitude);
            if (dist < minDistance) {
                minDistance = dist;
                nearestZone = zone;
            }
        });
    }

    // 3. Determine Context (Zone or Procedural)
    // If we are far from the nearest zone (> radius), we use "Procedural Mode"
    if (nearestZone && minDistance > (nearestZone.radius_meters || 5000)) {
        // User is outside the zone -> Infinite Quest Mode
        nearestZone = {
            id: null, // No DB link
            name: "Zone Sauvage Inconnue",
            description: "Un territoire vierge, hors des sentiers battus.",
            category: "flora", // Default to general nature
            target_species: ["Fleur Sauvage", "Insecte", "Arbre Ancien"]
        };
    } else if (!nearestZone) {
        // No zones in DB at all fallback
        nearestZone = {
            id: null,
            name: "Terres Inexplorées",
            description: "Le monde est vaste.",
            category: "flora",
            target_species: []
        };
    }

    // 4. Check if user already has an active quest
    const { data: existingQuests } = await supabase
        .from('quests')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .limit(1);

    if (existingQuests && existingQuests.length > 0) {
        const quest = existingQuests[0];

        // CHECK FOR COMPLETION
        // If the quest is linked to a zone, check if user is in that zone (or close enough)
        // If the quest is procedural/wild, we might complete it just by being back in a similar biome? 
        // For simplicity: If user is "simulating" or calling check, and they are in the zone, we complete it.
        // Actually, let's keep it simple: finding the species completes it via Scanner. 
        // BUT user asked "comment finaliser". Usually, checking in at the location VALIDATES the location part.
        // Let's implement: If you are at the location (within radius), you trigger a "Progress" or "Success" event.

        // Logic: If quest has zone_id, and we are close to that zone_id -> Complete?
        // OR: Quest is "Find X". Completion requires SCANNED PHOTO.
        // The user prompt implies they just "walk" and want it to finish?
        // "comment finaliser ma quete" -> typically scanner.
        // I will return 'existing' but with extra metadata "near_objective" if applicable.

        return { type: 'existing', quest: quest };
    }

    // 5. FETCH REAL SPECIES FROM INPN (API)
    // We try to get real observations around the user to make the quest authentic.
    let realSpecies: any[] = [];
    try {
        realSpecies = await getLocalSpecies(lat, lng, 1); // 1km radius
    } catch (err) {
        console.warn("INPN fetch failed, falling back to procedural species.");
    }

    // 6. Generate Quest with Groq
    try {
        // Decide species source: Real INPN data > Zone Target Species > Generic Fallback
        let speciesOption = "Espèce Mystère";
        let contextNote = "";

        if (realSpecies.length > 0) {
            // Pick a random real species
            const randomSpecimen = realSpecies[Math.floor(Math.random() * realSpecies.length)];
            speciesOption = randomSpecimen.vernacularName || randomSpecimen.scientificName;
            contextNote = `Cette espèce (${randomSpecimen.scientificName}) a été réellement observée dans ce secteur.`;
        } else if (nearestZone && nearestZone.target_species && nearestZone.target_species.length > 0) {
            speciesOption = nearestZone.target_species[Math.floor(Math.random() * nearestZone.target_species.length)];
        } else {
            // Fallback based on category
            const cat = nearestZone?.category || 'flora';
            if (cat === 'water') speciesOption = "Libellule";
            if (cat === 'flora') speciesOption = "Chêne";
            if (cat === 'fauna') speciesOption = "Mésange";
        }

        const prompt = `
            Tu es le Gardien du Jeu "Territoire Vivant" (Application de biodiversité).
            L'utilisateur est ici : ${lat}, ${lng} (${nearestZone?.name || "Zone Sauvage"}).
            Type de Milieu : ${nearestZone?.category ? nearestZone.category.toUpperCase() : "MIXTE"}.
            Description : "${nearestZone?.description || "Nature inexplorée"}".
            
            DONNÉE RÉELLE INPN (Important) : ${contextNote}
            
            Génère une quête d'observation contextuelle.
            Objectif : Trouver "${speciesOption}" ou un indice lié à ce milieu.
            
            JSON requis :
            {
                "title": "Titre immersif",
                "description": "2 phrases mystérieuses incluant l'indice INPN si disponible.",
                "objective_species": "${speciesOption}",
                "xp_reward": ${nearestZone?.id ? 50 : 25}
            }
        `;

        const completion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });


        const content = completion.choices[0]?.message?.content || "{}";
        const questData = JSON.parse(content);

        // 6. Save to DB
        // If zone is procedural (null id), we might need to handle the FK constraint.
        // If schema says zone_id uuid references zones(id), we CAN pass null if column is nullable.
        // Let's check schema: zone_id uuid references zones(id). It is nullable by default.

        const { data: newQuest, error: insertError } = await supabase.from('quests').insert({
            user_id: userId,
            zone_id: nearestZone.id || null, // Handle procedural
            title: questData.title || "Exploration Sauvage",
            description: questData.description || "Ouvrez l'œil, la nature est partout.",
            objective_species: questData.objective_species,
            xp_reward: questData.xp_reward || 25,
            status: 'active'
        }).select().single();

        if (insertError) {
            console.error("Error saving quest:", insertError);
            return null;
        }

        return { type: 'new', quest: newQuest };

    } catch (e) {
        console.error("Groq generation failed:", e);
        return null;
    }
}
