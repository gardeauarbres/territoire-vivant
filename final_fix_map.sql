-- Ensure category column exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'zones' AND column_name = 'category') THEN 
        ALTER TABLE zones ADD COLUMN category text default 'flora'; 
    END IF; 
END $$;

-- Clean slate
DELETE FROM zones;

-- National Parks (Fauna/Flora)
INSERT INTO zones (name, description, latitude, longitude, radius_meters, target_species, category) VALUES
('Parc National de la Vanoise', 'Premier parc national français, royaume des bouquetins.', 45.3333, 6.8333, 15000, ARRAY['Bouquetin', 'Marmotte', 'Aigle Royal'], 'fauna'),
('Parc National des Écrins', 'Hautes montagnes et glaciers.', 44.8333, 6.2500, 15000, ARRAY['Chamois', 'Chocard', 'Génépi'], 'fauna'),
('Parc National des Cévennes', 'Paysages de schiste et de granit.', 44.1667, 3.5000, 15000, ARRAY['Vautour Fauve', 'Castor', 'Loutre'], 'fauna'),
('Parc National de Port-Cros', 'Premier parc marin d''Europe.', 43.0000, 6.4000, 8000, ARRAY['Mérou brun', 'Posidonie', 'Puffin yelkouan'], 'water'),
('Parc National de la Guadeloupe', 'Forêt tropicale et volcan.', 16.1500, -61.6667, 15000, ARRAY['Racoon', 'Pic de Guadeloupe', 'Héliconia'], 'flora'),
('Parc National de la Réunion', 'Pitons, cirques et remparts.', -21.1150, 55.5364, 15000, ARRAY['Tuit-tuit', 'Pétrel de Barau', 'Fougère arborescente'], 'flora');

-- Regional Natural Parks (PNR) - Mixed
INSERT INTO zones (name, description, latitude, longitude, radius_meters, target_species, category) VALUES
('PNR des Volcans d''Auvergne', 'Chaîne de volcans endormis.', 45.5000, 2.7500, 10000, ARRAY['Gentiane', 'Mouflon', 'Milan Royal'], 'flora'),
('PNR du Luberon', 'Massif calcaire et villages perchés.', 43.8000, 5.2500, 10000, ARRAY['Aigle de Bonelli', 'Lézard ocellé', 'Thym'], 'flora'),
('PNR de Brière', 'Deuxième plus grand marais de France.', 47.3667, -2.2000, 8000, ARRAY['Spatule blanche', 'Anguille', 'Roseau'], 'water');

-- Natura 2000 & Specific Habitats
INSERT INTO zones (name, description, latitude, longitude, radius_meters, target_species, category) VALUES
('Lac du Der-Chantecoq', 'Grand lac de Champagne, escale des grues.', 48.5500, 4.7500, 6000, ARRAY['Grue cendrée', 'Cygne chanteur', 'Carpe'], 'water'),
('Marais Poitevin', 'La Venise Verte, labyrinthe de canaux.', 46.3333, -0.6667, 8000, ARRAY['Angélique', 'Loutre d''Europe', 'Héron Cendré'], 'water'),
('Baie de Somme', 'Estuaire picard, refuge des phoques.', 50.2167, 1.6167, 6000, ARRAY['Phoque Veau-Marin', 'Salicorne', 'Tadorne de Belon'], 'water'),
('Forêt de Tronçais', 'Chênaie antique réputée pour ses arbres remarquables.', 46.6667, 2.7167, 6000, ARRAY['Chêne Colbert', 'Cerf Elaphe', 'Pic Noir'], 'flora'),
('Forêt de Compiègne', 'Vaste forêt royale aux allées majestueuses.', 49.4000, 2.8667, 6000, ARRAY['Sanglier', 'Muguet', 'Chevreuil'], 'flora'),
('Réserve de Sigean', 'Zones humides lagunaires.', 43.0464, 2.9772, 4000, ARRAY['Flamant Rose', 'Pélican', 'Tortue Cistude'], 'fauna'),
('Parc du Marquenterre', 'Réserve ornithologique au cœur de la Baie de Somme.', 50.2625, 1.5586, 3000, ARRAY['Avocette élégante', 'Cigogne blanche', 'Spatule'], 'fauna');
