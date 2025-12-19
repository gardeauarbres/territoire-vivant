-- INSERT SPECIFIC LOCATIONS
-- Coordinates are approximate centers or specific landmarks.

INSERT INTO zones (name, description, latitude, longitude, category) VALUES
-- La Fare-les-Oliviers (13580)
('Castellas de La Fare', 'Ruines historiques offrant un panorama sur l''étang de Berre et une flore méditerranéenne riche.', 43.5539, 5.1944, 'flora'),
('Les Rives de l''Arc', 'Zone humide le long de la rivière Arc, habitat pour de nombreux amphibiens et libellules.', 43.5350, 5.1800, 'water'),

-- Boucoiran-et-Nozières (30190)
('Château de Boucoiran', 'Site historique abritant des espèces de chauves-souris et d''oiseaux nichant dans les murailles.', 43.9961, 4.1833, 'fauna'),
('Plaine du Gardon', 'Zone agricole et naturelle riche en biodiversité, idéale pour l''observation des oiseaux migrateurs.', 43.9800, 4.1900, 'flora'),

-- Gramat (46500)
('Parc Animalier de Gramat', 'Un espace immense dédié à la faune européenne et domestique. Idéal pour le Biodex.', 44.7758, 1.7136, 'fauna'),
('Causse de Gramat', 'Paysage calcaire typique du Lot, abritant une flore rase unique et des rapaces.', 44.7800, 1.7300, 'flora'),
('Le Moulin du Saut', 'Site pittoresque avec une cascade, parfait pour l''élément Eau.', 44.7950, 1.7000, 'water');
