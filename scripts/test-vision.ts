
import Groq from "groq-sdk";
import dotenv from "dotenv";
import path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function testVision() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error("❌ NO API KEY FOUND");
        return;
    }

    console.log("🔑 API Key found, length:", apiKey.length);
    const groq = new Groq({ apiKey });

    // 1x1 Transparent Pixel Base64
    const tinyImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

    try {
        console.log("🚀 Testing Model: llama-3.2-11b-vision-preview");

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "What is in this image? Answer in 1 word." },
                        {
                            type: "image_url",
                            image_url: {
                                url: tinyImage,
                            },
                        },
                    ],
                },
            ],
            model: "llama-3.2-11b-vision-preview",
        });

        console.log("✅ Success! Response:", completion.choices[0].message.content);

    } catch (error: any) {
        console.error("❌ Failed:", error.message);
        if (error.error?.code) {
            console.error("Error Code:", error.error.code);
        }
    }
}

testVision();
