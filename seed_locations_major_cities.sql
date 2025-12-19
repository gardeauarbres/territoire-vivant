-- INSERT MAJOR CITIES LOCATIONS
-- Sélection de lieux emblématiques pour la biodiversité urbaine.

INSERT INTO zones (name, description, latitude, longitude, category) VALUES

-- Lyon (69000)
('Parc de la Tête d''Or', 'Un immense parc urbain avec un lac, une roseraie et un zoo, véritable poumon vert de Lyon.', 45.7788, 4.8533, 'fauna'),
('Confluence Rhône-Saône', 'Point de rencontre des deux cours d''eau, zone riche en poissons et oiseaux aquatiques.', 45.7269, 4.8169, 'water'),
('Colline de Fourvière', 'Jardins suspendus et pentes boisées offrant un refuge à la petite faune.', 45.7621, 4.8222, 'flora'),

-- Marseille (13000)
('Parc National des Calanques', 'Un écosystème unique au monde entre falaises calcaires et mer Méditerranée.', 43.2148, 5.4334, 'fauna'),
('Iles du Frioul', 'Archipel aride abritant une flore rare et des oiseaux marins protégés.', 43.2758, 5.2974, 'flora'),
('Vieux-Port (Bassin)', 'Zone portuaire historique où l''on observe parfois une faune marine surprenante.', 43.2952, 5.3742, 'water'),

-- Bordeaux (33000)
('Jardin Public', 'Jardin à l''anglaise historique avec des arbres centenaires et des points d''eau.', 44.8485, -0.5786, 'flora'),
('Miroir d''Eau (Garonne)', 'Les quais de la Garonne, zone de fraîcheur et d''observation du fleuve.', 44.8422, -0.5694, 'water'),
('Réserve de Bruges', 'Réserve naturelle aux portes de la ville, sanctuaire pour les oiseaux migrateurs.', 44.8964, -0.6075, 'fauna'),

-- Lille (59000)
('Parc de la Citadelle', 'Le plus grand espace vert de Lille, entouré par le canal de la Deûle.', 50.6389, 3.0450, 'flora'),
('Canal de la Deûle', 'Voie d''eau urbaine reprenant vie, accueillant canards et poissons.', 50.6433, 3.0400, 'water'),

-- Strasbourg (67000)
('Parc de l''Orangerie', 'Le plus ancien parc de la ville, célèbre pour ses cigognes réintroduites.', 48.5911, 7.7789, 'fauna'),
('Petite France (Ill)', 'Quartier historique traversé par les canaux de l''Ill.', 48.5802, 7.7408, 'water'),

-- Nantes (44000)
('Jardin des Plantes', 'Jardin botanique remarquable avec des serres et une grande diversité végétale.', 47.2195, -1.5434, 'flora'),
('Les Machines de l''île (Loire)', 'Bords de Loire réaménagés, mélangeant art et nature fluviale.', 47.2067, -1.5644, 'water'),

-- Nice (06000)
('Promenade du Paillon', 'Coulée verte traversant la ville, riche en espèces végétales méditerranéennes.', 43.6994, 7.2764, 'flora'),
('Colline du Château', 'Parc offrant une vue imprenable et une cascade rafraîchissante.', 43.6953, 7.2800, 'water');
