-- Peuplement du catalogue depuis src/lib/service-catalog.ts
-- 42 prestations, 13 finitions.

INSERT INTO public.services
  (id, name, category, description, price, duration_min, duration_label, price_on_quote, price_note, sort_order)
VALUES
  ('head-spa-decouverte', 'Head Spa Découverte', 'Head Spa', 'Massage relaxant du cuir chevelu, shampooing, soin profond et aromathérapie (séchage naturel).', 85, 40, '40 min', false, null, 0),
  ('head-spa-signature', 'Head Spa Signature', 'Head Spa', 'Nettoyage profond, massage cou/épaules, arche d''eau et dôme de vapeur (séchage naturel).', 120, 60, '1h00', false, null, 10),
  ('head-spa-premium', 'Head Spa Premium', 'Head Spa', 'Rituel entièrement sur-mesure après diagnostic approfondi personnalisé.', 145, 80, '1h20', false, null, 20),
  ('visage-bio', 'Soin Visage Bio', 'Soins Visage', 'Nettoyage doux, gommage enzymatique, massage et masque botanique certifié bio.', 60, 45, '45 min', false, null, 30),
  ('visage-hydratant-vapeur', 'Soin Hydratant Purifiant Vapeur', 'Soins Visage', 'Extraction des comédons sous vapeur ionisée, purification profonde et modelage éclat.', 90, 60, '1h 00 min', false, null, 40),
  ('visage-signature', 'Soin du visage signature', 'Soins Visage', 'Succion hydro-mécanique, sérums antioxydants et acide hyaluronique.', 105, 45, '45 min', false, null, 50),
  ('visage-regenerant', 'Soin du visage régénérant', 'Soins Visage', 'Micro-perforations contrôlées, stimulation collagène et cocktail vitaminé.', 160, 60, '1h 00 min', false, null, 60),
  ('visage-algues', 'Soin aux Algues Naturel', 'Soins Visage', 'Masque plastifiant reminéralisant aux extraits d’algues marines pures.', 100, 60, '1h 00 min', false, null, 70),
  ('brushing', 'Brushing', 'Brushing & Coupe', 'Shampooing, après-shampooing et coiffage lisse ou wavy élégant.', 20, 45, '30 à 45 min', false, 'Tarif ajustable selon la longueur et l’épaisseur des cheveux.', 80),
  ('coupe-soin', 'Coupe + Soin express', 'Brushing & Coupe', 'Conseil visagiste, coupe et soin crème nourrissant instantané.', 20, 45, '45 min', false, null, 90),
  ('couleur-racine', 'Couleur Racine + Brushing', 'Coloration', 'Retouche racines parfaite avec coloration sensorielle protectrice.', 0, 75, '1h 15 min', true, 'Tarif personnalisé établi lors du diagnostic, selon la longueur et la masse capillaire.', 100),
  ('couleur-tete', 'Couleur Tête Entière + Brushing', 'Coloration', 'Application globale pour une brillance miroir et une intensité uniforme.', 0, 105, '1h 45 min', true, 'Tarif personnalisé établi lors du diagnostic, selon la longueur et la masse capillaire.', 110),
  ('meches-patine', 'Mèches + Patine + Soin Olaplex + Brushing', 'Techniques', 'Éclaircissement à l''argile, patine sur-mesure et reconstruction Olaplex.', 190, 180, '3h 00 min', false, null, 120),
  ('ombre-hair', 'Ombré Hair + Soin Olaplex + Soin Kératine + Brushing', 'Techniques', 'Transition de couleur divine par excellence, alliant Olaplex et Kératine.', 350, 240, '4h 00 min', false, null, 130),
  ('contouring', 'Contouring + Soin Kératine + Brushing', 'Techniques', 'Touches d''éclat encadrant le visage, renforcées à la kératine.', 100, 90, '1h 30 min', false, null, 140),
  ('lissage-bresilien', 'Lissage Brésilien', 'Lissages', 'Réduction intense du volume et réparation profonde, tenue 4 à 6 mois.', 200, 180, '3h 00 min', false, null, 150),
  ('lissage-tanin', 'Lissage au Tanin', 'Lissages', 'Lissage organique aux polyphénols de raisin, renforce sans étouffer.', 200, 180, '3h 00 min', false, null, 160),
  ('lissage-nano', 'Lissage Nano Indiens', 'Lissages', 'Huiles indiennes et bionanotechnologies, lissage miroir longue durée.', 200, 210, '3h 30 min', false, null, 170),
  ('lissage-biotine', 'Lissage Spécial Biotine', 'Lissages', 'Vitamine B7 pour activer la pousse et un fini ultra lisse.', 200, 180, '3h 00 min', false, null, 180),
  ('botox-biotine', 'Botox Biotine', 'Lissages', 'Soin rajeunissant anti-frisottis, matière, force et éclat naturel.', 150, 120, '2h 00 min', false, null, 190),
  ('proteine-biotine', 'Protéine Biotine', 'Lissages', 'Traitement fortifiant pour combler les brèches cuticulaires.', 200, 150, '2h 30 min', false, null, 200),
  ('crp', 'Soin Capillaire CRP (Cortex Repair Protocol)', 'Lissages', 'Reconstruction moléculaire pour cheveux sensibilisés ou cassants.', 220, 135, '2h 15 min', false, null, 210),
  ('sourcils-restruc', 'Restructuration Sourcils', 'Regard', 'Étude morphologique, épilation de précision et finition symétrique.', 25, 30, '30 min', false, null, 220),
  ('browlift', 'Browlift Signature', 'Regard', 'Discipline, rehausse et épaissit les sourcils pour 6 à 8 semaines.', 65, 45, '45 min', false, null, 230),
  ('rehaussement-cils', 'Rehaussement de Cils (Yumi Lash style)', 'Regard', 'Courbe durable des cils, soin fortifiant kératine et teinture noire.', 75, 60, '1h 00 min', false, null, 240),
  ('pack-regard', 'Pack Regard Sublime (Browlift + Rehaussement + Teintures)', 'Regard', 'Restructuration, Browlift, Rehaussement et teintures assorties.', 120, 90, '1h 30 min', false, null, 250),
  ('ipl-aisselles', 'Aisselles (la séance)', 'IPL', 'Traitement ultra-rapide et sécurisé pour une peau nette.', 50, 15, '15 min', false, null, 260),
  ('ipl-maillot-classique', 'Maillot Classique (la séance)', 'IPL', 'Définition des contours de maillot standard, peau douce garantie.', 50, 25, '25 min', false, null, 270),
  ('ipl-maillot-integral', 'Maillot Intégral (la séance)', 'IPL', 'Élimination complète incluant les zones intérieures délicates.', 50, 35, '35 min', false, null, 280),
  ('ipl-demi-bras', 'Demi-Bras (la séance)', 'IPL', 'Traitement des poignets jusqu’aux coudes.', 50, 20, '20 min', false, null, 290),
  ('ipl-bras', 'Bras Entiers (la séance)', 'IPL', 'Épilation complète des bras pour une douceur totale.', 100, 35, '35 min', false, null, 300),
  ('ipl-demi-jambes', 'Demi-Jambes (la séance)', 'IPL', 'Traitement performant couvrant des chevilles aux genoux.', 50, 30, '30 min', false, null, 310),
  ('ipl-jambes', 'Jambes Entières (la séance)', 'IPL', 'La séance globale, plus jamais de rasoir.', 100, 50, '50 min', false, null, 320),
  ('ipl-sif', 'SIF - Sillon Interfessier (la séance)', 'IPL', 'Retouche d''épilation ciblée et respectueuse de l''intimité.', 30, 15, '15 min', false, null, 330),
  ('detat-sourcils', 'Sourcils (la séance)', 'Détatouage', 'Effacement esthétique intégral des sourcils, fondu naturel restauré.', 90, 45, '45 min', false, null, 340),
  ('detat-rousseur', 'Taches de Rousseur (la séance)', 'Détatouage', 'Atténuation esthétique ciblée d''une dermopigmentation trop marquée.', 70, 30, '30 min', false, null, 350),
  ('detat-levres', 'Contour des Lèvres (la séance)', 'Détatouage', 'Retrait sélectif des lignes de lèvres irrégulières ou baveuses.', 120, 50, '50 min', false, null, 360),
  ('dentaire-soft', 'Formule SOFT WHITE', 'Sourire', 'Coup d''éclat express, idéal pour rafraîchir un blanchiment antérieur.', 60, 30, '30 min', false, null, 370),
  ('dentaire-max', 'Formule MAX WHITE', 'Sourire', 'Protocole complet, 3 à 6 teintes de blancheur en une séance double LED.', 100, 50, '50 min', false, null, 380),
  ('dentaire-extra', 'Formule EXTRA WHITE', 'Sourire', 'Triple action pour un éclat dentaire maximal.', 160, 75, '1h 15 min', false, null, 390),
  ('corps-algues', 'Soin Corps Complet aux Algues', 'Corps', 'Gommage aux sels marins, enveloppement chaud aux algues micronisées et modelage drainant.', 150, 80, '1h 20 min', false, null, 400),
  ('corps-zone', 'Zone Ciblée aux Algues (Ventre/Cuisses/Fesses)', 'Corps', 'Cataplasme chaud d''algues purifiantes, idéal pour déstocker et soulager.', 90, 45, '45 min', false, null, 410)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.service_upsells
  (id, service_id, name, price, description, sort_order)
VALUES
  ('h-up-brush', 'head-spa-signature', 'Brushing Finition Prestige', 20, 'Séchage structuré avec élixir protecteur.', 0),
  ('h-up-amp', 'head-spa-signature', 'Ampoule Kératine pure', 10, 'Infusion sous vapeur pour fortifier le cheveu.', 10),
  ('v-up-glass', 'visage-signature', 'Masque d''Or Pur 24 Carats', 20, 'Glow ultime et effet repulpant immédiat.', 0),
  ('v-up-led', 'visage-signature', 'Photothérapie LED Anti-âge', 15, 'Stimule la néocollagénèse cutanée.', 10),
  ('coupe-up-brush', 'coupe-soin', 'Supplément Brushing', 20, 'Coiffage professionnel en supplément.', 0),
  ('c-up-pat', 'ombre-hair', 'Patine Brillance Miroir', 25, 'Neutralise les reflets jaunâtres.', 0),
  ('c-up-bot', 'ombre-hair', 'Soin Botox express', 40, 'Redonne matière et gaine après éclaircissement.', 10),
  ('liss-up-kit', 'lissage-bresilien', 'Kit d''entretien Pro-Kératine', 45, 'Shampoing et masque pour prolonger le lissage.', 0),
  ('r-up-teint', 'browlift', 'Teinture Hybride haute tenue', 15, 'Accentue la ligne naturelle.', 0),
  ('r-up-boost', 'browlift', 'Soin Kératine Boost réparateur', 10, 'Sérum gainant nutrition longue tenue.', 10),
  ('i-up-sif', 'ipl-maillot-integral', 'Option zone SIF (Sillon)', 20, 'Ajout de la zone délicate en tarif préférentiel.', 0),
  ('d-up-repair', 'dentaire-max', 'Soin Protect Émail minéralisant', 15, 'Referme les pores et renforce la barrière.', 0),
  ('b-up-leg', 'corps-algues', 'Drainage cryo Jambes Légères', 25, 'Active la circulation contre les jambes lourdes.', 0)
ON CONFLICT (id) DO NOTHING;
