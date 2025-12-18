
const Groq = require("groq-sdk");
const fs = require("fs");
const path = require("path");

// Manually load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
let loadedKey = "";

if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    const match = content.match(/GROQ_API_KEY=(.*)/);
    if (match && match[1]) {
        loadedKey = match[1].trim();
    }
}
process.env.GROQ_API_KEY = loadedKey || process.env.GROQ_API_KEY;

async function testVision() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error("❌ NO API KEY FOUND");
        return;
    }

    console.log("🔑 API Key found");
    const groq = new Groq({ apiKey });

    // 1x1 Transparent Pixel Base64
    const tinyImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

    try {
        console.log("🔍 Listing Available Models...");
        const models = await groq.models.list();

        const allModels = models.data.map(m => m.id);
        fs.writeFileSync("all_models.log", JSON.stringify(allModels, null, 2), "utf8");
        console.log("Logged " + allModels.length + " models.");

    } catch (error) {
        console.error("❌ Failed:", error.message);
    }
}

testVision();
