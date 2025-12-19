-- 1. UPGRADE PROFILES TABLE (Streak System)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_streak_at TIMESTAMPTZ;

-- 2. POPULATE ZONES (Map Locations)
-- Deletes existing zones to avoid duplicates (Optional: remove if you want to keep them)
DELETE FROM zones WHERE description LIKE '%(Demo)%';

INSERT INTO zones (name, description, latitude, longitude, category) VALUES
('Jardin des Plantes', 'Un sanctuaire historique de biodiversité au cœur de Paris. (Demo)', 48.8439, 2.3596, 'flora'),
('Bassin de la Villette', 'Zone humide urbaine attirant de nombreux oiseaux aquatiques. (Demo)', 48.8856, 2.3735, 'water'),
('Bois de Vincennes', 'Le poumon vert de l''est parisien, riche en faune sauvage. (Demo)', 48.8283, 2.4330, 'fauna'),
('Parc des Buttes-Chaumont', 'Relief escarpé abritant des espèces végétales rares. (Demo)', 48.8809, 2.3828, 'flora'),
('Canal Saint-Martin', 'Corridor écologique vital pour les espèces aquatiques. (Demo)', 48.8732, 2.3667, 'water');

-- 3. MISSION EXAMPLE (Template)
-- Run this part ONLY if you have a User ID. Replace 'USER_ID_HERE' with your actual UUID.
-- INSERT INTO quests (user_id, title, description, xp_reward, objective_species, status) VALUES
-- ('USER_ID_HERE', 'Observateur Urbain', 'Identifiez 3 espèces d''oiseaux dans le Jardin des Plantes.', 150, 'Pigeon Ramier', 'active');
