import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Activity, 
  Droplet,
  Phone,
  Star,
  MapPin,
  Heart
} from 'lucide-react';
import { INSTITUT_INFO, LUXURY_IMAGES, REVIEWS } from '../data';
import { Page } from '../types';
import heroSpaWellnessAsset from '../assets/hero-spa-wellness.webp';
// Image exacte sur laquelle la video demarre : le passage de l'une a l'autre
// est invisible, la ou une photo differente produisait un saut visuel.
import heroVideoPoster from '../assets/hero-video-poster.webp';
import BandeauDefilant from '../components/BandeauDefilant';
import { TexteAssemble, Revele, Couche, Cascade } from '../components/scroll/primitives';
import soinVisageAsset from '../assets/ba-hydrafacial-after.webp';

interface HomeViewProps {
  onNavigate: (page: Page) => void;
}

export default function HomeView({ onNavigate }: HomeViewProps) {
  // Head Spa FAQ accordions state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Conciergerie Digitale : Rituel Advisor State
  const [selectedConcern, setSelectedConcern] = useState<number>(0);

  // Hero section cinematic parallax & slow zoom on scroll
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.10]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.playbackRate = 0.88; // Cadence cinématique ralentie et majestueuse
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const featuredServices = [
    {
      title: "Japanese Head Spa",
      tag: "Signature Impériale",
      description: "Notre fleuron sensoriel d'exception. Diagnostic capillaire personnalisé, massage d'acupression Shiatsu royal, arche thermale en pluie de brume et dôme de vapeur holistique.",
      duration: "1h15",
      price: "120 €",
      image: LUXURY_IMAGES.headSpa,
      page: 'head-spa' as Page,
    },
    {
      title: "Soin du visage signature",
      tag: "Éclat Absolu",
      description: "Nettoie en profondeur extrême, extrait les imperfections par aspiration vortex brevetée, exfolie en douceur et gorge la peau de sérums botaniques anti-oxydants d'élite.",
      duration: "45 min",
      price: "105 €",
      image: LUXURY_IMAGES.hydraFacial,
      page: 'soins-visage' as Page,
    },
    {
      title: "Soin du visage régénérant",
      tag: "Jeunesse Cellulaire",
      description: "Relance instantanément la micro-circulation et l'élastine naturelle. Atténue visiblement les pores, ridules, cicatrices d'acné et insuffle un cocktail exclusif multivitaminé.",
      duration: "60 min",
      price: "160 €",
      image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800",
      page: 'soins-visage' as Page,
    },
    {
      title: "Beauté du Regard",
      tag: "Regard Hypnotique",
      description: "L'excellence du Browlift et du Rehaussement de cils à la kératine. Redéfinir l'harmonie de votre visage pour un fini d'un raffinement absolu, sans maquillage au réveil.",
      duration: "45 min",
      price: "Dès 25 €",
      image: LUXURY_IMAGES.beauteRegard,
      page: 'beaute-regard' as Page,
    },
    {
      title: "Épilation IPL",
      tag: "Haute Technologie",
      description: "Grâce à notre dispositif professionnel de lumière pulsée équipé de la technologie 'Doul-Cooling', réduisez durablement votre pilosité dans une fraîcheur et un confort d'exception.",
      duration: "Séance sur-mesure",
      price: "Dès 30 €",
      image: LUXURY_IMAGES.iplEpilation,
      page: 'ipl' as Page,
    },
    {
      title: "Blanchiment Dentaire",
      tag: "Sourire Éclatant",
      description: "Retrouvez un sourire lumineux en une seule séance grâce à notre protocole de double exposition LED douce, tout en respectant l'émail et les gencives.",
      duration: "30 à 60 min",
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
      
      {/* ========================================================================= */}
      {/* 1. SCÈNE D'OUVERTURE : HERO CINÉMATIQUE 100VH PLEIN ÉCRAN                 */}
      {/* ========================================================================= */}
      <section 
        ref={heroRef} 
        className="relative w-full h-screen min-h-[660px] flex items-center justify-center overflow-hidden"
      >
        {/* Vidéo de fond avec ralenti fluide et travelling de profondeur au scroll */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={heroVideoPoster}
            disablePictureInPicture
            aria-hidden="true"
            style={{ y: videoY, scale: videoScale }}
            className="w-full h-full object-cover object-center pointer-events-none"
          >
            <source src="/videos/hero-salon.mp4" type="video/mp4" />
          </motion.video>

          {/* Calques d'étalonnage cinématographique haut de gamme */}
          {/* Teinte ambrée subtile */}
          <div className="absolute inset-0 bg-black/35 pointer-events-none" />
          
          {/* Végétalisation d'ombre au sommet pour lisibilité de la navbar */}
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />

          {/* Halo radial chaud sculpté sur les lumières dorées du salon */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.1)_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

          {/* Fondu vaporeux à la base vers le beige noble de la Maison */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#EFE7D2] via-[#EFE7D2]/40 to-transparent pointer-events-none" />
        </div>

        {/* Contenu textuel et émotionnel du Hero */}
        <motion.div 
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center justify-center pt-20 pb-16"
        >
          {/* Petit label haut de gamme */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
            className="mb-5 sm:mb-7 flex items-center gap-3"
          >
            <span className="w-6 h-[1px] bg-[#DFC48B]/60" />
            <span className="inline-block text-[11px] sm:text-xs font-sans font-medium uppercase tracking-[0.38em] text-[#DFC48B] drop-shadow-md select-none">
              L’ATELIER by Lola
            </span>
            <span className="w-6 h-[1px] bg-[#DFC48B]/60" />
          </motion.div>

          {/* Grand titre éditorial et monumental */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease: "easeOut", delay: 0.3 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-[4.75rem] font-normal text-white tracking-tight leading-[1.12] max-w-4xl drop-shadow-[0_4px_30px_rgba(0,0,0,0.65)]"
          >
            Le soin commence avant même de fermer les yeux.
          </motion.h1>

          {/* Sous-texte précis et délicat */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: "easeOut", delay: 0.45 }}
            className="mt-6 sm:mt-8 text-xs sm:text-sm md:text-base text-white/90 font-light tracking-[0.22em] uppercase font-sans drop-shadow-sm max-w-2xl mx-auto"
          >
            Head Spa japonais · Soins visage · Le Pré-Saint-Gervais
          </motion.p>

          {/* Boutons d'action de prestige */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: "easeOut", delay: 0.6 }}
            className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 w-full sm:w-auto"
          >
            {/* Bouton principal or brossé */}
            <motion.button
              onClick={() => {
                onNavigate('reservation');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-9 sm:px-10 py-4 rounded-full btn-gold-cinematic text-xs sm:text-[13px] font-semibold uppercase tracking-[0.22em] flex items-center justify-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar className="h-4 w-4 text-white" />
              Réserver une expérience
            </motion.button>

            {/* Lien secondaire minimaliste */}
            <button
              onClick={() => {
                const el = document.getElementById('maison');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-xs sm:text-[13px] text-white/90 hover:text-[#DFC48B] font-light tracking-[0.22em] uppercase transition-colors duration-200 py-2 border-b border-white/40 hover:border-[#DFC48B] cursor-pointer flex items-center gap-2 group"
            >
              <span>Découvrir la maison</span>
              <span className="text-xs transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
            </button>
          </motion.div>

          {/* Badge discret de confidentialité */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-8 flex items-center gap-2 text-[11px] text-white/70 font-light tracking-widest uppercase"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#DFC48B] animate-pulse" />
            <span>Salon privatisé sur rendez-vous</span>
          </motion.div>
        </motion.div>

      </section>

      {/* ========================================================================= */}
      {/* 2. SECTION MAISON : SAVOIR-FAIRE, INTIMITÉ ET SANCTUAIRE                  */}
      {/* ========================================================================= */}
      <section id="maison" className="py-20 max-w-7xl mx-auto px-6 md:px-12 relative">
        {/* Le sol se réchauffe à mesure qu'on descend. L'espresso du bandeau
            n'arrive donc pas sur un fond froid : il arrive après une transition
            que la visiteuse a traversée sans la remarquer. */}
        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen bg-gradient-to-b from-[#EFE7D2] via-[#EFE7D2] to-[#E9DFC8]"
          aria-hidden="true"
        />
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Colonne Gauche : Narration Éditoriale Haute Couture */}
          <div className="lg:col-span-8 lg:col-start-3 space-y-8">
            <div className="space-y-3">
              <span className="text-[11px] font-sans uppercase tracking-[0.35em] text-[#B88F4D] font-semibold block">
                Édition Confidentielle · Le Pré-Saint-Gervais
              </span>
              {/* Le titre s'assemble ligne a ligne pendant que le cadre reste
                  immobile : la section est un argument, pas une image. */}
              <h2 className="font-serif text-3.5xl sm:text-5xl md:text-5xl lg:text-[3.65rem] text-charcoal font-normal leading-[1.12] tracking-tight">
                <TexteAssemble
                  lignes={[
                    'Un sanctuaire confidentiel',
                    <>
                      dédié au{' '}
                      <span className="font-signature text-5xl sm:text-6xl text-[#B88F4D] italic">
                        lâcher-prise
                      </span>
                    </>,
                  ]}
                />
              </h2>
            </div>

            <div className="w-20 h-[1.5px] bg-[#B88F4D]" />

            <p className="text-secondary-gray text-sm sm:text-base font-light leading-relaxed">
              L’Atelier by Lola n'est pas un salon de passage. C'est une parenthèse intime, pensée pour celles et ceux qui recherchent l'excellence du geste, le silence réparateur et des résultats visibles immédiats.
            </p>

            <blockquote className="border-l-2 border-[#B88F4D] pl-5 italic font-serif text-sm sm:text-base text-charcoal/80 font-light leading-relaxed">
              « Ici, le temps suspend son vol. Vous n'êtes pas un rendez-vous parmi d'autres, vous êtes l'hôte exclusif d'un lieu privatisé. »
            </blockquote>

            {/* Les 3 piliers sensoriels présentés avec raffinement */}
            <div className="space-y-6 pt-2">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#B88F4D]/10 text-[#B88F4D] flex items-center justify-center font-serif text-sm font-semibold shrink-0 mt-1">
                  01
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-lg text-charcoal font-medium">Le Head Spa Japonais Originel</h4>
                  <p className="text-xs sm:text-sm text-secondary-gray font-light leading-relaxed">
                    L'arche thermale en pluie chaude continue, le massage Shiatsu des méridiens crâniens et le bain de vapeur ionisé pour dénouer les tensions mentales et nourrir le cheveu à la source.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#B88F4D]/10 text-[#B88F4D] flex items-center justify-center font-serif text-sm font-semibold shrink-0 mt-1">
                  02
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-lg text-charcoal font-medium">La Haute Facialiste</h4>
                  <p className="text-xs sm:text-sm text-secondary-gray font-light leading-relaxed">
                    Des protocoles alliant la technologie d'aspiration vortex brevetée, la bio-stimulation cellulaire et des sérums botaniques purs pour un éclat purifié et durable.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#B88F4D]/10 text-[#B88F4D] flex items-center justify-center font-serif text-sm font-semibold shrink-0 mt-1">
                  03
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-lg text-charcoal font-medium">Le Boudoir Totalement Privatisé</h4>
                  <p className="text-xs sm:text-sm text-secondary-gray font-light leading-relaxed">
                    À chaque séance, les portes de l'Atelier se ferment pour vous. Lumière chaude tamisée, acoustique feutrée, diffusion d'arômes rares : un espace où l'on se sent enfin chez soi.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <motion.button
                onClick={() => {
                  onNavigate('reservation');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-gold-cinematic !py-3.5 !px-8 rounded-full text-xs font-semibold uppercase tracking-[0.2em] cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Réserver votre parenthèse
              </motion.button>
            </div>
          </div>

        </div>
      </section>

      {/* ===================================================================== */}
      {/* LE BANDEAU — le moment que la visiteuse doit retenir.                  */}
      {/* Il arrive apres une section volontairement calme : sans ce silence,    */}
      {/* un sommet n'en est plus un.                                           */}
      {/* ===================================================================== */}
      <BandeauDefilant />

      {/* ========================================================================= */}
      {/* 3. L'ATMOSPHÈRE & LE LIEU : IDENTITÉ RÉELLE DU SALON                      */}
      {/* ========================================================================= */}
      <section className="py-24 bg-white/70 border-y border-[#B88F4D]/15 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="font-serif text-3xl sm:text-5xl text-charcoal font-normal leading-tight tracking-tight">
              Une architecture intérieure pensée pour apaiser
            </h2>
            <div className="w-16 h-[1.5px] bg-[#B88F4D] mx-auto" />
            <p className="text-secondary-gray text-xs sm:text-sm font-light leading-relaxed">
              Murs beige à la chaux texturés, miroirs arqués rétroéclairés, fauteuils noirs au confort enveloppant et pierre claire minérale. Chaque détail a été composé pour offrir un cocon de paix.
            </p>
          </div>

          <Cascade className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch" classeEnfant="h-full">
            
            {/* Volet 1 : Les Arches et la Lumière */}
            <div className="h-full bg-[#EFE7D2]/60 p-8 rounded-3xl border border-[#B88F4D]/15 flex flex-col justify-between space-y-6 hover:shadow-lg transition-colors duration-200">
              <div className="space-y-3">
                <span className="text-[10px] font-sans text-[#B88F4D] uppercase tracking-widest block">LUMIÈRE & FORMES</span>
                <h3 className="font-serif text-xl text-charcoal font-medium">Miroirs Arqués & Niches Sculptées</h3>
                <p className="text-xs sm:text-sm text-secondary-gray font-light leading-relaxed">
                  Des arches lumineuses rétroéclairées qui diffusent une clarté ambrée douce et enveloppante. Pas de néons agressifs, mais un éclairage chaleureux propice au lâcher-prise immédiat.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#B88F4D] font-medium tracking-wide">
                <span>✦ Ambiance feutrée & chaleureuse</span>
              </div>
            </div>

            {/* Volet 2 : Les Matières Minérales */}
            <div className="h-full bg-[#EFE7D2]/60 p-8 rounded-3xl border border-[#B88F4D]/15 flex flex-col justify-between space-y-6 hover:shadow-lg transition-colors duration-200">
              <div className="space-y-3">
                <span className="text-[10px] font-sans text-[#B88F4D] uppercase tracking-widest block">MATIÈRE & TEXTURE</span>
                <h3 className="font-serif text-xl text-charcoal font-medium">Enduit Beige & Pierre Minérale</h3>
                <p className="text-xs sm:text-sm text-secondary-gray font-light leading-relaxed">
                  Le toucher brut de la chaux texturée sur les murs et la fraîcheur noble du sol en pierre claire. Une palette naturelle sable, ivoire et champagne qui apaise l'esprit dès le pas de la porte.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#B88F4D] font-medium tracking-wide">
                <span>✦ Inspiré des sanctuaires de Kyoto</span>
              </div>
            </div>

            {/* Volet 3 : L'Écrin Privatisé */}
            <div className="h-full bg-[#EFE7D2]/60 p-8 rounded-3xl border border-[#B88F4D]/15 flex flex-col justify-between space-y-6 hover:shadow-lg transition-colors duration-200">
              <div className="space-y-3">
                <span className="text-[10px] font-sans text-[#B88F4D] uppercase tracking-widest block">CONFORT & INTIMITÉ</span>
                <h3 className="font-serif text-xl text-charcoal font-medium">Fauteuils Noirs & Comptoir Épuré</h3>
                <p className="text-xs sm:text-sm text-secondary-gray font-light leading-relaxed">
                  Des assises ergonomiques profondes aux lignes noires élégantes, contrastant avec le comptoir d'accueil blanc minimaliste. Une hygiène irréprochable et un confort absolu pour vos soins.
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-xs text-[#B88F4D] font-medium tracking-wide">
                <span>✦ Espace entièrement désinfecté & privatisé</span>
              </div>
            </div>

          </Cascade>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PRESTATIONS : LA COLLECTION DES RITUELS D'EXCEPTION                   */}
      {/* ========================================================================= */}
      <section id="rituels" className="py-28 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-left mb-20 space-y-4">
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-charcoal font-normal leading-tight tracking-tight">
            Les Rituels d'Auteur
          </h2>
          <div className="w-16 h-[1.5px] bg-[#B88F4D]" />
          <p className="text-secondary-gray text-xs sm:text-sm max-w-lg font-light leading-relaxed">
            Chaque soin est une chorégraphie sur-mesure mariant haute technologie esthétique et tradition de bien-être holistique.
          </p>
        </div>

        <div className="space-y-16">
          
          {/* RITUEL VEDETTE : un volet le découvre par le bas. Sur cette
              surface le mouvement se lit comme une révélation ; c'est le seul
              endroit de la page qui en a la place. */}
          <Revele depuis="bas">
          <div className="bg-white rounded-[32px] overflow-hidden border border-[#B88F4D]/20 shadow-xl grid grid-cols-1 lg:grid-cols-12 items-stretch group">
            <div className="lg:col-span-7 h-80 sm:h-96 lg:h-auto min-h-[380px] relative overflow-hidden">
              <img 
                src={featuredServices[0].image} 
                alt="Japanese Head Spa impérial à l'Atelier by Lola" 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/60 to-transparent" />
              <div className="absolute top-6 left-6 bg-[#B88F4D] text-white text-[11px] uppercase font-bold tracking-widest px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> Rituel Signature Impériale
              </div>
            </div>
            
            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-baseline border-b border-[#B88F4D]/20 pb-4">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3.5xl text-charcoal font-normal">{featuredServices[0].title}</h3>
                    <span className="text-xs text-secondary-gray font-light">Durée du rituel : {featuredServices[0].duration}</span>
                  </div>
                  <span className="font-serif text-2xl text-[#B88F4D] font-semibold shrink-0 ml-4">{featuredServices[0].price}</span>
                </div>
                
                <p className="text-xs sm:text-sm text-secondary-gray leading-relaxed font-light">
                  {featuredServices[0].description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full bg-[#B88F4D]/10 text-[#B88F4D]">
                    Arche d'eau en halo
                  </span>
                  <span className="text-[11px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full bg-[#B88F4D]/10 text-[#B88F4D]">
                    Massage Shiatsu
                  </span>
                  <span className="text-[11px] uppercase tracking-wider font-semibold px-3 py-1 rounded-full bg-[#A3A485]/15 text-[#A3A485]">
                    Dôme de brume ionisé
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <motion.button
                  onClick={() => {
                    onNavigate('reservation');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 btn-gold-cinematic !py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Réserver ce rituel
                </motion.button>
                <button
                  onClick={() => onNavigate(featuredServices[0].page)}
                  className="px-6 py-3.5 bg-beige-bg hover:bg-charcoal hover:text-white text-charcoal rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-300 cursor-pointer text-center"
                >
                  Détails du Head Spa
                </button>
              </div>
            </div>
          </div>
          </Revele>

          {/* RITUELS DUO : SOINS DU VISAGE D'ÉLITE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Soin Signature Éclat Absolu */}
            <div className="bg-white rounded-[32px] overflow-hidden border border-[#B88F4D]/15 shadow-md flex flex-col justify-between group">
              <div>
                <div className="relative h-64 sm:h-72 overflow-hidden">
                  <img 
                    src={featuredServices[1].image} 
                    alt={featuredServices[1].title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur text-charcoal text-[11px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-md border border-[#B88F4D]/10">
                    {featuredServices[1].tag}
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-baseline border-b border-gray-100 pb-3">
                    <div>
                      <h4 className="font-serif text-xl sm:text-2xl text-charcoal font-medium">{featuredServices[1].title}</h4>
                      <span className="text-xs text-secondary-gray font-light">Durée : {featuredServices[1].duration}</span>
                    </div>
                    <span className="font-serif text-xl text-[#B88F4D] font-bold">{featuredServices[1].price}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-secondary-gray font-light leading-relaxed">
                    {featuredServices[1].description}
                  </p>
                </div>
              </div>
              <div className="p-8 pt-0 flex gap-3">
                <button
                  onClick={() => {
                    onNavigate('reservation');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 py-3.5 bg-[#B88F4D] hover:bg-charcoal text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-200"
                >
                  Réserver (105 €)
                </button>
                <button
                  onClick={() => onNavigate(featuredServices[1].page)}
                  className="px-5 py-3.5 bg-beige-bg text-charcoal rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-charcoal hover:text-white transition-colors"
                >
                  Découvrir
                </button>
              </div>
            </div>

            {/* Soin Régénérant Cellulaire */}
            <div className="bg-white rounded-[32px] overflow-hidden border border-[#B88F4D]/15 shadow-md flex flex-col justify-between group">
              <div>
                <div className="relative h-64 sm:h-72 overflow-hidden">
                  <img 
                    src={featuredServices[2].image} 
                    alt={featuredServices[2].title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur text-charcoal text-[11px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-md border border-[#B88F4D]/10">
                    {featuredServices[2].tag}
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-baseline border-b border-gray-100 pb-3">
                    <div>
                      <h4 className="font-serif text-xl sm:text-2xl text-charcoal font-medium">{featuredServices[2].title}</h4>
                      <span className="text-xs text-secondary-gray font-light">Durée : {featuredServices[2].duration}</span>
                    </div>
                    <span className="font-serif text-xl text-[#B88F4D] font-bold">{featuredServices[2].price}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-secondary-gray font-light leading-relaxed">
                    {featuredServices[2].description}
                  </p>
                </div>
              </div>
              <div className="p-8 pt-0 flex gap-3">
                <button
                  onClick={() => {
                    onNavigate('reservation');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex-1 py-3.5 bg-[#B88F4D] hover:bg-charcoal text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-200"
                >
                  Réserver (160 €)
                </button>
                <button
                  onClick={() => onNavigate(featuredServices[2].page)}
                  className="px-5 py-3.5 bg-beige-bg text-charcoal rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-charcoal hover:text-white transition-colors"
                >
                  Découvrir
                </button>
              </div>
            </div>

          </div>

          {/* RITUELS HAUTE PRÉCISION : BROWLIFT, IPL & BLANCHIMENT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Beauté du regard */}
            <div className="bg-white p-7 rounded-3xl border border-[#B88F4D]/15 flex flex-col justify-between space-y-5 shadow-sm">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-[#B88F4D] tracking-wider">Regard / {featuredServices[3].price}</span>
                <h4 className="font-serif text-xl text-charcoal font-medium">{featuredServices[3].title}</h4>
                <p className="text-xs text-secondary-gray font-light leading-relaxed">{featuredServices[3].description}</p>
              </div>
              <button
                onClick={() => onNavigate(featuredServices[3].page)}
                className="w-full py-3 bg-[#EFE7D2] hover:bg-[#B88F4D] text-charcoal hover:text-white rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors duration-300"
              >
                Harmoniser mon regard
              </button>
            </div>

            {/* Épilation IPL */}
            <div className="bg-white p-7 rounded-3xl border border-[#B88F4D]/15 flex flex-col justify-between space-y-5 shadow-sm">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-[#A3A485] tracking-wider">IPL Cooling / {featuredServices[4].price}</span>
                <h4 className="font-serif text-xl text-charcoal font-medium">{featuredServices[4].title}</h4>
                <p className="text-xs text-secondary-gray font-light leading-relaxed">{featuredServices[4].description}</p>
              </div>
              <button
                onClick={() => onNavigate(featuredServices[4].page)}
                className="w-full py-3 bg-[#EFE7D2] hover:bg-[#B88F4D] text-charcoal hover:text-white rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors duration-300"
              >
                Bilan & Épilation IPL
              </button>
            </div>

            {/* Blanchiment Dentaire */}
            <div className="bg-white p-7 rounded-3xl border border-[#B88F4D]/15 flex flex-col justify-between space-y-5 shadow-sm">
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-[#B88F4D] tracking-wider">Éclat Sourire / {featuredServices[5].price}</span>
                <h4 className="font-serif text-xl text-charcoal font-medium">{featuredServices[5].title}</h4>
                <p className="text-xs text-secondary-gray font-light leading-relaxed">{featuredServices[5].description}</p>
              </div>
              <button
                onClick={() => onNavigate(featuredServices[5].page)}
                className="w-full py-3 bg-[#EFE7D2] hover:bg-[#B88F4D] text-charcoal hover:text-white rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors duration-300"
              >
                Révéler mon sourire
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FOCUS SENSORIEL : LE SANCTUAIRE HEAD SPA JAPONAIS                      */}
      {/* ========================================================================= */}
      <section className="bg-charcoal text-white py-28 relative overflow-hidden">
        {/* Deux couches de lumière qui avancent à leur propre vitesse, en sens
            contraires. Sans cet écart la lumière est un décor peint ; avec, la
            salle a une profondeur. Aucun texte ne voyage dessus : ce qu'on lit
            ne doit pas bouger par rapport à ce sur quoi on le lit. */}
        <Couche taux={1.1} className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-0 w-96 h-96 rounded-full bg-[#B88F4D]/10 blur-[140px]" />
        </Couche>
        <Couche taux={-0.7} className="absolute inset-0 pointer-events-none">
          <div className="absolute -bottom-20 right-0 w-96 h-96 rounded-full bg-[#A3A485]/10 blur-[140px]" />
        </Couche>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Colonne Gauche : Image et indicateur */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative rounded-[32px] overflow-hidden border border-[#DFC48B]/30 shadow-2xl group">
                <img
                  src={LUXURY_IMAGES.headSpa}
                  alt="Arche d'eau chaude japonaise en halo"
                  className="w-full h-[420px] object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute bottom-4 right-4 glass-dark text-white text-[10px] tracking-widest uppercase font-semibold px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-[#DFC48B]" /> Arche d'affusion active
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <span className="text-[#DFC48B] text-2xl font-serif font-bold block">1h15</span>
                  <span className="text-[10px] uppercase text-gray-400 tracking-wider">Durée complète</span>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <span className="text-[#DFC48B] text-2xl font-serif font-bold block">120 €</span>
                  <span className="text-[10px] uppercase text-gray-400 tracking-wider">Tarif séance</span>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Protocole et Bienfaits */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-[#DFC48B] font-bold block">
                  TRADITION THERMALE DE KYOTO
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl text-white font-normal leading-tight tracking-tight">
                  L'Onsen du Cuir Chevelu
                </h2>
                <div className="w-16 h-[1.5px] bg-[#DFC48B]" />
                <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed max-w-xl">
                  Une immersion relaxante révolutionnaire où l'eau de source chaude, le massage Shiatsu des méridiens crâniens et l'arche de pluie en halo soignent la fibre capillaire et apaisent profondément l'esprit.
                </p>
              </div>

              {/* 4 Vertus Clés */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-[#DFC48B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm text-gray-100 font-medium block">Active la repousse</span>
                    <span className="text-[11px] text-gray-400 leading-snug">Stimule la micro-circulation du bulbe capillaire.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-[#DFC48B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm text-gray-100 font-medium block">Régule le sébum</span>
                    <span className="text-[11px] text-gray-400 leading-snug">Élimine toxines, pellicules et démangeaisons.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-[#DFC48B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm text-gray-100 font-medium block">Libère la charge mentale</span>
                    <span className="text-[11px] text-gray-400 leading-snug">Dénoue les céphalées et les tensions de la nuque.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-[#DFC48B] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs sm:text-sm text-gray-100 font-medium block">Améliore le sommeil</span>
                    <span className="text-[11px] text-gray-400 leading-snug">Effet calmant prolongé par acupression crânienne.</span>
                  </div>
                </div>
              </div>

              {/* Les 3 Étapes du Rituel */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#DFC48B] text-charcoal flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white">Diagnostic micro-caméra & Gommage détox</span>
                    <p className="text-xs text-gray-400 font-light">Analyse personnalisée de vos racines et exfoliation douce.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#DFC48B] text-charcoal flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white">Massage Shiatsu sous le halo d'eau chaude</span>
                    <p className="text-xs text-gray-400 font-light">Acupression lente et continue sur les points énergétiques du crâne.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#DFC48B] text-charcoal flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white">Dôme de brume ionisée & Soin réparateur</span>
                    <p className="text-xs text-gray-400 font-light">Infusion sous vapeur tiède d'actifs réparateurs profonds.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={() => {
                    onNavigate('reservation');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn-gold-cinematic !py-3.5 !px-8 rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Réserver une séance Head Spa
                </motion.button>
                <button
                  onClick={() => onNavigate('head-spa')}
                  className="px-6 py-3.5 rounded-full border border-white/20 text-white hover:bg-white hover:text-charcoal text-xs uppercase tracking-wider transition-colors"
                >
                  Voir toute la page Head Spa
                </button>
              </div>

            </div>

          </div>

          {/* Accordéons FAQ Zen */}
          <div className="mt-20 max-w-3xl mx-auto space-y-3 pt-12 border-t border-white/10">
            <h3 className="font-serif text-2xl text-center text-white mb-8">Questions Fréquentes sur le Head Spa</h3>
            <div className="space-y-3">
              {headSpaFaqs.map((faq, idx) => (
                <div
                  key={`hs-faq-${idx}`}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-colors duration-200"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full flex justify-between items-center px-6 py-4.5 text-left text-xs md:text-sm font-medium tracking-wide text-white hover:text-[#DFC48B] transition-colors focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    {activeFaq === idx ? (
                      <ChevronUp className="h-4 w-4 text-[#DFC48B]" />
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
                        <div className="px-6 pb-5 pt-1 text-xs text-gray-300 leading-relaxed font-light border-t border-white/5">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CONCIERGERIE DIGITALE : ADVISOR DE RITUEL SUR-MESURE                   */}
      {/* ========================================================================= */}
      <section id="ritual-advisor-section" className="py-28 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <h2 className="font-serif text-3xl sm:text-5xl text-charcoal font-normal leading-tight tracking-tight">
            Quel rituel est fait pour vous ?
          </h2>
          <div className="w-16 h-[1.5px] bg-[#B88F4D] mx-auto" />
          <p className="text-secondary-gray text-xs sm:text-sm font-light leading-relaxed">
            Sélectionnez votre envie beauté. Notre conciergerie vous oriente vers le protocole sur-mesure le plus adapté à votre peau.
          </p>
        </div>

        {/* 4 Onglets de Navigation */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-4xl mx-auto">
          {[
            { label: "Éclat & Pureté", desc: "Teint terne & pores", concern: "Soin Signature" },
            { label: "Jeunesse Cellulaire", desc: "Fermeté & ridules", concern: "Soin Régénérant" },
            { label: "Phyto-Douceur", desc: "Peaux délicates", concern: "Soin Visage Bio" },
            { label: "Thalasso Visage", desc: "Stress & pollution", concern: "Soin aux Algues" }
          ].map((tab, idx) => (
            <button
              key={`ritual-tab-${idx}`}
              onClick={() => setSelectedConcern(idx)}
              className={`px-6 py-3.5 rounded-full transition-colors duration-200 border text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                selectedConcern === idx
                  ? 'bg-charcoal text-white border-charcoal shadow-md'
                  : 'bg-white text-secondary-gray border-[#B88F4D]/15 hover:border-[#B88F4D]/40 hover:bg-[#EFE7D2]'
              }`}
            >
              <span>{tab.label}</span>
              <span className="opacity-60 text-[10px] ml-2 lowercase font-normal italic">({tab.desc})</span>
            </button>
          ))}
        </div>

        {/* Carte interactive du rituel recommandé */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {comparisons.map((row, idx) => idx === selectedConcern && (
              <motion.div
                key={`advisor-result-${idx}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="bg-white rounded-[32px] border border-[#B88F4D]/20 shadow-xl p-6 sm:p-8 lg:p-10 relative overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Visuel */}
                  <div className="lg:col-span-5 relative">
                    <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md">
                      <img
                        src={row.image}
                        alt={row.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* Détails */}
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#B88F4D]/10 text-[11px] text-[#B88F4D] font-bold uppercase tracking-wider mb-3">
                        <Sparkles className="h-3 w-3" /> Recommandation Sur-Mesure
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl text-charcoal font-medium">
                        {row.name}
                      </h3>
                      <p className="text-xs text-[#B88F4D] uppercase tracking-wider font-semibold mt-1">
                        {row.type} · {row.duration} · {row.price}
                      </p>
                    </div>

                    <div className="h-[1px] w-full bg-[#B88F4D]/15" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#A17E60] font-bold block mb-1">Cible cutanée</span>
                        <p className="text-xs sm:text-sm text-secondary-gray leading-relaxed font-light">{row.target}</p>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#A17E60] font-bold block mb-1">Protocole technologique</span>
                        <p className="text-xs sm:text-sm text-charcoal font-medium leading-relaxed">{row.tech}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button
                        onClick={() => {
                          window.location.assign('/reservation');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="btn-gold-cinematic !py-3.5 !px-8 rounded-full text-xs font-semibold uppercase tracking-wider cursor-pointer text-center"
                      >
                        Réserver cette expérience
                      </button>
                      <button
                        onClick={() => onNavigate(row.action)}
                        className="px-6 py-3.5 bg-beige-bg text-charcoal hover:bg-charcoal hover:text-white rounded-full text-xs uppercase tracking-wider transition-colors text-center"
                      >
                        En savoir plus
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PREUVE DE CONFIANCE : AVIS CLIENTES 5.0 DE PRESTIGE                    */}
      {/* ========================================================================= */}
      <section className="py-24 bg-white/70 border-t border-[#B88F4D]/15">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
              La parole à celles et ceux qui ont vécu l'expérience
            </h2>
            <div className="w-16 h-[1.5px] bg-[#B88F4D] mx-auto" />
          </div>

          <Cascade className="grid grid-cols-1 md:grid-cols-3 gap-8" classeEnfant="h-full">
            {REVIEWS.slice(0, 3).map((review, idx) => (
              <div 
                key={`review-${idx}`}
                className="h-full bg-[#EFE7D2]/50 p-8 rounded-3xl border border-[#B88F4D]/15 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md transition-colors duration-200"
              >
                <div className="space-y-4">
                  <div className="text-[#B88F4D] text-sm tracking-widest">★★★★★</div>
                  <p className="text-xs sm:text-sm text-secondary-gray font-light leading-relaxed italic">
                    « {review.text} »
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-[#B88F4D]/15 pt-4 text-xs">
                  <span className="font-serif font-semibold text-charcoal">{review.author}</span>
                  <span className="text-[10px] text-secondary-gray uppercase">{review.date}</span>
                </div>
              </div>
            ))}
          </Cascade>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. L'INVITATION FINALE : CTA DE HAUTE VOLÉE                                */}
      {/* ========================================================================= */}
      <section className="py-28 bg-[#DDCCB2]/40 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-8 relative z-10">
          <div className="space-y-4">
            {/* La dernière phrase se pose en deux temps puis tient. Une page
                qui se termine en s'effaçant ne laisse aucune dernière
                sensation à emporter. */}
            <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl text-charcoal font-normal leading-tight tracking-tight">
              <TexteAssemble
                decalage={0.11}
                lignes={[
                  "Prête à vivre l'expérience",
                  "L'Atelier by Lola ?",
                ]}
              />
            </h2>
            <div className="w-20 h-[1.5px] bg-[#B88F4D] mx-auto" />
            <p className="text-secondary-gray text-xs sm:text-base font-light leading-relaxed max-w-2xl mx-auto">
              Le salon est entièrement privatisé à chaque séance pour vous garantir une attention exclusive, sans bruit ni précipitation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <motion.button
              onClick={() => {
                onNavigate('reservation');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-gold-cinematic !py-4.5 !px-10 rounded-full text-xs font-semibold uppercase tracking-[0.22em] shadow-xl cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Réserver votre expérience privée
            </motion.button>
            <a
              href={`tel:${INSTITUT_INFO.phoneFormatted}`}
              className="px-8 py-4 rounded-full border border-[#B88F4D]/40 text-charcoal hover:bg-white text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
            >
              <Phone className="h-3.5 w-3.5 text-[#B88F4D]" />
              06 60 10 04 31
            </a>
          </div>

          <p className="text-[11px] text-secondary-gray font-light uppercase tracking-widest pt-2">
            10 rue du 14 juillet, 93310 Le Pré-Saint-Gervais · À 2 min de Paris 19e
          </p>
        </div>
      </section>


    </div>
  );
}

