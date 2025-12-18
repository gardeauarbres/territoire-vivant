


const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local because dotenv might not be installed
function parseEnv(filePath) {
    if (!fs.existsSync(filePath)) return {};
    const content = fs.readFileSync(filePath, 'utf8');
    const config = {};
    content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            let value = match[2] || '';
            if (value && value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
                value = value.replace(/\\n/gm, '\n');
            }
            value = value.replace(/(^['"]|['"]$)/g, '').trim();
            config[match[1]] = value;
        }
    });
    return config;
}

// Load env vars
try {
    // Current working directory should be project root
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envConfig = parseEnv(envPath);

    // Fallback to process.env
    const supabaseUrl = envConfig.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = envConfig.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("Missing Supabase credentials in .env.local");
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const ZONES = [
        // National Parks (Fauna/Flora)
        { name: 'Parc National de la Vanoise', description: 'Premier parc national français, royaume des bouquetins.', latitude: 45.3333, longitude: 6.8333, radius_meters: 15000, target_species: ['Bouquetin', 'Marmotte', 'Aigle Royal'], category: 'fauna' },
        { name: 'Parc National des Écrins', description: 'Hautes montagnes et glaciers.', latitude: 44.8333, longitude: 6.2500, radius_meters: 15000, target_species: ['Chamois', 'Chocard', 'Génépi'], category: 'fauna' },
        { name: 'Parc National des Cévennes', description: 'Paysages de schiste et de granit.', latitude: 44.1667, longitude: 3.5000, radius_meters: 15000, target_species: ['Vautour Fauve', 'Castor', 'Loutre'], category: 'fauna' },
        { name: 'Parc National de Port-Cros', description: 'Premier parc marin d\'Europe.', latitude: 43.0000, longitude: 6.4000, radius_meters: 8000, target_species: ['Mérou brun', 'Posidonie', 'Puffin yelkouan'], category: 'water' },
        { name: 'Parc National de la Guadeloupe', description: 'Forêt tropicale et volcan.', latitude: 16.1500, longitude: -61.6667, radius_meters: 15000, target_species: ['Racoon', 'Pic de Guadeloupe', 'Héliconia'], category: 'flora' },
        { name: 'Parc National de la Réunion', description: 'Pitons, cirques et remparts.', latitude: -21.1150, longitude: 55.5364, radius_meters: 15000, target_species: ['Tuit-tuit', 'Pétrel de Barau', 'Fougère arborescente'], category: 'flora' },

        // PNR
        { name: 'PNR des Volcans d\'Auvergne', description: 'Chaîne de volcans endormis.', latitude: 45.5000, longitude: 2.7500, radius_meters: 10000, target_species: ['Gentiane', 'Mouflon', 'Milan Royal'], category: 'flora' },
        { name: 'PNR du Luberon', description: 'Massif calcaire et villages perchés.', latitude: 43.8000, longitude: 5.2500, radius_meters: 10000, target_species: ['Aigle de Bonelli', 'Lézard ocellé', 'Thym'], category: 'flora' },
        { name: 'PNR de Brière', description: 'Deuxième plus grand marais de France.', latitude: 47.3667, longitude: -2.2000, radius_meters: 8000, target_species: ['Spatule blanche', 'Anguille', 'Roseau'], category: 'water' },

        // Specific Habitats
        { name: 'Lac du Der-Chantecoq', description: 'Grand lac de Champagne, escale des grues.', latitude: 48.5500, longitude: 4.7500, radius_meters: 6000, target_species: ['Grue cendrée', 'Cygne chanteur', 'Carpe'], category: 'water' },
        { name: 'Marais Poitevin', description: 'La Venise Verte, labyrinthe de canaux.', latitude: 46.3333, longitude: -0.6667, radius_meters: 8000, target_species: ['Angélique', 'Loutre d\'Europe', 'Héron Cendré'], category: 'water' },
        { name: 'Baie de Somme', description: 'Estuaire picard, refuge des phoques.', latitude: 50.2167, longitude: 1.6167, radius_meters: 6000, target_species: ['Phoque Veau-Marin', 'Salicorne', 'Tadorne de Belon'], category: 'water' },
        { name: 'Forêt de Tronçais', description: 'Chênaie antique réputée pour ses arbres remarquables.', latitude: 46.6667, longitude: 2.7167, radius_meters: 6000, target_species: ['Chêne Colbert', 'Cerf Elaphe', 'Pic Noir'], category: 'flora' },
        { name: 'Forêt de Compiègne', description: 'Vaste forêt royale aux allées majestueuses.', latitude: 49.4000, longitude: 2.8667, radius_meters: 6000, target_species: ['Sanglier', 'Muguet', 'Chevreuil'], category: 'flora' },
        { name: 'Réserve de Sigean', description: 'Zones humides lagunaires.', latitude: 43.0464, longitude: 2.9772, radius_meters: 4000, target_species: ['Flamant Rose', 'Pélican', 'Tortue Cistude'], category: 'fauna' },
        { name: 'Parc du Marquenterre', description: 'Réserve ornithologique au cœur de la Baie de Somme.', latitude: 50.2625, longitude: 1.5586, radius_meters: 3000, target_species: ['Avocette élégante', 'Cigogne blanche', 'Spatule'], category: 'fauna' }
    ];

    async function seed() {
        console.log(`Seeding ${ZONES.length} zones...`);
        const { data, error } = await supabase.from('zones').insert(ZONES).select();

        if (error) {
            console.error('Error inserting zones:', error);
        } else {
            console.log('Success! Inserted:', data.length, 'zones.');
        }
    }

    seed();
} catch (e) {
    console.error("Script setup failed:", e);
}
