export interface Mission {
    id: string;
    title: string;
    description: string;
    xp: number;
    type: 'quiz' | 'action' | 'observation';
}

export interface Spot {
    id: string;
    name: string;
    description: string;
    type: 'tree' | 'garden' | 'observation' | 'fauna';
    imageUrl?: string;
    level: number;
    stats: {
        water: number; // 0-100
        sun: number;   // 0-100
        biodiversity: number; // 0-100
    };
    missions: Mission[];
}

export const SPOTS: Spot[] = [
    {
        id: 'chene-vieux',
        name: 'Le Grand Chêne',
        description: 'Un chêne sessile centenaire, gardien de la clairière. Il abrite plus de 300 espèces d\'insectes.',
        type: 'tree',
        level: 5,
        stats: {
            water: 60,
            sun: 80,
            biodiversity: 95
        },
        missions: [
            {
                id: 'm1',
                title: 'Compte les habitants',
                description: 'Observe l\'écorce pendant 1 minute. Combien de fourmis vois-tu ?',
                xp: 50,
                type: 'observation'
            },
            {
                id: 'm2',
                title: 'Quiz Chêne',
                description: 'Quelle est la forme de mes feuilles ?',
                xp: 30,
                type: 'quiz'
            }
        ]
    },
    {
        id: 'mare-pedagogique',
        name: 'La Mare aux Grenouilles',
        description: 'Zone humide essentielle pour les libellules et les amphibiens.',
        type: 'observation',
        level: 3,
        stats: {
            water: 90,
            sun: 50,
            biodiversity: 85
        },
        missions: [
            {
                id: 'm3',
                title: 'Niveau d\'eau',
                description: 'L\'eau atteint-elle le repère rouge ?',
                xp: 40,
                type: 'action'
            }
        ]
    }
];

export function getSpot(id: string): Spot | undefined {
    return SPOTS.find(s => s.id === id);
}

export interface Species {
    id: string;
    name: string;
    family: 'flora' | 'fauna' | 'fungi' | 'water' | 'mineral';
    rarity: 'common' | 'rare' | 'legendary';
    description: string;
    funFact: string;
    xpReward: number;
    imagePlaceholder: string; // Color code or icon name for now
}

export const BIODEX: Species[] = [
    {
        id: 'ecureuil-roux',
        name: 'Écureuil Roux',
        family: 'fauna',
        rarity: 'common',
        description: 'Un petit rongeur arboricole agile, reconnaissable à sa queue en panache.',
        funFact: 'Il oublie 70% de ses cachettes de noisettes, ce qui aide à planter des arbres !',
        xpReward: 50,
        imagePlaceholder: 'bg-orange-500'
    },
    {
        id: 'chene-sessile',
        name: 'Chêne Sessile',
        family: 'flora',
        rarity: 'common',
        description: 'Un grand arbre à feuilles caduques, roi des forêts tempérées.',
        funFact: 'Il peut vivre plus de 1000 ans et abrite des centaines d\'espèces.',
        xpReward: 30,
        imagePlaceholder: 'bg-emerald-700'
    },
    {
        id: 'lucane-cerf-volant',
        name: 'Lucane Cerf-Volant',
        family: 'fauna',
        rarity: 'rare',
        description: 'Le plus grand coléoptère d\'Europe, avec des mandibules impressionnantes.',
        funFact: 'Ses "cornes" ne servent qu\'à la lutte entre mâles, elles ne pincent pas fort.',
        xpReward: 150,
        imagePlaceholder: 'bg-red-700'
    },
    {
        id: 'triton-crete',
        name: 'Triton Crêté',
        family: 'water',
        rarity: 'legendary',
        description: 'Un amphibien aux allures de petit dragon aquatique.',
        funFact: 'C\'est une espèce protégée très sensible à la pollution de l\'eau.',
        xpReward: 500,
        imagePlaceholder: 'bg-indigo-600'
    },
    {
        id: 'amanite-tue-mouche',
        name: 'Amanite Tue-Mouches',
        family: 'fungi',
        rarity: 'rare',
        description: 'Le célèbre champignon rouge à pois blancs. Beau mais toxique !',
        funFact: 'Il est souvent associé aux lutins et aux fées dans le folklore.',
        xpReward: 100,
        imagePlaceholder: 'bg-red-500'
    },
    {
        id: 'heron-cendre',
        name: 'Héron Cendré',
        family: 'fauna',
        rarity: 'common',
        description: 'Grand échassier gris, souvent immobile au bord de l\'eau.',
        funFact: 'Il peut rester des heures sans bouger en attendant un poisson.',
        xpReward: 60,
        imagePlaceholder: 'bg-slate-400'
    }
];
