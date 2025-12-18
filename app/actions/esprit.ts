"use server";

import Groq from "groq-sdk";

const getGroqClient = () => new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// Personas definition
const PERSONAS = {
    territory: {
        role: "L'Esprit du Territoire Vivant",
        tone: "Mystique, ancien, équilibré. Tu es la voix de la forêt entière."
    },
    fauna: {
        role: "L'Esprit de la Faune",
        tone: "Vif, sauvage, instinctif. Tu parles des animaux, du mouvement, de la chasse et de la survie. Tu es protecteur des bêtes."
    },
    flora: {
        role: "L'Esprit de la Flore",
        tone: "Calme, patient, enraciné. Tu parles de croissance, de saisons, de lumière et de racines. Tu as une sagesse lente."
    },
    water: {
        role: "L'Esprit de l'Eau",
        tone: "Fluide, profond, changeant. Tu parles de courants, de reflets, de pureté et de cycles infinis. Tu es apaisant ou tempétueux."
    }
};

export type SpiritType = keyof typeof PERSONAS;

export async function askEsprit(userMessage: string, spiritType: SpiritType = 'territory') {
    const persona = PERSONAS[spiritType];

    try {
        const completion = await getGroqClient().chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Tu es "${persona.role}".
          
          Ton caractère :
          ${persona.tone}
          
          Tu aides l'utilisateur à se reconnecter à la nature.
          Sois bref, poétique et immersif.`,
                },
                {
                    role: "user",
                    content: userMessage,
                },
            ],
            model: "llama-3.3-70b-versatile",
        });

        return completion.choices[0]?.message?.content || "Le vent emporte mes mots...";
    } catch (error) {
        console.error("Erreur Esprit DETAILED:", error);
        return "Une perturbation dans le flux numérique m'empêche de répondre.";
    }
}
