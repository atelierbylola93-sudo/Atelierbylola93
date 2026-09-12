import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Compass, 
  Activity, 
  Droplet,
  Phone
} from 'lucide-react';
import { INSTITUT_INFO, LUXURY_IMAGES } from '../data';
import { Page } from '../types';
import heroSpaWellnessAsset from '../assets/hero-spa-wellness.webp';
import soinVisageAsset from '../assets/ba-hydrafacial-after.webp';

interface HomeViewProps {
  onNavigate: (page: Page) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  // Head Spa FAQ accordions state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Conciergerie Digitale : Rituel Advisor State
  const [selectedConcern, setSelectedConcern] = useState<number>(0);

  const featuredServices = [
    {
      title: "Japanese Head Spa",
      tag: "Signature Impériale",
      description: "Notre fleuron sensoriel d'exception. Diagnostic capillaire personnalisé, massage d'acupression Shiatsu royal, arche thermale en pluie de brume et dôme de vapeur holistique.",
      price: "120 €",
      image: LUXURY_IMAGES.headSpa,
      page: 'head-spa' as Page,
    },
    {
      title: "Soin du visage signature",
      tag: "Éclat Absolu",
      description: "Nettoie en profondeur extrême, extrait les imperfections par aspiration vortex brevetée, exfolie en douceur et gorge la peau de sérums botaniques anti-oxydants d'élite.",
      price: "105 €",
      image: LUXURY_IMAGES.hydraFacial,
      page: 'soins-visage' as Page,
    },
    {
      title: "Soin du visage régénérant",
      tag: "Jeunesse Cellulaire",
      description: "Relance instantanément la micro-circulation et l'élastine naturelle. Atténue visiblement les pores, ridules, cicatrices d'acné et insuffle un cocktail exclusif multivitaminé.",
      price: "160 €",
      image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800",
      page: 'soins-visage' as Page,
    },
    {
      title: "Beauté du Regard",
      tag: "Regard Hypnotique",
      description: "L'excellence du Browlift et du Rehaussement de cils à la kératine. Redéfinir l'harmonie de votre visage pour un fini d'un raffinement absolu, sans maquillage au réveil.",
      price: "Dès 25 €",
      image: LUXURY_IMAGES.beauteRegard,
      page: 'beaute-regard' as Page,
    },
    {
      title: "Épilation IPL",
      tag: "Haute Technologie",
      description: "Grâce à notre dispositif professionnel de lumière pulsée équipé de la technologie 'Doul-Cooling', réduisez durablement votre pilosité dans une fraîcheur et un confort d'exception.",
      price: "Dès 30 €",
      image: LUXURY_IMAGES.iplEpilation,
      page: 'ipl' as Page,
    },
    {
      title: "Blanchiment Dentaire",
      tag: "Sourire Éclatant",
      description: "Retrouvez un sourire lumineux en une seule séance grâce à notre protocole de double exposition LED douce, tout en respectant l'émail et les gencives.",
      price: "Dès 60 €",
      image: LUXURY_IMAGES.blanchimentDentaire,
      page: 'blanchiment-dentaire' as Page,
    },
  ];

  const comparisons = [
    {
      name: "Soin du visage signature",
      type: "Exfoliation Hydromécanique",
      target: "Toutes peaux, Teint terne, Pores obstrués",
      eviction: "Aucune (Éclat direct)",
      tech: "Vortex-Succion & Infusion",
      effets: "★★★★★",
      duration: "45 min",
      price: "105 €",
      image: LUXURY_IMAGES.hydraFacial,
      action: "soins-visage" as Page
    },
    {
      name: "Soin du visage régénérant",
      type: "Bio-stimulation Intense",
      target: "Fermeté, Cicatrices, Pores, Rides",
      eviction: "24h (Légères rougeurs)",
      tech: "Micro-perforations & Vitamines",
      effets: "★★★★★ (Profond)",
      duration: "60 min",
      price: "160 €",
      image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800",
      action: "soins-visage" as Page
    },
    {
      name: "Soin Visage Bio",
      type: "Phyto-sensoriel Doux",
      target: "Peaux sensibles, Rituel détox",
      eviction: "Aucune (Détente)",
      tech: "Modelage & Extraits certifiés",
      effets: "★★★★☆",
      duration: "45 min",
      price: "60 €",
      // L'illustration distante renvoyait un 404 : la photo avait été retirée
      // de la banque d'images. Un visuel local ne peut pas disparaître.
      image: soinVisageAsset,
      action: "soins-visage" as Page
    },
    {
      name: "Soin aux Algues",
      type: "Thalasso Reminéralisante",
      target: "Visage fatigué, Peau stressée, Pollution",
      eviction: "Aucune (Fraîcheur)",
      tech: "Masque plastifiant marin",
      effets: "★★★★☆",
      duration: "60 min",
      price: "100 €",
      image: LUXURY_IMAGES.corpsAlgues,
      action: "soins-corps-algues" as Page
    }
  ];

  const headSpaFaqs = [
    {
      question: "Pourquoi réaliser son Head Spa chez d'autres salons est différent de l'Atelier by Lola ?",
      answer: "À l'Atelier by Lola au Pré-Saint-Gervais, le Head Spa est une véritable cure de prestige. Votre espace est entièrement privatisé dans un cocon apaisant, baigné d'une lumière tamisée, équipé de la véritable arche d'eau japonaise et d'une technologie de bain de vapeur ionisé ultra-moderne."
    },
    {
      question: "La séance de Head Spa est-elle adaptée pour tous les types de cheveux ?",
      answer: "Absolument. Qu'ils soient bouclés, lisses, crépus, colorés, naturels ou que votre cuir chevelu soit extrêmement sensible, Lola effectue un examen préalable personnalisé pour adapter sur-mesure nos shampoings bio d'excellence."
    },
    {
      question: "Quelle est la fréquence idéale recommandée pour ce soin thermal ?",
      answer: "Pour entretenir un cuir chevelu en parfaite santé, stimuler activement la repousse et s'octroyer un relâchement nerveux optimal, nous préconisons un rituel mensuel calqué sur le cycle cellulaire de la peau."
    },
    {
      question: "Le rituel convient-il également aux hommes ?",
      answer: "Oui, les hommes apprécient grandement l'effet revitalisant contre la perte de densité capillaire, ainsi que les bienfaits calmants profonds prodigués par les points d'acupression crâniens."
    }
  ];

  return (
    <div id="home-view" className="w-full relative bg-beige-bg">
      
      {/* 1. CINEMATIC HERO SECTION WITH RESPONSIVE APPLE COVER HEIGHT */}
      <section className="relative min-h-[580px] sm:min-h-[660px] md:h-[95vh] md:min-h-[750px] flex items-center justify-center overflow-hidden py-20 md:py-0">
        {/* Dynamic Background Image & Subtle Zoom */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.08 }}
            animate={{ scale: 1.02 }}
            transition={{ duration: 12, ease: "easeOut" }}
            src={heroSpaWellnessAsset}
            alt="Ambiance spa zen avec bougies, pierres chaudes et huiles essentielles"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter brightness-110 contrast-95 saturate-95"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          {/* Soft cream veil for a light, inviting hero */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#EFE7D2]/70 via-[#EFE7D2]/55 to-[#EFE7D2]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#DDCCB2]/40 via-transparent to-[#A3A485]/15" />
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-beige-bg via-beige-bg/70 to-transparent" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-8 text-center pt-20 md:pt-24 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-5 md:space-y-8"
          >
            {/* Elegant Star Ranking Banner */}
            <div className="inline-flex flex-col items-center gap-1 select-none">
              <span className="text-[#B88F4D] text-xs md:text-sm tracking-[0.2em] font-serif">★★★★★</span>
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#B88F4D]/30 bg-white/70 backdrop-blur-md text-charcoal mt-1 shadow-sm">
                <Sparkles className="h-3 w-3 text-[#B88F4D] animate-pulse" />
                <span className="text-[11px] md:text-xs uppercase tracking-[0.2em] font-semibold text-charcoal/90">
                  Beauté & Bien-être Haut de Gamme
                </span>
              </div>
            </div>

            {/* Masterful Display Title with Great Vibes and Playfair mix (Fully Fluid & Clip-safe) */}
            <h1 className="font-serif text-3.5xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-light text-charcoal tracking-wide leading-tight">
              L'Atelier <span className="font-signature text-5xl sm:text-6xl md:text-8xl lg:text-[7.5rem] text-[#B88F4D] block sm:inline italic ml-1 select-none">by Lola</span>
            </h1>

            {/* Luxurious Subtext Subheadings */}
            <p className="font-serif italic text-base sm:text-lg md:text-2xl text-charcoal/85 font-light max-w-3xl mx-auto tracking-wide">
              Maison d'Esthétique & de Repos Capillaire d'Exception
            </p>

            <p className="text-[#A17E60] text-[11px] md:text-xs tracking-[0.25em] uppercase font-semibold px-2">
              Le Pré-Saint-Gervais • Séance Sensorielle Exclusive
            </p>

            {/* Highlights Pillars inside the Hero for premium conversion */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl mx-auto pt-1 pb-3">
              <div className="px-1.5 py-3 sm:px-3 sm:py-4 rounded-[20px] bg-white/75 backdrop-blur-md border border-[#B88F4D]/20 text-charcoal transition-all duration-300 hover:bg-white hover:border-[#B88F4D]/60 hover:shadow-md group">
                <Compass className="h-3.5 w-3.5 text-[#B88F4D] mx-auto mb-1 duration-300 group-hover:scale-110" />
                <span className="text-[10px] sm:text-[11px] md:text-xs font-serif uppercase tracking-widest font-semibold text-[#B88F4D] block">Head Spa</span>
                <span className="text-[11px] sm:text-[11px] text-secondary-gray tracking-wider block mt-0.5">Rituel Japonais</span>
              </div>
              <div className="px-1.5 py-3 sm:px-3 sm:py-4 rounded-[20px] bg-white/75 backdrop-blur-md border border-[#B88F4D]/20 text-charcoal transition-all duration-300 hover:bg-white hover:border-[#B88F4D]/60 hover:shadow-md group">
                <Droplet className="h-3.5 w-3.5 text-[#B88F4D] mx-auto mb-1 duration-300 group-hover:scale-110" />
                <span className="text-[10px] sm:text-[11px] md:text-xs font-serif uppercase tracking-widest font-semibold text-[#B88F4D] block">Soin du visage</span>
                <span className="text-[11px] sm:text-[11px] text-secondary-gray tracking-wider block mt-0.5">Éclat</span>
              </div>
              <div className="px-1.5 py-3 sm:px-3 sm:py-4 rounded-[20px] bg-white/75 backdrop-blur-md border border-[#B88F4D]/20 text-charcoal transition-all duration-300 hover:bg-white hover:border-[#B88F4D]/60 hover:shadow-md group">
                <Sparkles className="h-3.5 w-3.5 text-[#B88F4D] mx-auto mb-1 duration-300 group-hover:scale-110" />
                <span className="text-[10px] sm:text-[11px] md:text-xs font-serif uppercase tracking-widest font-semibold text-[#B88F4D] block">Needling</span>
                <span className="text-[11px] sm:text-[11px] text-secondary-gray tracking-wider block mt-0.5">Anti-Âge Pur</span>
              </div>
            </div>

            {/* Core Action Callouts */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 px-4">
              <motion.button
                onClick={() => {
                  window.location.assign('/reservation');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2.5 cursor-pointer shadow-xl !bg-[#B88F4D] !text-white border border-[#B88F4D]/40"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Calendar className="h-4 w-4" />
                Prendre rendez-vous
              </motion.button>
              
              <motion.button
                onClick={() => {
                  const el = document.getElementById('vedettes');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto btn-secondary !border-[#B88F4D]/50 !text-charcoal hover:!bg-white/80 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm bg-white/60 backdrop-blur-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Nos prestations d'exception
                <ArrowRight className="h-4 w-4 text-[#B88F4D]" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator — placed above the buttons, clear of the overlapping stats banner */}
        <div className="relative z-10 mt-6 mb-2 hidden md:flex flex-col items-center gap-1 text-charcoal/60 pointer-events-none">
          <span className="text-[11px] uppercase tracking-[0.25em] font-medium">Défiler</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            className="h-5 w-1 bg-[#B88F4D] rounded-full"
          />
        </div>
      </section>

      {/* 2. STATS BANNER SECTION */}
      <section className="relative z-20 -mt-10 max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-[28px] border border-[#B88F4D]/15 shadow-xl py-6 px-4 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-[#B88F4D]/10">
          <div className="pt-0 flex flex-col justify-center space-y-1 min-w-0 px-1">
            <span className="font-serif text-3xl md:text-4xl font-bold text-charcoal tracking-tight block">
              +500
            </span>
            <span className="text-[10px] md:text-xs text-secondary-gray uppercase tracking-widest font-semibold block">
              Clients Satisfaits
            </span>
          </div>

          <div className="pt-3 xl:pt-0 flex flex-col justify-center space-y-1 min-w-0 px-1">
            <span className="font-serif text-3xl md:text-4xl font-bold text-[#B88F4D] tracking-tight block flex items-center justify-center gap-1">
              4.9<span className="text-sm text-yellow-500">★</span>
            </span>
            <span className="text-[10px] md:text-xs text-secondary-gray uppercase tracking-widest font-semibold block">
              Avis Google Certifiés
            </span>
          </div>

          <div className="pt-3 xl:pt-0 flex flex-col justify-center space-y-1 min-w-0 px-1">
            <span className="font-serif text-3xl md:text-4xl font-bold text-charcoal tracking-tight block">
              100%
            </span>
            <span className="text-[10px] md:text-xs text-secondary-gray uppercase tracking-widest font-semibold block">
              Soins Haut de Gamme
            </span>
          </div>

          <div className="pt-3 xl:pt-0 flex flex-col justify-center space-y-1 min-w-0 px-1">
            <span className="font-serif text-3xl md:text-4xl font-bold text-[#A3A485] tracking-tight block">
              24h/24
            </span>
            <span className="text-[10px] md:text-xs text-secondary-gray uppercase tracking-widest font-semibold block">
              Réservation en ligne
            </span>
          </div>

        </div>
      </section>

      {/* 2.5 DYNAMIC PLANITY LIVE BANNER WITH SOFT URGENCY & CALL INCENTIVE */}
      <section className="mt-12 max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-charcoal via-[#333333] to-charcoal text-white rounded-[24px] p-6 border border-[#B88F4D]/25 shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-[#B88F4D]/5 rounded-l-full blur-xl pointer-events-none" />
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5 relative z-10">
            <div className="space-y-1.5 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B88F4D]/10 border border-[#B88F4D]/30 text-xs text-amber-300 font-semibold uppercase tracking-wider">
                <Clock className="h-3.5 w-3.5" /> Réservation en ligne 24h/24
              </div>
              <h3 className="font-serif text-lg md:text-xl font-medium tracking-wide">
                Les créneaux de fin de semaine partent très rapidement.
              </h3>
              <p className="text-gray-300 text-xs font-light tracking-wide max-w-xl">
                Planifiez votre parenthèse de bien-être dès aujourd’hui pour garantir votre place et vivre un soin d'exception personnalisé avec Lola.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto shrink-0">
              <motion.button
                onClick={() => {
                  window.location.assign('/reservation');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 bg-[#B88F4D] hover:bg-white text-white hover:text-charcoal rounded-[16px] text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Calendar className="h-4 w-4" />
                Réserver mon rendez-vous
              </motion.button>

              <motion.a
                href={`tel:${INSTITUT_INFO.phoneFormatted}`}
                className="px-6 py-3.5 bg-white/5 border border-white/10 hover:bg-white/15 text-white rounded-[16px] text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Phone className="h-4 w-4 text-[#B88F4D]" />
                {INSTITUT_INFO.phone}
              </motion.a>
            </div>
          </div>
        </div>
      </section>

      {/* 2.7 WHY CHOOSE US (POURQUOI CHOISIR L'ATELIER BY LOLA) - ASYMMETRICAL LUXURY EDITORIAL */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8">
        {/* Vignelli Swiss Rule major header line */}
        <div className="w-full border-t-2 border-charcoal/10 pt-4 mb-12 flex justify-between items-baseline font-mono text-[11px] tracking-[0.25em] text-secondary-gray uppercase select-none">
          <span>SECTION 01 / INTRO</span>
          <span>Savoir-Faire &amp; Intimité</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Typographic Hook */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#B88F4D] font-bold block">
              MAISON SENSORIELLE
            </span>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.5rem] text-charcoal font-light leading-[1.1] tracking-tight v-align-optical">
              L'Excellence <br />
              <span className="font-signature text-4.5xl md:text-6xl text-[#B88F4D] italic ml-1 font-medium block sm:inline">sans compromis</span>
            </h2>
            <div className="w-16 h-[1.5px] bg-[#B88F4D]" />
            <p className="text-secondary-gray text-sm md:text-base font-light leading-relaxed max-w-md">
              L’Atelier by Lola n'est pas un institut de passage. C'est un sanctuaire confidentiel d'esthétique et de soins capillaires, conçu pour offrir des résultats visibles dans le respect absolu de votre bien-être.
            </p>
            <div className="pt-4">
              <p className="text-sm text-[#A17E60] uppercase tracking-wide mb-4">
                Établissement privatisé — réservation recommandée
              </p>
              <motion.button
                onClick={() => {
                  window.location.assign('/reservation');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-[#B88F4D] hover:bg-charcoal text-white rounded-full text-sm font-semibold uppercase tracking-wider py-4 px-8 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                Réserver
              </motion.button>
            </div>
          </div>

          {/* Right Column: Three-column Feature Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-6 items-stretch">
            
            {/* Feature 1 */}
            <div className="bg-white p-6 lg:p-7 rounded-2xl border border-[#B88F4D]/10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col hover:border-[#B88F4D]/35 transition-all duration-500">
              <div className="space-y-1 mb-3">
                <div className="font-mono text-4xl lg:text-5xl font-light tracking-tighter text-[#B88F4D]/30">01</div>
                <h3 className="font-serif text-lg font-bold text-charcoal tracking-wide">Expertise Certifiée</h3>
              </div>
              <p className="text-sm text-secondary-gray leading-relaxed font-light">
                Lola est facialiste diplômée et praticienne certifiée dans les protocoles de Head Spa russes et japonais originels. Une alliance rare de rigueur professionnelle et de gestuelle relaxante millénaire.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 lg:p-7 rounded-2xl border border-[#B88F4D]/10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col hover:border-[#B88F4D]/35 transition-all duration-500">
              <div className="space-y-1 mb-3">
                <div className="font-mono text-4xl lg:text-5xl font-light tracking-tighter text-[#B88F4D]/30">02</div>
                <h3 className="font-serif text-lg font-bold text-charcoal tracking-wide">Produits d'Exception</h3>
              </div>
              <p className="text-sm text-secondary-gray leading-relaxed font-light">
                Sélection stricte d’actifs purs de grade médical et cosmétiques biologiques. Vos cheveux et votre épiderme bénéficient de formulations brevetées préservant l'équilibre cellulaire profond.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 lg:p-7 rounded-2xl border border-[#B88F4D]/10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col hover:border-[#B88F4D]/35 transition-all duration-500">
              <div className="space-y-1 mb-3">
                <div className="font-mono text-4xl lg:text-5xl font-light tracking-tighter text-[#B88F4D]/30">03</div>
                <h3 className="font-serif text-lg font-bold text-charcoal tracking-wide">Boudoir Privatisé</h3>
              </div>
              <p className="text-sm text-secondary-gray leading-relaxed font-light">
                Oubliez les grands salons bruyants. L’institut est entièrement privatisé à chaque séance : literie thermo-ergonomique, pluie sensorielle, dôme ionique, sonorités zen et diffusion d'huiles rares.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. CORE SERVICES WITH EDITORIAL ALTERNATING LAYOUT & BENTO MOSAIC */}
      <section id="vedettes" className="py-24 bg-[#EFE7D2] border-y border-[#B88F4D]/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Vignelli Swiss Rule major header line */}
          <div className="w-full border-t-2 border-charcoal/10 pt-4 mb-16 flex justify-between items-baseline font-mono text-[11px] tracking-[0.25em] text-secondary-gray uppercase select-none">
            <span>SECTION 02 / PRESTATIONS</span>
            <span>La Collection d'Auteur</span>
          </div>

          {/* Group Header */}
          <div className="text-left mb-20 space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#B88F4D] font-bold block">
              SÉLECTION EXCLUSIVE
            </span>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-charcoal font-light leading-tight tracking-tight v-align-optical">
              Prestations de Prestige
            </h2>
            <div className="w-16 h-[1.5px] bg-[#B88F4D]" />
            <p className="text-secondary-gray text-xs md:text-sm max-w-lg font-light leading-relaxed">
              L'alliance de la haute technologie esthétique et de rituels sensoriels d’épicurisme pur.
            </p>
          </div>

          <div className="space-y-16 lg:space-y-24">
            
            {/* 1. HERO SPOTLIGHT: JAPANESE HEAD SPA (FULL WIDTH LEFT SPLIT) */}
            <div className="bg-white rounded-[32px] overflow-hidden border border-[#B88F4D]/10 shadow-[0_10px_35px_rgba(0,0,0,0.02)] grid grid-cols-1 lg:grid-cols-12 items-stretch">
              <div className="lg:col-span-7 h-72 sm:h-96 lg:h-auto min-h-[350px] relative overflow-hidden">
                <img 
                  src={featuredServices[0].image} 
                  alt={featuredServices[0].title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-[1200ms] hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/55 to-transparent" />
                <span className="absolute top-6 left-6 bg-[#B88F4D] text-white text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-full shadow-lg">
                  ★ {featuredServices[0].tag}
                </span>
              </div>
              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-baseline border-b border-[#B88F4D]/15 pb-4">
                    <h3 className="font-serif text-2xl sm:text-3.5xl text-charcoal font-light leading-tight">{featuredServices[0].title}</h3>
                    <span className="font-serif text-xl text-[#B88F4D] font-bold shrink-0 ml-4">{featuredServices[0].price}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-secondary-gray leading-relaxed font-light">
                    {featuredServices[0].description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded bg-[#B88F4D]/5 border border-[#B88F4D]/15 text-[#B88F4D]">Arche de Brume</span>
                    <span className="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded bg-[#B88F4D]/5 border border-[#B88F4D]/15 text-[#B88F4D]">Massage Shiatsu</span>
                    <span className="text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded bg-[#A3A485]/5 border border-[#A3A485]/15 text-[#A3A485]">Cocon Privé</span>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate(featuredServices[0].page)}
                  className="w-full sm:w-auto self-start px-8 py-3.5 bg-charcoal hover:bg-[#B88F4D] text-white text-xs font-bold uppercase tracking-wider rounded-[16px] transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  Expérimenter le soin
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* 2. ALTERNATING COLUMNS: SOINS DU VISAGE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Soin du visage signature - Image Left Side-by-Side Card */}
              <div className="bg-white rounded-[32px] overflow-hidden border border-[#B88F4D]/10 shadow-[0_10px_35px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                <div>
                  <div className="relative h-64 sm:h-72 overflow-hidden">
                    <img 
                      src={featuredServices[1].image} 
                      alt={featuredServices[1].title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-[1200ms] hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur text-charcoal text-[11px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-md border border-[#B88F4D]/10">
                      {featuredServices[1].tag}
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-baseline border-b border-gray-100 pb-3">
                      <h4 className="font-serif text-xl sm:text-2xl text-charcoal font-medium">{featuredServices[1].title}</h4>
                      <span className="font-serif text-base text-[#B88F4D] font-bold">{featuredServices[1].price}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-secondary-gray font-light leading-relaxed">
                      {featuredServices[1].description}
                    </p>
                  </div>
                </div>
                <div className="p-8 pt-0">
                  <button
                    onClick={() => onNavigate(featuredServices[1].page)}
                    className="w-full py-4 bg-beige-bg hover:bg-charcoal hover:text-white text-charcoal rounded-[16px] text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Découvrir l'éclat
                  </button>
                </div>
              </div>

              {/* Soin du visage régénérant - Image Right template Style Card */}
              <div className="bg-white rounded-[32px] overflow-hidden border border-[#B88F4D]/10 shadow-[0_10px_35px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                <div>
                  <div className="relative h-64 sm:h-72 overflow-hidden">
                    <img 
                      src={featuredServices[2].image} 
                      alt={featuredServices[2].title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-[1200ms] hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur text-charcoal text-[11px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-md border border-[#B88F4D]/10">
                      {featuredServices[2].tag}
                    </div>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-baseline border-b border-gray-100 pb-3">
                      <h4 className="font-serif text-xl sm:text-2xl text-charcoal font-medium">{featuredServices[2].title}</h4>
                      <span className="font-serif text-base text-[#B88F4D] font-bold">{featuredServices[2].price}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-secondary-gray font-light leading-relaxed">
                      {featuredServices[2].description}
                    </p>
                  </div>
                </div>
                <div className="p-8 pt-0">
                  <button
                    onClick={() => onNavigate(featuredServices[2].page)}
                    className="w-full py-4 bg-beige-bg hover:bg-charcoal hover:text-white text-charcoal rounded-[16px] text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    Détails du renouvellement cellulaire
                  </button>
                </div>
              </div>

            </div>

            {/* 3. ASYMMETRICAL BENTO MOSAIC (BEAUTÉ COUTURE & COMPLÉMENTS) */}
            <div className="space-y-8">
              <div className="border-b border-[#B88F4D]/20 pb-4 max-w-md">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#B88F4D] font-bold block">La Beauté à la Carte</span>
                <h4 className="font-serif text-xl md:text-2xl text-charcoal">Les Finitions de Style</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
                
                {/* Browlift/Regard - Spans 5 columns */}
                <div className="md:col-span-5 bg-white rounded-[32px] overflow-hidden border border-[#B88F4D]/10 shadow-[0_10px_35px_rgba(0,0,0,0.02)] p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="text-[11px] uppercase font-bold text-[#B88F4D] tracking-wider select-none">
                      Focus Regard / {featuredServices[3].price}
                    </span>
                    <h5 className="font-serif text-xl font-bold text-charcoal">{featuredServices[3].title}</h5>
                    <p className="text-xs text-secondary-gray font-light leading-relaxed">
                      {featuredServices[3].description}
                    </p>
                  </div>
                  <div className="relative h-44 rounded-[20px] overflow-hidden">
                    <img 
                      src={featuredServices[3].image} 
                      alt={featuredServices[3].title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <button
                    onClick={() => onNavigate(featuredServices[3].page)}
                    className="w-full py-3 bg-[#EFE7D2] hover:bg-[#B88F4D] text-charcoal hover:text-white rounded-[12px] text-[10px] font-bold uppercase tracking-wider transition-colors duration-300"
                  >
                    Harmoniser mon regard
                  </button>
                </div>

                {/* IPL / Epilation - Spans 7 columns with asymmetrical internal splits */}
                <div className="md:col-span-7 bg-white rounded-[32px] overflow-hidden border border-[#B88F4D]/10 shadow-[0_10px_35px_rgba(0,0,0,0.02)] p-8 sm:p-10 flex flex-col md:flex-row justify-between gap-8 items-stretch">
                  <div className="flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <span className="text-[11px] uppercase font-bold text-[#A3A485] tracking-wider select-none">
                        Haute Technologie / {featuredServices[4].price}
                      </span>
                      <h5 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">{featuredServices[4].title}</h5>
                      <p className="text-xs text-secondary-gray font-light leading-relaxed">
                        {featuredServices[4].description}
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigate(featuredServices[4].page)}
                      className="w-full py-3 bg-[#EFE7D2] hover:bg-[#B88F4D] text-charcoal hover:text-white rounded-[12px] text-[10px] font-bold uppercase tracking-wider transition-colors duration-300"
                    >
                      Bilan & IPL définitif
                    </button>
                  </div>
                  <div className="w-full md:w-56 h-48 md:h-auto rounded-[20px] overflow-hidden shrink-0">
                    <img 
                      src={featuredServices[4].image} 
                      alt={featuredServices[4].title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>

                {/* Teeth whitening / Blanchiment - Full width wide banner item */}
                <div className="md:col-span-12 bg-charcoal text-white rounded-[32px] overflow-hidden border border-[#B88F4D]/20 p-8 sm:p-10 flex flex-col md:flex-row items-center gap-8 justify-between relative">
                  <div className="absolute top-0 right-0 w-80 h-full bg-[#B88F4D]/5 blur-3xl pointer-events-none" />
                  <div className="space-y-4 max-w-xl relative z-10">
                    <span className="text-[11px] uppercase font-bold text-[#B88F4D] tracking-widest">
                      Dents & Sourire / {featuredServices[5].price}
                    </span>
                    <h5 className="font-serif text-2xl font-light tracking-wide">{featuredServices[5].title}</h5>
                    <p className="text-xs text-gray-300 font-light leading-relaxed">
                      {featuredServices[5].description}
                    </p>
                  </div>
                  <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 relative z-10 w-full md:w-auto">
                    <div className="h-20 w-32 rounded-[16px] overflow-hidden hidden sm:block border border-white/10">
                      <img 
                        src={featuredServices[5].image} 
                        alt={featuredServices[5].title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <button
                      onClick={() => onNavigate(featuredServices[5].page)}
                      className="px-6 py-3.5 bg-[#B88F4D] hover:bg-white text-white hover:text-charcoal rounded-[16px] text-xs font-bold uppercase tracking-wider transition-all duration-300"
                    >
                      Prendre Rendez-vous Sourire
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

          <div className="mt-16 text-center bg-white rounded-[24px] p-6 border border-[#B88F4D]/10 max-w-3xl mx-auto shadow-sm">
            <p className="text-xs text-charcoal font-medium">
              Vous hésitez sur le choix de votre protocole ? Nos diagnostics personnalisés sont entièrement inclus avec chaque soin.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  window.location.assign('/reservation');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-primary !py-3 !px-6 !text-[11px]"
              >
                Réserver mon rendez-vous
              </button>
              <a
                href={`tel:${INSTITUT_INFO.phoneFormatted}`}
                className="text-xs uppercase font-bold text-[#B88F4D] hover:underline inline-flex items-center gap-1.5 min-h-[44px] py-2 -my-2"
              >
                <Phone className="h-3.5 w-3.5" /> Appeler pour un conseil direct
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. EXCEPTIONAL DEDICATED SOIN ZONE: JAPANESE HEAD SPA */}
      <section className="bg-charcoal text-white py-24 relative overflow-hidden">
        {/* Subtle glowing elements to build dark luxury spa environment */}
        <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-[#A3A485]/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#B88F4D]/5 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Vignelli Swiss Rule major header line in white/opacity for dark theme */}
          <div className="w-full border-t border-white/10 pt-4 mb-16 flex justify-between items-baseline font-mono text-[11px] tracking-[0.25em] text-gray-400 uppercase select-none">
            <span>SECTION 03 / FOCUS</span>
            <span>Le Secret Ancestral</span>
          </div>

          {/* Section Header */}
          <div className="text-left mb-16 space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#B88F4D] font-bold block">
              JAPANESE HEAD SPA
            </span>
            <h2 className="font-serif text-3.5xl md:text-5xl lg:text-6xl text-white font-light tracking-tight leading-tight v-align-optical">
              L'Onsen du Cuir Chevelu
            </h2>
            <div className="w-16 h-[1.5px] bg-[#B88F4D]" />
            <p className="text-gray-300 text-xs md:text-sm max-w-2xl font-light leading-relaxed">
              Une immersion relaxante révolutionnaire où l'eau de source, le massage Shiatsu des méridiens crâniens et l'arche de pluie en halo soignent la fibre capillaire et apaisent l'esprit fatigué.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Cinematic block left column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative rounded-[28px] overflow-hidden border-2 border-[#B88F4D]/30 shadow-2xl group">
                <img
                  src={LUXURY_IMAGES.headSpa}
                  alt="Authentic Japanese Head Spa therapy water ring"
                  referrerPolicy="no-referrer"
                  className="w-full h-[400px] object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Floating soft play banner or water indicator badge */}
                <div className="absolute bottom-4 right-4 glass-dark text-white text-[10px] tracking-widest uppercase font-semibold px-4 py-2 rounded-full border border-white/10 flex items-center gap-1.5">
                  <Activity className="h-3 w-3 text-[#B88F4D]" /> Arche d'affusion active
                </div>
              </div>

              {/* Quick stats on the treatment */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-[20px] text-center">
                  <span className="text-[#B88F4D] text-xl font-serif font-bold block">1h00</span>
                  <span className="text-[10px] uppercase text-gray-400 tracking-wider">Durée pure</span>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-[20px] text-center">
                  <span className="text-[#B88F4D] text-xl font-serif font-bold block">120 €</span>
                  <span className="text-[10px] uppercase text-gray-400 tracking-wider">Tarif séance</span>
                </div>
              </div>
            </div>

            {/* Protocol & Benefits center-right */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Benefits Subsection */}
              <div>
                <h3 className="font-serif text-lg text-[#B88F4D] tracking-wider mb-4 border-b border-white/10 pb-2">
                  Les Vertus Cliniques & Sensorielles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-[#A3A485] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs md:text-sm text-gray-200 font-medium block">Active la Pousse</span>
                      <span className="text-[11px] text-gray-400 leading-snug">Booste la micro-circulation du bulbe capillaire.</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-[#A3A485] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs md:text-sm text-gray-200 font-medium block">Régule le Sébum</span>
                      <span className="text-[11px] text-gray-400 leading-snug">Aide à réduire pellicules et démangeaisons durablement.</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-[#B88F4D] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs md:text-sm text-gray-200 font-medium block">Calme le Stress</span>
                      <span className="text-[11px] text-gray-400 leading-snug">Relâchement nerveux par digitopression crânienne.</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="h-5 w-5 text-[#B88F4D] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs md:text-sm text-gray-200 font-medium block">Améliore le Sommeil</span>
                      <span className="text-[11px] text-gray-400 leading-snug">Vertus apaisantes durables sur les maux de tête.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full session protocol step roadmap */}
              <div>
                <h3 className="font-serif text-lg text-[#B88F4D] tracking-wider mb-4 border-b border-white/10 pb-2">
                  Déroulement & Protocole de Séance
                </h3>
                <div className="space-y-4">
                  <div className="relative pl-8 border-l border-[#B88F4D]/20">
                    <div className="absolute -left-[6px] top-1 w-3 h-3 rounded-full bg-[#A3A485]" />
                    <span className="text-sm text-white font-semibold">1. Gommage Détox & Bain d'Huiles</span>
                    <p className="text-xs text-gray-400">Élimination douce des toxines, peaux mortes et résidus chimiques.</p>
                  </div>
                  <div className="relative pl-8 border-l border-[#B88F4D]/20">
                    <div className="absolute -left-[6px] top-1 w-3 h-3 rounded-full bg-[#B88F4D]" />
                    <span className="text-sm text-white font-semibold">2. Massage Shiatsu sous le Halo d'eau</span>
                    <p className="text-xs text-gray-400">Massage crânien profond, nuque et trapèzes pour dénouer l'anxiété.</p>
                  </div>
                  <div className="relative pl-8">
                    <div className="absolute -left-[6px] top-1 w-3 h-3 rounded-full bg-[#A3A485]" />
                    <span className="text-sm text-white font-semibold">3. Dôme de Vapeur & Soin Capillaire</span>
                    <p className="text-xs text-gray-400">Séchage et soin enveloppant réparateur Olaplex ou bio appliqué à chaud.</p>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Interactive Zen Accordion FAQs */}
          <div className="mt-16 max-w-4xl mx-auto space-y-3 pt-12 border-t border-white/10">
            <h3 className="font-serif text-xl text-center text-white mb-6">FAQ - Zen & Informations Pratiques</h3>
            <div className="space-y-3">
              {headSpaFaqs.map((faq, idx) => (
                <div
                  key={`hs-faq-${idx}`}
                  className="bg-white/5 border border-white/10 rounded-[18px] overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full flex justify-between items-center px-6 py-4.5 text-left text-xs md:text-sm font-semibold tracking-wide text-white hover:text-[#B88F4D] transition-colors focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    {activeFaq === idx ? (
                      <ChevronUp className="h-4 w-4 text-[#B88F4D]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  <AnimatePresence initial={false}>
                    {activeFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-5 pt-1 text-[11px] md:text-xs text-gray-300 leading-relaxed font-light border-t border-white/5 bg-white/[0.01]">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            <div className="text-center pt-8 space-y-4">
              <p className="text-sm text-gray-400 font-light">
                Réservez en ligne 24 h/24, ou appelez-nous pour un conseil personnalisé.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <motion.button
                  onClick={() => onNavigate('head-spa')}
                  className="btn-primary !border-[#B88F4D] !text-white hover:bg-white hover:text-charcoal transition-all duration-300"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Tout découvrir sur notre Head Spa
                </motion.button>
                <button
                  onClick={() => {
                    window.location.assign('/reservation');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-[#B88F4D] hover:bg-white text-white hover:text-charcoal rounded-[100px] text-xs uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer"
                >
                  Réserver en ligne maintenant
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. CONCIERGERIE DIGITALE : ADVISOR DE RITUEL SENSORIEL */}
      <section id="ritual-advisor-section" className="py-24 max-w-7xl mx-auto px-4 md:px-8">

        
        {/* Vignelli Swiss Rule major header line */}
        <div className="w-full border-t-2 border-charcoal/10 pt-4 mb-16 flex justify-between items-baseline font-mono text-[11px] tracking-[0.25em] text-secondary-gray uppercase select-none">
          <span>SECTION 04 / INTERACTIF</span>
          <span>Conciergerie Digitale</span>
        </div>

        <div className="text-left mb-16 space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#B88F4D] font-bold block">
            DIAGNOSTIC SUR-MESURE
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-charcoal font-light tracking-tight leading-tight v-align-optical">
            Sélecteur de Rituel Personnalisé
          </h2>
          <div className="w-16 h-[1.5px] bg-[#B88F4D]" />
          <p className="text-secondary-gray text-xs md:text-sm max-w-xl font-light leading-relaxed">
            Sélectionnez votre envie beauté. Notre intelligence sensorielle vous recommande le protocole parfait pour révéler votre éclat cellulaire.
          </p>
        </div>

        {/* 4 Premium Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-4xl mx-auto">
          {[
            { label: "Water & Glow", desc: "Éclat & Pureté", concern: "Pores obstrués, teint terne" },
            { label: "Cellular Youth", desc: "Fermeté & Ridules", concern: "Signes de l'âge, cicatrices" },
            { label: "Phyto-Sensorial", desc: "Douceur Bio", concern: "Peaux sensibles, détox" },
            { label: "Marine Healing", desc: "Thalasso Visage", concern: "Fatigue, stress urbain" }
          ].map((tab, idx) => (
            <button
              key={`ritual-tab-${idx}`}
              onClick={() => setSelectedConcern(idx)}
              className={`flex-1 min-w-[200px] text-center p-4 rounded-[20px] transition-all duration-300 border cursor-pointer ${
                selectedConcern === idx
                  ? 'bg-charcoal text-white border-charcoal shadow-md'
                  : 'bg-white text-secondary-gray border-[#B88F4D]/10 hover:border-[#B88F4D]/30 hover:bg-[#EFE7D2]'
              }`}
            >
              <span className="block text-[11px] uppercase tracking-widest font-bold">
                {tab.label}
              </span>
              <span className="block text-[11px] opacity-75 font-serif italic mt-0.5">
                {tab.desc} • {tab.concern}
              </span>
            </button>
          ))}
        </div>

        {/* Interactive Recommended Protocol card */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {comparisons.map((row, idx) => idx === selectedConcern && (
              <motion.div
                key={`advisor-result-${idx}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="bg-white rounded-[32px] border border-[#B88F4D]/15 shadow-xl p-5 sm:p-6 lg:p-6 relative overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                  {/* 1. Image — 4 cols, full card height on desktop */}
                  <div className="lg:col-span-4 relative">
                    <div className="relative w-full h-56 sm:h-72 lg:h-full lg:min-h-[460px] rounded-2xl overflow-hidden">
                      <img
                        src={row.image}
                        alt={row.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* 2. Content — 5 cols */}
                  <div className="lg:col-span-5 flex flex-col justify-center gap-6 lg:py-2">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A3A485]/10 border border-[#A3A485]/30 text-[11px] text-[#A3A485] font-bold uppercase tracking-widest mb-3">
                        <Sparkles className="h-3 w-3" /> Votre recommandation sur-mesure
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-charcoal font-light leading-tight">
                        {row.name}
                      </h3>
                      <p className="text-xs text-[#B88F4D] uppercase tracking-wider font-semibold font-sans mt-1.5">
                        {row.type}
                      </p>
                    </div>

                    <div className="h-[1px] w-full bg-[#B88F4D]/15" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-[#A17E60] font-bold block mb-1.5">Cible & état de peau</span>
                        <p className="text-sm text-secondary-gray leading-relaxed font-light">{row.target}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-[#A17E60] font-bold block mb-1.5">Technologie de soin</span>
                        <p className="text-sm text-charcoal font-medium leading-relaxed">{row.tech}</p>
                      </div>
                    </div>
                  </div>

                  {/* 3. Récapitulatif — 3 cols */}
                  <div className="lg:col-span-3 bg-[#EFE7D2] rounded-2xl p-5 lg:p-6 flex flex-col">
                    <span className="text-xs uppercase tracking-[0.2em] text-[#A17E60] font-bold block mb-4">
                      Récapitulatif
                    </span>

                    <dl className="flex flex-col">
                      <div className="flex items-baseline justify-between gap-3 py-3 border-b border-[#B88F4D]/15">
                        <dt className="text-xs uppercase tracking-wider text-[#A17E60]">Durée</dt>
                        <dd className="text-base text-charcoal font-medium">{row.duration}</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-3 py-3 border-b border-[#B88F4D]/15">
                        <dt className="text-xs uppercase tracking-wider text-[#A17E60]">Tarif</dt>
                        <dd className="text-base text-charcoal font-medium">{row.price}</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-3 py-3 border-b border-[#B88F4D]/15">
                        <dt className="text-xs uppercase tracking-wider text-[#A17E60]">Temps d'éviction</dt>
                        <dd className={`text-base font-medium text-right ${
                          row.eviction.includes("Aucune") ? 'text-[#A3A485]' : 'text-charcoal'
                        }`}>
                          {row.eviction}
                        </dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-3 py-3">
                        <dt className="text-xs uppercase tracking-wider text-[#A17E60]">Intensité</dt>
                        <dd className="text-base text-[#B88F4D] font-medium tracking-wider">{row.effets}</dd>
                      </div>
                    </dl>

                    <div className="mt-auto pt-5 space-y-2">
                      <button
                        onClick={() => {
                          window.location.assign('/reservation');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full py-3.5 bg-[#B88F4D] hover:bg-charcoal text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm whitespace-nowrap"
                      >
                        Réserver
                      </button>
                      <button
                        onClick={() => onNavigate(row.action)}
                        className="w-full py-1 text-center text-[#A17E60] hover:text-charcoal text-[11px] font-medium tracking-wide underline bg-transparent border-0 cursor-pointer"
                      >
                        Détails du soin
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>


    </div>
  );
}

