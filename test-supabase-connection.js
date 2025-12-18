
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually parse .env.local
function getEnv() {
    try {
        const content = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
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

async function testConnection() {
    const env = getEnv();
    const url = env.NEXT_PUBLIC_SUPABASE_URL;
    const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    console.log("Testing connection to:", url);

    if (!url || !key) {
        console.error("ERROR: Missing env vars in .env.local");
        return;
    }

    const supabase = createClient(url, key);

    console.log("Fetching exact count...");
    const { count, error: countError } = await supabase.from('zones').select('*', { count: 'exact', head: true });

    if (countError) {
        console.error("COUNT ERROR:", countError);
    } else {
        console.log("Initial Head Count:", count);
    }

    console.log("Fetching rows with SELECT *...");
    const { data, error } = await supabase.from('zones').select('*');

    if (error) {
        console.error("FETCH ERROR:", error);
    } else {
        console.log("SUCCESS. Rows returned:", data ? data.length : 0);
        if (data && data.length > 0) {
            console.log("First row sample:", JSON.stringify(data[0]));
        } else {
            console.log("WARNING: Table is empty [].");
        }
    }
}

testConnection();
