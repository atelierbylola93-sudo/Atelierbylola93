// Catalogue de prestations UNIQUE — source de vérité alignée sur src/data.ts.
// Consommé par le flux de réservation public (ReservationView) et l'espace
// patron (ManualReservationDialog). Ne jamais dupliquer ce catalogue.

export interface CatalogUpsell {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface CatalogService {
  id: string;
  name: string;
  /** Prix en euros. 0 lorsque `priceOnQuote` est vrai. */
  price: number;
  /** Durée effective utilisée pour le calcul des créneaux. */
  duration_min: number;
  /** Libellé de durée tel qu'affiché sur les pages de prestation (src/data.ts). */
  duration_label: string;
  category: string;
  description: string;
  priceOnQuote?: boolean;
  priceNote?: string;
  upsells: CatalogUpsell[];
}

export const SERVICE_CATALOG: CatalogService[] = [
  // ============ HEAD SPA ============
  {
    id: 'head-spa-decouverte',
    name: 'Head Spa Découverte',
    price: 85,
    duration_min: 40,
    duration_label: '40 min',
    category: 'Head Spa',
    description: "Massage relaxant du cuir chevelu, shampooing, soin profond et aromathérapie (séchage naturel).",
    upsells: [],
  },
  {
    id: 'head-spa-signature',
    name: 'Head Spa Signature',
    price: 120,
    duration_min: 60,
    duration_label: '1h00',
    category: 'Head Spa',
    description: "Nettoyage profond, massage cou/épaules, arche d'eau et dôme de vapeur (séchage naturel).",
    upsells: [
      { id: 'h-up-brush', name: 'Brushing Finition Prestige', price: 20, description: 'Séchage structuré avec élixir protecteur.' },
      { id: 'h-up-amp', name: 'Ampoule Kératine pure', price: 10, description: 'Infusion sous vapeur pour fortifier le cheveu.' },
    ],
  },
  {
    id: 'head-spa-premium',
    name: 'Head Spa Premium',
    price: 145,
    duration_min: 80,
    duration_label: '1h20',
    category: 'Head Spa',
    description: 'Rituel entièrement sur-mesure après diagnostic approfondi personnalisé.',
    upsells: [],
  },

  // ============ SOINS VISAGE ============
  {
    id: 'visage-bio',
    name: 'Soin Visage Bio',
    price: 60,
    duration_min: 45,
    duration_label: '45 min',
    category: 'Soins Visage',
    description: 'Nettoyage doux, gommage enzymatique, massage et masque botanique certifié bio.',
    upsells: [],
  },
  {
    id: 'visage-hydratant-vapeur',
    name: 'Soin Hydratant Purifiant Vapeur',
    price: 90,
    duration_min: 60,
    duration_label: '1h 00 min',
    category: 'Soins Visage',
    description: 'Extraction des comédons sous vapeur ionisée, purification profonde et modelage éclat.',
    upsells: [],
  },
  {
    id: 'visage-signature',
    name: 'Soin du visage signature',
    price: 105,
    duration_min: 45,
    duration_label: '45 min',
    category: 'Soins Visage',
    description: 'Succion hydro-mécanique, sérums antioxydants et acide hyaluronique.',
    upsells: [
      { id: 'v-up-glass', name: "Masque d'Or Pur 24 Carats", price: 20, description: 'Glow ultime et effet repulpant immédiat.' },
      { id: 'v-up-led', name: 'Photothérapie LED Anti-âge', price: 15, description: 'Stimule la néocollagénèse cutanée.' },
    ],
  },
  {
    id: 'visage-regenerant',
    name: 'Soin du visage régénérant',
    price: 160,
    duration_min: 60,
    duration_label: '1h 00 min',
    category: 'Soins Visage',
    description: 'Micro-perforations contrôlées, stimulation collagène et cocktail vitaminé.',
    upsells: [],
  },
  {
    id: 'visage-algues',
    name: 'Soin aux Algues Naturel',
    price: 100,
    duration_min: 60,
    duration_label: '1h 00 min',
    category: 'Soins Visage',
    description: 'Masque plastifiant reminéralisant aux extraits d’algues marines pures.',
    upsells: [],
  },

  // ============ BRUSHING & COUPE ============
  {
    id: 'brushing',
    name: 'Brushing',
    price: 20,
    duration_min: 45,
    duration_label: '30 à 45 min',
    category: 'Brushing & Coupe',
    description: 'Shampooing, après-shampooing et coiffage lisse ou wavy élégant.',
    priceNote: 'Tarif ajustable selon la longueur et l’épaisseur des cheveux.',
    upsells: [],
  },
  {
    id: 'coupe-soin',
    name: 'Coupe + Soin express',
    price: 20,
    duration_min: 45,
    duration_label: '45 min',
    category: 'Brushing & Coupe',
    description: 'Conseil visagiste, coupe et soin crème nourrissant instantané.',
    upsells: [
      { id: 'coupe-up-brush', name: 'Supplément Brushing', price: 20, description: 'Coiffage professionnel en supplément.' },
    ],
  },

  // ============ COLORATION ============
  {
    id: 'couleur-racine',
    name: 'Couleur Racine + Brushing',
    price: 0,
    priceOnQuote: true,
    duration_min: 75,
    duration_label: '1h 15 min',
    category: 'Coloration',
    description: 'Retouche racines parfaite avec coloration sensorielle protectrice.',
    priceNote: 'Tarif personnalisé établi lors du diagnostic, selon la longueur et la masse capillaire.',
    upsells: [],
  },
  {
    id: 'couleur-tete',
    name: 'Couleur Tête Entière + Brushing',
    price: 0,
    priceOnQuote: true,
    duration_min: 105,
    duration_label: '1h 45 min',
    category: 'Coloration',
    description: 'Application globale pour une brillance miroir et une intensité uniforme.',
    priceNote: 'Tarif personnalisé établi lors du diagnostic, selon la longueur et la masse capillaire.',
    upsells: [],
  },

  // ============ TECHNIQUES EXCLUSIVES ============
  {
    id: 'meches-patine',
    name: 'Mèches + Patine + Soin Olaplex + Brushing',
    price: 190,
    duration_min: 180,
    duration_label: '3h 00 min',
    category: 'Techniques',
    description: "Éclaircissement à l'argile, patine sur-mesure et reconstruction Olaplex.",
    upsells: [],
  },
  {
    id: 'ombre-hair',
    name: 'Ombré Hair + Soin Olaplex + Soin Kératine + Brushing',
    price: 350,
    duration_min: 240,
    duration_label: '4h 00 min',
    category: 'Techniques',
    description: 'Transition de couleur divine par excellence, alliant Olaplex et Kératine.',
    upsells: [
      { id: 'c-up-pat', name: 'Patine Brillance Miroir', price: 25, description: 'Neutralise les reflets jaunâtres.' },
      { id: 'c-up-bot', name: 'Soin Botox express', price: 40, description: 'Redonne matière et gaine après éclaircissement.' },
    ],
  },
  {
    id: 'contouring',
    name: 'Contouring + Soin Kératine + Brushing',
    price: 100,
    duration_min: 90,
    duration_label: '1h 30 min',
    category: 'Techniques',
    description: "Touches d'éclat encadrant le visage, renforcées à la kératine.",
    upsells: [],
  },

  // ============ LISSAGES & THÉRAPIE CAPILLAIRE ============
  {
    id: 'lissage-bresilien',
    name: 'Lissage Brésilien',
    price: 200,
    duration_min: 180,
    duration_label: '3h 00 min',
    category: 'Lissages',
    description: 'Réduction intense du volume et réparation profonde, tenue 4 à 6 mois.',
    upsells: [
      { id: 'liss-up-kit', name: "Kit d'entretien Pro-Kératine", price: 45, description: 'Shampoing et masque pour prolonger le lissage.' },
    ],
  },
  {
    id: 'lissage-tanin',
    name: 'Lissage au Tanin',
    price: 200,
    duration_min: 180,
    duration_label: '3h 00 min',
    category: 'Lissages',
    description: 'Lissage organique aux polyphénols de raisin, renforce sans étouffer.',
    upsells: [],
  },
  {
    id: 'lissage-nano',
    name: 'Lissage Nano Indiens',
    price: 200,
    duration_min: 210,
    duration_label: '3h 30 min',
    category: 'Lissages',
    description: "Huiles indiennes et bionanotechnologies, lissage miroir longue durée.",
    upsells: [],
  },
  {
    id: 'lissage-biotine',
    name: 'Lissage Spécial Biotine',
    price: 200,
    duration_min: 180,
    duration_label: '3h 00 min',
    category: 'Lissages',
    description: 'Vitamine B7 pour activer la pousse et un fini ultra lisse.',
    upsells: [],
  },
  {
    id: 'botox-biotine',
    name: 'Botox Biotine',
    price: 150,
    duration_min: 120,
    duration_label: '2h 00 min',
    category: 'Lissages',
    description: 'Soin rajeunissant anti-frisottis, matière, force et éclat naturel.',
    upsells: [],
  },
  {
    id: 'proteine-biotine',
    name: 'Protéine Biotine',
    price: 200,
    duration_min: 150,
    duration_label: '2h 30 min',
    category: 'Lissages',
    description: 'Traitement fortifiant pour combler les brèches cuticulaires.',
    upsells: [],
  },
  {
    id: 'crp',
    name: 'Soin Capillaire CRP (Cortex Repair Protocol)',
    price: 220,
    duration_min: 135,
    duration_label: '2h 15 min',
    category: 'Lissages',
    description: 'Reconstruction moléculaire pour cheveux sensibilisés ou cassants.',
    upsells: [],
  },

  // ============ REGARD ============
  {
    id: 'sourcils-restruc',
    name: 'Restructuration Sourcils',
    price: 25,
    duration_min: 30,
    duration_label: '30 min',
    category: 'Regard',
    description: 'Étude morphologique, épilation de précision et finition symétrique.',
    upsells: [],
  },
  {
    id: 'browlift',
    name: 'Browlift Signature',
    price: 65,
    duration_min: 45,
    duration_label: '45 min',
    category: 'Regard',
    description: 'Discipline, rehausse et épaissit les sourcils pour 6 à 8 semaines.',
    upsells: [
      { id: 'r-up-teint', name: 'Teinture Hybride haute tenue', price: 15, description: 'Accentue la ligne naturelle.' },
      { id: 'r-up-boost', name: 'Soin Kératine Boost réparateur', price: 10, description: 'Sérum gainant nutrition longue tenue.' },
    ],
  },
  {
    id: 'rehaussement-cils',
    name: 'Rehaussement de Cils (Yumi Lash style)',
    price: 75,
    duration_min: 60,
    duration_label: '1h 00 min',
    category: 'Regard',
    description: 'Courbe durable des cils, soin fortifiant kératine et teinture noire.',
    upsells: [],
  },
  {
    id: 'pack-regard',
    name: 'Pack Regard Sublime (Browlift + Rehaussement + Teintures)',
    price: 120,
    duration_min: 90,
    duration_label: '1h 30 min',
    category: 'Regard',
    description: 'Restructuration, Browlift, Rehaussement et teintures assorties.',
    upsells: [],
  },

  // ============ IPL ============
  {
    id: 'ipl-aisselles',
    name: 'Aisselles (la séance)',
    price: 50,
    duration_min: 15,
    duration_label: '15 min',
    category: 'IPL',
    description: 'Traitement ultra-rapide et sécurisé pour une peau nette.',
    upsells: [],
  },
  {
    id: 'ipl-maillot-classique',
    name: 'Maillot Classique (la séance)',
    price: 50,
    duration_min: 25,
    duration_label: '25 min',
    category: 'IPL',
    description: 'Définition des contours de maillot standard, peau douce garantie.',
    upsells: [],
  },
  {
    id: 'ipl-maillot-integral',
    name: 'Maillot Intégral (la séance)',
    price: 50,
    duration_min: 35,
    duration_label: '35 min',
    category: 'IPL',
    description: 'Élimination complète incluant les zones intérieures délicates.',
    upsells: [
      { id: 'i-up-sif', name: 'Option zone SIF (Sillon)', price: 20, description: 'Ajout de la zone délicate en tarif préférentiel.' },
    ],
  },
  {
    id: 'ipl-demi-bras',
    name: 'Demi-Bras (la séance)',
    price: 50,
    duration_min: 20,
    duration_label: '20 min',
    category: 'IPL',
    description: 'Traitement des poignets jusqu’aux coudes.',
    upsells: [],
  },
  {
    id: 'ipl-bras',
    name: 'Bras Entiers (la séance)',
    price: 100,
    duration_min: 35,
    duration_label: '35 min',
    category: 'IPL',
    description: 'Épilation complète des bras pour une douceur totale.',
    upsells: [],
  },
  {
    id: 'ipl-demi-jambes',
    name: 'Demi-Jambes (la séance)',
    price: 50,
    duration_min: 30,
    duration_label: '30 min',
    category: 'IPL',
    description: 'Traitement performant couvrant des chevilles aux genoux.',
    upsells: [],
  },
  {
    id: 'ipl-jambes',
    name: 'Jambes Entières (la séance)',
    price: 100,
    duration_min: 50,
    duration_label: '50 min',
    category: 'IPL',
    description: 'La séance globale, plus jamais de rasoir.',
    upsells: [],
  },
  {
    id: 'ipl-sif',
    name: 'SIF - Sillon Interfessier (la séance)',
    price: 30,
    duration_min: 15,
    duration_label: '15 min',
    category: 'IPL',
    description: "Retouche d'épilation ciblée et respectueuse de l'intimité.",
    upsells: [],
  },

  // ============ DÉTATOUAGE ============
  {
    id: 'detat-sourcils',
    name: 'Sourcils (la séance)',
    price: 90,
    duration_min: 45,
    duration_label: '45 min',
    category: 'Détatouage',
    description: 'Effacement esthétique intégral des sourcils, fondu naturel restauré.',
    upsells: [],
  },
  {
    id: 'detat-rousseur',
    name: 'Taches de Rousseur (la séance)',
    price: 70,
    duration_min: 30,
    duration_label: '30 min',
    category: 'Détatouage',
    description: "Atténuation esthétique ciblée d'une dermopigmentation trop marquée.",
    upsells: [],
  },
  {
    id: 'detat-levres',
    name: 'Contour des Lèvres (la séance)',
    price: 120,
    duration_min: 50,
    duration_label: '50 min',
    category: 'Détatouage',
    description: 'Retrait sélectif des lignes de lèvres irrégulières ou baveuses.',
    upsells: [],
  },

  // ============ SOURIRE ============
  {
    id: 'dentaire-soft',
    name: 'Formule SOFT WHITE',
    price: 60,
    duration_min: 30,
    duration_label: '30 min',
    category: 'Sourire',
    description: "Coup d'éclat express, idéal pour rafraîchir un blanchiment antérieur.",
    upsells: [],
  },
  {
    id: 'dentaire-max',
    name: 'Formule MAX WHITE',
    price: 100,
    duration_min: 50,
    duration_label: '50 min',
    category: 'Sourire',
    description: 'Protocole complet, 3 à 6 teintes de blancheur en une séance double LED.',
    upsells: [
      { id: 'd-up-repair', name: 'Soin Protect Émail minéralisant', price: 15, description: 'Referme les pores et renforce la barrière.' },
    ],
  },
  {
    id: 'dentaire-extra',
    name: 'Formule EXTRA WHITE',
    price: 160,
    duration_min: 75,
    duration_label: '1h 15 min',
    category: 'Sourire',
    description: 'Triple action pour un éclat dentaire maximal.',
    upsells: [],
  },

  // ============ CORPS ============
  {
    id: 'corps-algues',
    name: 'Soin Corps Complet aux Algues',
    price: 150,
    duration_min: 80,
    duration_label: '1h 20 min',
    category: 'Corps',
    description: 'Gommage aux sels marins, enveloppement chaud aux algues micronisées et modelage drainant.',
    upsells: [
      { id: 'b-up-leg', name: 'Drainage cryo Jambes Légères', price: 25, description: 'Active la circulation contre les jambes lourdes.' },
    ],
  },
  {
    id: 'corps-zone',
    name: 'Zone Ciblée aux Algues (Ventre/Cuisses/Fesses)',
    price: 90,
    duration_min: 45,
    duration_label: '45 min',
    category: 'Corps',
    description: "Cataplasme chaud d'algues purifiantes, idéal pour déstocker et soulager.",
    upsells: [],
  },
];

// Ordre stable des catégories pour l'affichage (filtres, admin, réservation).
export const CATALOG_CATEGORIES: string[] = [
  'Tous',
  'Head Spa',
  'Soins Visage',
  'Brushing & Coupe',
  'Coloration',
  'Techniques',
  'Lissages',
  'Regard',
  'IPL',
  'Détatouage',
  'Sourire',
  'Corps',
];

export function formatCatalogDuration(mins: number): string {
  if (mins <= 0) return '—';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h${m > 0 ? String(m).padStart(2, '0') : ''}` : `${m} min`;
}
