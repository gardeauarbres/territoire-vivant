
const fs = require('fs');
const path = require('path');
const Groq = require('groq-sdk');

// 1. Load Env
function getEnv() {
    try {
        const content = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
        const env = {};
        content.split('\n').forEach(line => {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const val = parts.slice(1).join('=').trim();
                env[key] = val;
            }
        });
        return env;
    } catch (e) {
        console.error("Could not read .env.local");
        return {};
    }
}

const env = getEnv();
const groq = new Groq({ apiKey: env.GROQ_API_KEY });

// 2. Define Personas (Copied from app/actions/esprit.ts)
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

async function testPersona(type, question) {
    const persona = PERSONAS[type];
    console.log(`\n--- TESTING: ${type.toUpperCase()} ---`);
    console.log(`User: "${question}"`);
    console.log(`System: You are ${persona.role}. ${persona.tone}`);

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Tu es "${persona.role}".\nTon caractère :\n${persona.tone}\nTu aides l'utilisateur à se reconnecter à la nature.\nSois bref, poétique et immersif.`,
                },
                {
                    role: "user",
                    content: question,
                },
            ],
            model: "llama-3.3-70b-versatile",
        });

        console.log(`AI Response: "${completion.choices[0]?.message?.content}"`);
        return true;
    } catch (error) {
        console.error("❌ API Error:", error.message);
        return false;
    }
}

async function run() {
    console.log("🚀 Starting Groq API Verification...");

    await testPersona('fauna', "Quel animal règne ici ?");
    await testPersona('water', "La rivière est-elle calme ?");

    console.log("\n✅ Verification Complete.");
}

run();
