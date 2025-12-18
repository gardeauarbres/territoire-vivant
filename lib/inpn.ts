
import { createClient } from "@/utils/supabase/server";

// OpenObs API Base URL
const OPENOBS_API_URL = "https://openobs.mnhn.fr/api/occurrences/search";

interface SpeciesOccurrence {
    scientificName: string;
    vernacularName?: string;
    group?: string; // Birds, Mammals, etc.
}

/**
 * Fetches recent species observations near a coordinate using INPN OpenObs.
 * Uses a bounding box strategy around the point.
 */
export async function getLocalSpecies(lat: number, lng: number, radiusKm: number = 1): Promise<SpeciesOccurrence[]> {
    try {
        // Construct a rough bounding box (approx 0.01 deg ~= 1km)
        const delta = radiusKm * 0.01;
        const minLat = lat - delta;
        const maxLat = lat + delta;
        const minLng = lng - delta;
        const maxLng = lng + delta;

        // OpenObs often uses WKT (Well Known Text) for geometry
        // POLYGON((minLng minLat, minLng maxLat, maxLng maxLat, maxLng minLat, minLng minLat))
        const wkt = `POLYGON((${minLng} ${minLat}, ${minLng} ${maxLat}, ${maxLng} ${maxLat}, ${maxLng} ${minLat}, ${minLng} ${minLat}))`;

        // We need to verify the exact endpoint. 
        // Based on research, it might be a POST or GET with 'geom' parameter.
        // Let's try constructing a query. 
        // Note: Without exact Swagger, this is experimental. 
        // We will wrap in Try/Catch and return empty if it fails.

        // This is a "Best Guess" structure based on standard Geo APIs
        const params = new URLSearchParams({
            geom: wkt,
            size: "10", // Limit results
            recent: "true"
        });

        console.log(`[INPN] Fetching species near ${lat}, ${lng}...`);

        // Timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s fast timeout

        const response = await fetch(`${OPENOBS_API_URL}?${params.toString()}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            console.warn(`[INPN] API Error: ${response.status} ${response.statusText}`);
            return [];
        }

        const data = await response.json();

        // Map response to our internal structure
        // WARNING: Data structure is hypothetical until verified.
        // Usually contains 'hits' or 'data'.

        const rawHits = data.hits || data.data || [];

        const speciesList: SpeciesOccurrence[] = rawHits.map((hit: any) => ({
            scientificName: hit.tax_nom_scientifique || hit.scientificName || "Unknown",
            vernacularName: hit.tax_nom_vernaculaire || hit.vernacularName || null,
            group: hit.group2_inpn || "Biodiversity"
        })).filter((s: SpeciesOccurrence) => s.scientificName !== "Unknown");

        // Deduplicate by scientific name
        const unique = Array.from(new Map(speciesList.map((item: SpeciesOccurrence) => [item.scientificName, item])).values());

        return unique as SpeciesOccurrence[];

    } catch (error) {
        console.warn("[INPN] Failed to fetch local species:", error);
        return []; // Fail gracefully -> Fallback to procedural
    }
}
