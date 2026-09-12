import { ServiceGroup, FaqItem, ReviewItem, Page } from './types';
import iplEpilationImg from './assets/ipl-epilation.webp';
import headspaHeroAsset from './assets/headspa-hero.webp';
import blanchimentHeroAsset from './assets/blanchiment-dentaire-hero.webp';
import detatouageHeroAsset from './assets/detatouage-hero.webp';

export const INSTITUT_INFO = {
  name: "L'Atelier by Lola",
  slogan: "Beauté & Bien-être Haut de Gamme",
  address: "10 rue du 14 juillet 93310 LE PRÉ SAINT GERVAIS",
  phone: "06 60 10 04 31",
  phoneFormatted: "+33660100431",
  planityUrl: "/reservation", // Internal reservation system
  hours: "Du lundi au dimanche sur rendez-vous (9h00 - 20h00)",
  instagram: "@atelier_by.lola",
  instagramUrl: "https://instagram.com/atelier_by.lola",
  tiktok: "@latelier.by.lola",
  tiktokUrl: "https://tiktok.com/@latelier.by.lola",
  snapchat: "latelierbylola",
  snapchatUrl: "https://www.snapchat.com/add/latelierbylola",

};

// Nav menu structure with metadata
export interface MenuItem {
  name: string;
  page: Page;
  description: string;
}

export const NAV_ITEMS: MenuItem[] = [
  { name: 'Accueil', page: 'accueil', description: 'Institut de Beauté Premium au Pré-Saint-Gervais' },
  { name: 'Head Spa', page: 'head-spa', description: 'Le soin thermal japonais du cuir chevelu par excellence' },
  { name: 'Soins Visage', page: 'soins-visage', description: 'Soins signature, éclat et rituels d\'exception' },
  { name: 'Coiffure & Lissages', page: 'coiffure', description: 'Brushing, soins profonds, et techniques exclusives' },
  { name: 'Beauté du Regard', page: 'beaute-regard', description: 'Browlift, rehaussement et restructuration' },
  { name: 'Épilation IPL', page: 'ipl', description: 'Épilation définitive à la lumière pulsée haut de gamme' },
  { name: 'Blanchiment Dentaire', page: 'blanchiment-dentaire', description: 'Éclat du sourire Soft, Max, et Extra White' },
  { name: 'Détatouage de l\'Esthétique', page: 'detatouage', description: 'Dermopigmentation corrective des sourcils et lèvres' },
  { name: 'Soins Corps aux Algues', page: 'soins-corps-algues', description: 'Enveloppement et rituels d\'algothérapie drainante' },
];

// Custom Unsplash beauty therapy links for peak aesthetic quality
export const LUXURY_IMAGES = {
  heroBg: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=1600', // Premium Spa bed with cream and gold vibes
  headSpa: headspaHeroAsset, // Japanese Head Spa treatment — uploaded asset
  hydraFacial: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1200', // Luxury glowy skin treatment
  aboutOwner: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200', // Wellness specialist representation
  beauteRegard: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=1200', // Eyelash and brow macro aesthetic
  iplEpilation: iplEpilationImg, // Séance IPL luxe — palette crème/doré
  blanchimentDentaire: blanchimentHeroAsset, // Dazzling white smile — uploaded asset
  detatouage: detatouageHeroAsset, // Dermopigmentation corrective sourcils - uploaded asset
  corpsAlgues: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1200', // Body treatment luxury mud beauty
};

// Before After slider data
export interface BeforeAfterItem {
  id: string;
  category: string;
  title: string;
  beforeUrl: string;
  afterUrl: string;
}

export const BEFORE_AFTER_ITEMS: BeforeAfterItem[] = [
  {
    id: 'ba-head-spa',
    category: 'Head Spa Japonais',
    title: 'Régénération du Cuir Chevelu',
    beforeUrl: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&q=80&w=600&blur=2', // Simulating dry/congested scalp look or pre-wash
    afterUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600', // Glowing healthy silky hair
  },
  {
    id: 'ba-hydrafacial',
    category: 'Soin du visage signature',
    title: 'Teint terne vs Glow absolu',
    beforeUrl: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=600', // Dull skin
    afterUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600', // Radiant makeup-free facial skin glow
  },
  {
    id: 'ba-regard',
    category: 'Browlift & Regard',
    title: 'Brows Restructuration',
    beforeUrl: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&q=80&w=600&grayscale=1', // Before simple brow
    afterUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600', // Perfectly combed high browlift
  },
];

// Google Reviews client testimonials data
export const REVIEWS: ReviewItem[] = [
  {
    author: "Mélissa K.",
    rating: 5,
    date: "Il y a 2 semaines",
    text: "Le Head Spa de L'Atelier by Lola est une expérience de pure détente, sans équivalent au Pré-Saint-Gervais. Le jet d'eau chaude en halo et le massage crânien m'ont déconnectée du monde. J'y retournerai tous les mois !",
    avatar: "MK"
  },
  {
    author: "Sarah B.",
    rating: 5,
    date: "Il y a 1 mois",
    text: "J'ai testé le soin du visage signature et le Browlift. Le résultat est bluffant, ma peau revit et mes sourcils ont une ligne parfaite. Lola est extrêmement minutieuse et le salon est d'une beauté digne d'un hôtel 5 étoiles.",
    avatar: "SB"
  },
  {
    author: "Amandine L.",
    rating: 5,
    date: "Il y a 3 semaines",
    text: "L'Atelier est magnifique ! Un institut d'un calme absolu. J'ai fait mes séances d'épilation IPL, les résultats sont déjà incroyables et sans douleur. Lola explique tout avec beaucoup de professionnalisme.",
    avatar: "AL"
  },
  {
    author: "Inès M.",
    rating: 5,
    date: "Il y a 2 mois",
    text: "Brushing et ombré hair spectaculaires ! Lola utilise d'excellents produits comme Olaplex, mes cheveux longs sont doux, brillants et en pleine santé. Le meilleur salon du Pré-Saint-Gervais, de loin.",
    avatar: "IM"
  }
];

// Instagram gallery placeholder feed - using premium wellness images
export const INSTAGRAM_FEED = [
  { id: 1, url: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600', likes: '1.2k', comments: '42' },
  { id: 2, url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600', likes: '984', comments: '18' },
  { id: 3, url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600', likes: '1.5k', comments: '63' },
  { id: 4, url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600', likes: '840', comments: '21' },
  { id: 5, url: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=600', likes: '2.1k', comments: '104' },
  { id: 6, url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=600', likes: '710', comments: '15' }
];

// COIFFURE SERVICES GROUPS
export const COIFFURE_SERVICES: ServiceGroup[] = [
  {
    categoryTitle: "BRUSHING",
    description: "Sublimez vos cheveux grâce à nos coiffages professionnels adaptés à vos envies.",
    items: [
      {
        name: "Brushing",
        price: 20,
        duration: "30 à 45 min",
        description: "Shampooing, après-shampooing et coiffage lisse ou wavy élégant.",
        priceNote: "Tarif ajustable selon la longueur et l’épaisseur des cheveux, sur diagnostic de nos coiffeurs."
      }
    ]
  },
  {
    categoryTitle: "COUPE + SOIN",
    description: "Une coupe sur-mesure pour restructurer votre coiffure, alliée à un rituel de soin nourrissant.",
    items: [
      { name: "Coupe + Soin express", price: 20, duration: "45 min", description: "Conseil visagiste, coupe de cheveux et soin crème nourrissant instantané." },
      { name: "Supplément Brushing", price: 20, duration: "30 min", description: "Coiffage professionnel au choix en supplément du forfait coupe." }
    ]
  },
  {
    categoryTitle: "COLORATION",
    description: "Des pigments d'exception pour une couleur brillante, profonde et respectueuse de la fibre capillaire. Tarif personnalisé selon la longueur et la masse de vos cheveux.",
    items: [
      { name: "Couleur Racine + Brushing", duration: "1h 15 min", description: "Retouche racines parfaite avec notre gamme de colorations sensorielles protectrices.", priceNote: "Tarif personnalisé établi lors du diagnostic, selon la longueur et la masse capillaire." },
      { name: "Couleur Tête Entière + Brushing", duration: "1h 45 min", description: "Application globale pour une brillance miroir et une intensité uniforme sur les longueurs.", priceNote: "Tarif personnalisé établi lors du diagnostic, selon la longueur et la masse capillaire." },
      { name: "Supplément Cheveux longs/épais", description: "Dose de préparation couleur additionnelle pour les masses capillaires denses.", priceNote: "Tarif personnalisé établi lors du diagnostic, selon la longueur et la masse capillaire." }
    ]
  },
  {
    categoryTitle: "TECHNIQUES EXCLUSIVES",
    description: "Des balayages de haute voltige sublimés par l'authentique soin réparateur Olaplex.",
    items: [
      { name: "Mèches + Patine + Soin Olaplex + Brushing", price: 190, duration: "3h 00 min", description: "Éclaircissement sur-mesure à l'argile, patine personnalisée pour neutraliser les reflets indésirables, protocole de reconstruction profonde Olaplex.", isPopular: true },
      { name: "Ombré Hair + Soin Olaplex + Soin Kératine + Brushing", price: 350, duration: "4h 00 min", description: "La transition de couleur divine par excellence. Combine l'enlumineur Olaplex et un bouclier de lissage à la kératine pure pour des cheveux ultrabillants.", isPopular: true },
      { name: "Contouring + Soin Kératine + Brushing", price: 100, duration: "1h 30 min", description: "Touches d'éclat encadrant le visage pour illuminer immédiatement le teint, renforcé par le soin à la kératine." }
    ]
  },
  {
    categoryTitle: "LISSAGES & THÉRAPIE CAPILLAIRE",
    description: "La haute joaillerie du cheveu. Des formules thermo-actives haut de gamme riches en nutriments d'exception.",
    items: [
      { name: "Lissage Brésilien", price: 200, duration: "3h 00 min", description: "Réduction intense du volume et réparation profonde. Des cheveux soyeux et raides comme la soie pendant 4 à 6 mois." },
      { name: "Lissage au Tanin", price: 200, duration: "3h 00 min", description: "Lissage organique aux polyphénols de raisin. Renforce la structure interne du cheveu sans l'étouffer." },
      { name: "Lissage Nano Indiens", price: 200, duration: "3h 30 min", description: "L'alliance mystique d'huiles indiennes et de bionanotechnologies pour un lissage miroir longue durée." },
      { name: "Lissage Spécial Biotine", price: 200, duration: "3h 00 min", description: "Formulé à base de vitamine B7 pour activer la pousse du cheveu tout en garantissant un fini ultra lisse." },
      { name: "Botox Biotine", price: 150, duration: "2h 00 min", description: "Le soin rajeunissant ultime anti-frisottis. Redonne matière, force et éclat naturel aux cheveux fatigués.", isPopular: true },
      { name: "Protéine Biotine", price: 200, duration: "2h 30 min", description: "Traitement fortifiant pour combler les brèches cuticulaires et redéfinir la souplesse." },
      { name: "Soin Capillaire CRP (Cortex Repair Protocol)", price: 220, duration: "2h 15 min", description: "Reconstruction moléculaire intensive pour cheveux extrêmement sensibilisés ou cassants." }
    ]
  }
];

// HEAD SPA MAIN CONTENT
export interface HeadSpaFormula {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  isPopular?: boolean;
}

export const HEAD_SPA_DATA = {
  seoTitle: "Head Spa Le Pré-Saint-Gervais • L'Atelier by Lola",
  subtitle: "Le Rituel Thermal Japonais de Relaxation et de Santé du Cuir Chevelu",
  description: "Inspiré des rituels ancestraux japonais, notre Head Spa est une parenthèse sensorielle unique en son genre. Plus qu'un simple shampoing massant, c'est un véritable traitement thérapeutique qui combine micro-circulation crânienne, pureté capillaire et relaxation nerveuse profonde au Pré-Saint-Gervais. Le clou du spectacle : notre célèbre arche d'eau (halo thérapie) qui déverse un flux continu d'eau tiède sur votre front et votre cuir chevelu pour calmer l'esprit.",
  formulas: [
    {
      id: "decouverte",
      name: "Head Spa Découverte",
      duration: "40 min",
      price: 85,
      description: "L'introduction parfaite au lâcher-prise. Offrez-vous une pause sensorielle alliant massage relaxant du cuir chevelu, shampooing, soin profond et aromathérapie. Repartez l'esprit léger (séchage naturel inclus)."
    },
    {
      id: "signature",
      name: "Head Spa Signature",
      duration: "1h00",
      price: 120,
      description: "Le soin phare pour une harmonie totale du corps et de l'esprit. Plongez dans un environnement entièrement dédié à l'apaisement. Ce rituel combine un nettoyage profond du cuir chevelu, un shampooing et un soin adaptés, de l'aromathérapie, un massage ciblé du cou et des épaules, ainsi que la détente sensorielle absolue procurée par notre arche d'eau et notre dôme de vapeur (séchage naturel inclus).",
      isPopular: true
    },
    {
      id: "premium",
      name: "Head Spa Premium",
      duration: "1h20",
      price: 145,
      description: "La quintessence du sur-mesure. Une prestation d'exception entièrement personnalisée selon vos attentes uniques. Le soin est construit sur-mesure suite à un questionnaire (envoyé par mail ou à remplir sur place) et un diagnostic approfondi avec nos équipes pour répondre parfaitement aux besoins de vos cheveux et de votre esprit (séchage naturel inclus)."
    }
  ] as HeadSpaFormula[],
  benefits: [
    "Retarde la chute et revitalise les cheveux mous et fatigués.",
    "Régule le sébum et aide à réduire durablement les démangeaisons et pellicules.",
    "Soulage instantanément le stress, l'anxiété et les maux de tête chroniques.",
    "Améliore la qualité du sommeil grâce à une sensation de sérénité durable."
  ],
  faq: [
    { question: "Pourquoi choisir le Head Spa à L'Atelier by Lola au Pré-Saint-Gervais ?", answer: "Contrairement aux salons classiques, L'Atelier by Lola offre une salle de Head Spa privatisée et plongée dans une pénombre apaisante, équipée de la véritable fontaine d'eau japonaise et d'un traitement de vapeur ultra-moderne." },
    { question: "Le soin convient-il à tous les types de cheveux ?", answer: "Oui absolument ! Que vous ayez des cheveux bouclés, lisses, crépus, colorés, naturels ou un cuir chevelu sensible, nous adaptons chaque produit (shampoings bio, lotions végétales) suite au diagnostic personnalisé." },
    { question: "Quelle est la fréquence idéale pour un Head Spa ?", answer: "Pour une santé optimale du cuir chevelu et une détente profonde, nous recommandons une séance par mois, au fil du cycle naturel de régénération cellulaire cutanée." },
    { question: "Est-ce adapté pour les hommes ?", answer: "Oui, les hommes apprécient énormément ce soin pour stimuler la pousse des cheveux et s'offrir un moment de déconnexion total du stress quotidien." }
  ]
};

// SOINS VISAGE
export const SOINS_VISAGE_DATA = {
  seoTitle: "Soins du Visage d'Exception au Pré-Saint-Gervais",
  subtitle: "Rituels Esthétiques Avancés pour un Teint Parfait et Lumineux",
  items: [
    { name: "Soin Visage Bio", price: 60, duration: "45 min", description: "Nettoyage en douceur, gommage enzymatique, massage facial relaxant et masque botanique certifié bio adapté aux peaux délicates." },
    { name: "Soin Hydratant Purifiant Vapeur", price: 90, duration: "1h 00 min", description: "Le grand classique de la pureté. Extraction des comédons sous vapeur tiède ionisée, purification cutanée profonde et modelage éclat." },
    { name: "Soin du visage signature", price: 105, duration: "45 min", description: "Notre soin phare à succion hydro-mécanique. Nettoie, exfolie les impuretés en profondeur et infuse des sérums hautement concentrés en antioxydants et acide hyaluronique.", isPopular: true },
    { name: "Soin du visage régénérant", price: 160, duration: "1h 00 min", description: "Technologie de micro-perforations contrôlées pour stimuler naturellement l'élastine et le collagène. Infuse un cocktail de vitamines pour estomper cicatrices, pores dilatés et rides.", isPopular: true },
    { name: "Soin aux Algues Naturel", price: 100, duration: "1h 00 min", description: "Masque plastifiant reminéralisant aux extraits d'algues marines pures pour détoxifier, raffermir et illuminer les peaux fatiguées ou urbaines." }
  ],
  benefits: [
    "Hydratation intense et lissage instantané des ridules de déshydratation.",
    "Resserre visiblement les pores et élimine points noirs et imperfections.",
    "Active le renouvellement cellulaire pour redonner au teint son éclat or rose d'origine.",
    "Formulations saines, hypoallergéniques et ultra performantes."
  ],
  faq: [
    { question: "En quoi consiste le soin du visage signature ?", answer: "C'est un traitement esthétique non invasif en trois étapes : nettoyage & peeling doux, extraction par vortex-succion des impuretés, puis hydratation profonde par infusion de sérums exclusifs. Résultat éclat immédiat, sans éviction sociale." },
    { question: "Y a-t-il des rougeurs après un soin régénérant ?", answer: "Des rougeurs légères et une sensation de chaleur semblable à un coup de soleil modéré peuvent apparaître dans les 24 heures suivant le soin régénérant. C'est le signe que la peau s'active pour fabriquer du nouveau collagène. Un protocole d'hydratation vous sera fourni." },
    { question: "Puis-je me maquiller directement après mon soin du visage ?", answer: "Nous vous conseillons de laisser respirer votre peau sans maquillage pendant au moins 12h après un soin signature, et 24h à 48h après un soin régénérant pour optimiser la pénétration des actifs précieux." }
  ]
};

// BEAUTÉ DU REGARD
export const REGARD_DATA = {
  seoTitle: "Browlift & Rehaussement de Cils Le Pré-Saint-Gervais",
  subtitle: "Ouvrez et Donnez de l'Intensité à Votre Regard avec Lola",
  items: [
    { name: "Restructuration Sourcils", price: 25, duration: "30 min", description: "Étude morphologique des lignes du visage, épilation de précision et finition pour corriger la symétrie de votre ligne naturelle." },
    { name: "Browlift Signature", price: 65, duration: "45 min", description: "Discipline, rehausse et épaissit vos sourcils pour un rendu structuré et fourni pendant 6 à 8 semaines. Idéal pour les sourcils fins ou tombants.", isPopular: true },
    { name: "Rehaussement de Cils (Yumi Lash style)", price: 75, duration: "1h 00 min", description: "Courbe vos cils naturels vers le haut de manière durable, complété par un soin fortifiant à la kératine et une teinture noire intense." },
    { name: "Pack Regard Sublime (Browlift + Rehaussement + Teintures)", price: 120, duration: "1h 30 min", description: "L'harmonie complète. Restructuration, Browlift, Rehaussement de cils et teintures assorties pour un regard divin dès le réveil sans maquillage.", isPopular: true }
  ],
  benefits: [
    "Effet 'maquillée sans effort' dès la sortie du lit, gain de temps maximal au quotidien.",
    "Regard instantanément lifté et cernes moins visibles par optique d'ouverture de l'œil.",
    "Tenue parfaite de 6 à 8 semaines sans aucun entretien quotidien.",
    "Produits haut de gamme certifiés préservant la santé de vos cils et sourcils."
  ],
  faq: [
    { question: "Qu'est-ce que le Browlift ?", answer: "Le Browlift est une technique de rehaussement des poils des sourcils. On assouplit la kératine du poil pour pouvoir le coiffer facilement dans la direction voulue, lui donnant un aspect plus épais, fourni et impeccablement dressé." },
    { question: "Combien de temps dure un rehaussement de cils ?", answer: "La courbe reste magnifique pendant environ 6 à 8 semaines, ce qui correspond au cycle de vie naturel et de chute de vos propres cils." },
    { question: "Le soin abîme-t-il les cils ou les sourcils ?", answer: "Absolument pas. Lola applique systématiquement un sérum gorgé de kératine et de panthénol à la fin pour sceller, hydrater et gainer en profondeur les fibres capillaires." }
  ]
};

// EPILATION IPL
export const IPL_DATA = {
  seoTitle: "Épilation Lumière Pulsée (IPL) Le Pré-Saint-Gervais",
  subtitle: "Débarrassez-vous Définitivement des Poils Grâce à la Haute Technologie IPL",
  description: "Notre technologie d'épilation longue durée par Lumière Pulsée Intense (IPL) cible la mélanine du follicule pileux sous la peau pour freiner durablement la repousse en toute sécurité et sans douleur au Pré-Saint-Gervais. Après quelques séances, la repousse est fortement réduite, la peau devient lisse et douce, débarrassée des irritations quotidiennes ou poils incarnés causés par le rasoir et la cire traditionnelle.",
  items: [
    { name: "Aisselles (la séance)", price: 50, duration: "15 min", description: "Traitement ultra-rapide et sécurisé pour une peau nette sans ombre." },
    { name: "Maillot Classique (la séance)", price: 50, duration: "25 min", description: "Définition des contours de maillot standard, peau douce garantie." },
    { name: "Maillot Intégral (la séance)", price: 50, duration: "35 min", description: "Élimination complète incluant les zones intérieures délicates.", isPopular: true },
    { name: "Demi-Bras (la séance)", price: 50, duration: "20 min", description: "Traitement des poignets jusqu'aux coudes." },
    { name: "Bras Entiers (la séance)", price: 100, duration: "35 min", description: "Épilation complète des bras pour une douceur totale." },
    { name: "Demi-Jambes (la séance)", price: 50, duration: "30 min", description: "Traitement performant couvrant des chevilles aux genoux." },
    { name: "Jambes Entières (la séance)", price: 100, duration: "50 min", description: "La séance globale pour ne plus jamais penser aux rasoirs.", isPopular: true },
    { name: "SIF - Sillon Interfessier (la séance)", price: 30, duration: "15 min", description: "Retouche d'épilation ciblée et respectueuse de l'intimité." }
  ],
  benefits: [
    "Réduit durablement la pilosité, avec des résultats visibles dès les premières séances.",
    "Aide à limiter les problèmes récurrents de poils incarnés et d'irritations.",
    "Appareil de dernière génération équipé d'un refroidisseur cutané pour un confort absolu sans douleur.",
    "Rentabilité spectaculaire par rapport à des années d'épilation mensuelle à la cire."
  ],
  faq: [
    { question: "Comment se déroule une séance de lumière pulsée (IPL) ?", answer: "Vous devez raser la zone la veille de votre rendez-vous de sorte que le flash de lumière transmette sa température directement dans la racine du poil sans brûler le poil en surface. Pendant la séance, Lola applique un gel frais protecteur puis flashe méthodiquement la zone. Des lunettes de protection élégantes vous seront fournies." },
    { question: "Combien de séances sont nécessaires pour un résultat définitif ?", answer: "En moyenne, il faut compter entre 6 et 8 séances espacées de 4 à 6 semaines pour traiter l'intégralité des poils lors de leurs différentes phases de croissance (phase anagène principalement)." },
    { question: "Puis-je faire de l'IPL après une exposition au soleil ?", answer: "Non. Une peau bronzée regorge de mélanine, ce qui augmente le risque de brûlure cutanée car la lumière ne ferait plus la différence entre la peau et le poil. Il convient d'attendre au moins 4 semaines après votre dernière exposition solaire avant d'effectuer un flash." },
    { question: "L'IPL est-elle douloureuse ?", answer: "Grâce à notre tête de traitement réfrigérante de pointe, la sensation est grandement atténuée. On ressent tout au plus un léger picotement ou un bref élastique chaud, bien plus supportable qu'une bande de cire !" }
  ]
};

// DÉTATOUAGE
export const DETATOUAGE_DATA = {
  seoTitle: "Détatouage Sourcils et Beauté Le Pré-Saint-Gervais",
  subtitle: "Corrigez et Sublimez Vos Anciens Maquillages Permanents de l'Esthétique",
  description: "Vous regrettez une ancienne dermopigmentation délavée, asymétrique ou dont la couleur a viré (rouge, bleu-gris) ? L'Atelier by Lola maîtrise l'art de l'effacement esthétique doux. Nos techniques permettent d'estomper progressivement les pigments indésirables en préservant l'intégrité de votre tissu cutané et la santé de votre système pileux, pour repartir sur une base vierge et harmonieuse.",
  items: [
    { name: "Sourcils (la séance)", price: 90, duration: "45 min", description: "Prise en charge intégrale des sourcils pour relancer un fondu naturel et éliminer les pigments de mauvaise qualité." },
    { name: "Taches de Rousseur (la séance)", price: 70, duration: "30 min", description: "Atténuation esthétique ciblée pour corriger une dermopigmentation de rousseur trop marquée." },
    { name: "Contour des Lèvres (la séance)", price: 120, duration: "50 min", description: "Retrait sélectif des lignes de lèvres irrégulières ou baveuses pour retrouver un dessin labial pur." }
  ],
  benefits: [
    "Précision chirurgicale sans cicatrice ni lésion de la peau.",
    "Évite la chute des poils naturels du sourcil contrairement aux techniques laser non régulées.",
    "Permet une restructuration parfaite pour une nouvelle pigmentation élégante.",
    "Accompagnement personnalisé et conseils de cicatrisation."
  ],
  faq: [
    { question: "Comment fonctionne le détatouage esthétique à L'Atelier ?", answer: "Nous utilisons un protocole d'effacement de pointe qui dissout et fait remonter les pigments encapsulés vers la surface de la peau par le biais du renouvellement tissulaire naturel, sans endommager le bulbe de vos sourcils." },
    { question: "Combien de séances faut-il prévoir ?", answer: "Cela varie fortement selon la profondeur du pigment d'origine, sa composition et son ancienneté. Généralement, 3 à 5 séances espacées de 6 semaines suffisent pour retrouver une peau propre réceptive à un nouveau travail." },
    { question: "La séance fait-elle mal ?", answer: "La sensation est comparable à la réalisation même du tatouage d'origine. Lola met tout en œuvre pour apaiser la zone à l'aide de packs rafraîchissants et de crèmes réparatrices hautement hydratantes post-soin." }
  ]
};

// BLANCHIMENT DENTAIRE
export const BLANCHIMENT_DENTAIRE_DATA = {
  seoTitle: "Blanchiment Dentaire Le Pré-Saint-Gervais • Éclat du Sourire",
  subtitle: "Retrouvez un Sourire Éclatant de Blancheur en Moins d'Une Heure",
  description: "Notre rituel de blanchiment dentaire esthétique élimine les taches de café, thé, tabac et jaunissement accumulé au fil des années. Nous utilisons un gel actif doux de qualité premium, sans peroxyde abrasif pour vos gencives, stimulé par une lumière LED bleue haut de gamme pour des gains de blancheur spectaculaires en une seule séance.",
  items: [
    { name: "Formule SOFT WHITE", price: 60, duration: "30 min", description: "Le coup d'éclat express. Idéal pour rafraîchir un blanchiment antérieur ou pour les dents peu incrustées." },
    { name: "Formule MAX WHITE (Recommandé)", price: 100, duration: "50 min", description: "Le protocole complet. Gagnez de 3 à 6 teintes de blancheur en une seule séance de double exposition LED.", isPopular: true },
    { name: "Formule EXTRA WHITE", price: 160, duration: "1h 15 min", description: "L'expérience la plus intensive. Traitement en profondeur triple action pour un éclat dentaire maximal, adapté aux dents fortement colorées." }
  ],
  benefits: [
    "Gagnez jusqu'à 8 teintes de blancheur en moins d'une heure de traitement.",
    "Formules certifiées Européennes respectueuses du pH de la bouche et de l'émail dentaire.",
    "Zéro sensibilité dentaire douloureuse au chaud ou au froid après la séance.",
    "Un coup de jeune immédiat et rayonnant pour votre expression faciale."
  ],
  faq: [
    { question: "Quelle différence entre le blanchiment de L'Atelier et le dentiste ?", answer: "Chez L'Atelier by Lola, le blanchiment est purement esthétique. Le gel utilisé respecte scrupuleusement la réglementation européenne (taux de peroxyde d'hydrogène inférieur à 0,1%), ce qui garantit l'absence totale de douleur et de dégradation de l'émail, tout en offrant d'excellents résultats visibles immédiatement." },
    { question: "Combien de temps durent les résultats ?", answer: "Le résultat tient généralement entre 6 et 12 mois, en fonction de votre hygiène de vie (consommation de café, de thé, d'épices colorantes ou de cigarettes)." },
    { question: "Y a-t-il des consignes après le rendez-vous ?", answer: "Oui, la fameuse 'diète blanche' de 48 heures. Il convient de ne consommer que des aliments clairs (riz, pâtes, poulet, lait) et d'exclure totalement tout ce qui tache (café, thé, vin rouge, ketchup, curry) pendant que les pores de vos dents se referment." }
  ]
};

// SOINS CORPS AUX ALGUES
export const SOINS_CORPS_ALGUES_DATA = {
  seoTitle: "Soin Corps aux Algues Le Pré-Saint-Gervais",
  subtitle: "Détoxification, Reminéralisation et Drainage Absolu de la Silhouette",
  description: "Vivez une authentique thalasso-thérapie dans le confort de notre institut de beauté premium. Notre soin d'enveloppement aux algues marines pures permet d'éliminer les impuretés, de stimuler la lymphe pour réduire la rétention d'eau et de charger votre organisme en oligo-éléments et sels minéraux précieux. Votre peau en ressort raffermie, soyeuse et votre corps entièrement décongestionné.",
  items: [
    { name: "Soin Corps Complet aux Algues", price: 150, duration: "1h 20 min", description: "Gommage du corps aux sels marins, enveloppement chaud aux algues micronisées marines de Bretagne, douche sensorielle et modelage drainant corporel global d'exception.", isPopular: true },
    { name: "Zone Ciblée aux Algues (Ventre/Cuisses/Fesses)", price: 90, duration: "45 min", description: "Application locale d'un cataplasme chaud d'algues purifiantes, idéal pour déstocker la cellulite et soulager les jambes lourdes." }
  ],
  benefits: [
    "Draine puissamment la lymphe pour réduire la cellulite et la rétention d'eau.",
    "Reminéralise les tissus cutanés en profondeur pour une peau douce, tendue et tonique.",
    "Effet relaxant d'apesanteur thermique pour dénouer les tensions musculaires du dos.",
    "Gommage luxueux pour une peau infiniment soyeuse au toucher."
  ],
  faq: [
    { question: "En quoi consiste l'enveloppement aux algues ?", answer: "On applique sur l'ensemble du corps des algues récoltées à froid et micronisées pour préserver leurs vertus. On vous enveloppe ensuite d'une couverture thermique douce. La chaleur douce permet d'ouvrir les pores de la peau pour libérer l'action des vitamines de mer tout en favorisant la transpiration purificatrice." },
    { question: "Quelles sont les contre-indications ?", answer: "Du fait de sa haute richesse en iode marin naturel, ce soin est déconseillé aux personnes souffrant de troubles non régulés de la thyroïde, d'allergie majeure à l'iode, ainsi qu'aux femmes enceintes ou allaitantes." },
    { question: "Dois-je amener un maillot de bain ?", answer: "Tout est prévu ! Nous vous fournissons un sous-vêtement jetable ultra-confortable à usage unique, ainsi que des serviettes chaudes moelleuses pour la douche sensorielle post-enveloppement." }
  ]
};
