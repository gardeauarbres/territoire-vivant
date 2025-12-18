"use server";

import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export interface ScanResult {
    name: string;
    scientificName: string;
    confidence: number;
    description: string;
    category: 'flora' | 'fauna' | 'fungi' | 'other';
    stat_bonus?: {
        scientific: number;
        exploration: number;
        collection: number;
    };
}

// ... imports

export type ScanResponse =
    | { success: true; data: ScanResult }
    | { success: false; error: string };

export async function analyzeImage(base64Image: string): Promise<ScanResponse> {
    // MANUAL OVERRIDE: AI disabled by user request.
    // The Admin will identify the species.

    // Simulate a short delay so the UI doesn't flash
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        success: true,
        data: {
            name: "Espèce à identifier",
            scientificName: "Inconnu",
            confidence: 0,
            description: "En attente d'identification par un gardien.",
            category: 'other',
            stat_bonus: {
                scientific: 0,
                exploration: 0,
                collection: 0
            }
        }
    };
}
