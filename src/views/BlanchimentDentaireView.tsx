import { motion } from 'motion/react';
import { Calendar, CheckCircle2, Star, Sparkles, AlertTriangle, Info, Ban, Stethoscope } from 'lucide-react';
import { BLANCHIMENT_DENTAIRE_DATA, INSTITUT_INFO, LUXURY_IMAGES } from '../data';
import FaqSection from '../components/FaqSection';
import BlanchimentAvantApres from '../components/BlanchimentAvantApres';

export default function BlanchimentDentaireView() {
  return (
    <div id="blanchiment-dentaire-view" className="w-full pt-28 pb-10">
      
      {/* Visual Ambient Banner */}
      <section className="relative h-[250px] md:h-[350px] flex items-center justify-center bg-black overflow-hidden rounded-b-[24px]">
        <img
          src={LUXURY_IMAGES.blanchimentDentaire}
          alt="Blanchiment Dentaire Le Pré-Saint-Gervais L'Atelier Lola"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-102 filter brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#EFE7D2] via-black/10 to-black/35" />
        
        <div className="relative z-10 text-center space-y-3 px-4">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/95 font-bold bg-[#B88F4D] px-4 py-1.5 rounded-full border border-white/20">
            Esthétique du Sourire LED
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-white font-light tracking-wide">
            Blanchiment Dentaire Premium
          </h1>
          <p className="text-white/80 text-xs md:text-sm italic font-serif">
            Illuminez instantanément votre expression faciale avec notre protocole de pointe au Pré-Saint-Gervais
          </p>
        </div>
      </section>

      {/* Intro Text */}
      <section className="py-12 max-w-4xl mx-auto px-4 md:px-8 text-center space-y-4">
        <h2 className="font-serif text-2xl md:text-3xl text-charcoal font-medium">Un Sourire Lumineux & Sûr</h2>
        <p className="text-secondary-gray text-xs md:text-sm leading-relaxed max-w-2xl mx-auto">
          {BLANCHIMENT_DENTAIRE_DATA.description}
        </p>
      </section>

      {/* Interactive Before / After */}
      <BlanchimentAvantApres />

      {/* Pricing and Details Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left column: Priced options */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#B88F4D] font-bold">Rituels de Blancheur</span>
            <h3 className="font-serif text-xl md:text-2xl text-charcoal font-medium">Nos Formules Éclat LED</h3>
            <div className="h-[1px] w-20 bg-[#B88F4D]/40" />
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BLANCHIMENT_DENTAIRE_DATA.items.map((item, idx) => (
              <div
                key={`blanch-${idx}`}
                className={`bg-white rounded-[24px] p-6 border transition-all duration-300 flex flex-col justify-between group relative h-full shadow-sm ${
                  item.isPopular
                    ? 'border-[#B88F4D] shadow-md'
                    : 'border-[#B88F4D]/10 hover:border-[#B88F4D]/20 hover:shadow-lg'
                }`}
              >
                {item.isPopular && (
                  <span className="inline-block self-start mb-3 bg-[#B88F4D] shadow-sm text-white text-[9px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">
                    Sourire Star
                  </span>
                )}


                <div className="space-y-3">
                  <div className="flex justify-between items-baseline gap-4">
                    <h4 className="font-serif text-base md:text-lg font-bold text-charcoal group-hover:text-[#B88F4D] transition-colors">
                      {item.name}
                    </h4>
                    <span className="font-serif text-lg font-bold text-[#B88F4D] shrink-0 whitespace-nowrap">
                      {item.price} €
                    </span>
                  </div>

                  {item.duration && (
                    <span className="inline-flex items-center gap-1 text-sm text-[#8A6A38] bg-[#B88F4D]/10 border border-[#B88F4D]/20 px-3 py-1.5 rounded-full font-semibold tracking-wide">
                      {item.duration}
                    </span>
                  )}

                  {item.description && (
                    <p className="text-xs text-secondary-gray leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-[#EFE7D2] flex items-center justify-between text-xs">
                  <span className="text-secondary-gray flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-[#B88F4D]" /> Zéro sensibilité
                  </span>
                  <a
                    href={INSTITUT_INFO.planityUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B88F4D] font-semibold group-hover:underline flex items-center gap-1"
                  >
                    Réserver
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Benefits */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="bg-[#1E1E1E] text-white p-8 rounded-[24px] shadow-lg border-t-4 border-[#B88F4D] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/[0.02] filter blur-xl pointer-events-none" />
            
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#B88F4D] font-bold block">Sûr & Réglementé</span>
            <h3 className="font-serif text-xl text-white font-medium">Bénéfices Sourire</h3>
            
            <div className="h-[1px] w-full bg-white/10" />

            <ul className="space-y-4">
              {BLANCHIMENT_DENTAIRE_DATA.benefits.map((benefit, idx) => (
                <li key={`blanch-ben-${idx}`} className="flex items-start gap-4 text-xs md:text-sm text-gray-300">
                  <CheckCircle2 className="h-5 w-5 text-[#B88F4D] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-[11px] text-gray-400 space-y-1">
              <span className="text-[#A3A485] font-semibold block">Astuce de Lola :</span>
              La diète blanche (pâtes, riz, blanc de dinde) est absolument exigée pendant les 48 heures suivant la séance pour sceller l'éclat dentaire.
            </div>
          </div>

          {/* Simple book box */}
          <div className="bg-white border border-[#B88F4D]/20 p-8 rounded-[24px] shadow-sm text-center space-y-4">
            <h4 className="font-serif text-lg text-charcoal">Prendre RDV</h4>
            <p className="text-secondary-gray text-xs leading-relaxed">
              Consultez Lola pour votre blanchiment dentaire esthétique indolore sur Planity au Pré-Saint-Gervais.
            </p>
            <motion.a
              href={INSTITUT_INFO.planityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 rounded-[24px] bg-[#B88F4D] tracking-[0.1em] py-4 text-xs font-semibold uppercase text-white shadow-md hover:bg-[#A17E60]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar className="h-4 w-4" />
              Réserver ma séance Éclat
            </motion.a>
          </div>

        </div>

      </section>

      {/* Contre-indications */}
      <section className="bg-[#EFE7D2]/40 py-16 md:py-24 border-y border-[#B88F4D]/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-[0.2em] text-[#B88F4D] font-bold">Sécurité & Précautions</span>
            <h2 className="font-serif text-2xl md:text-4xl text-charcoal font-medium">Contre-indications</h2>
            <p className="text-secondary-gray text-sm md:text-base leading-relaxed">
              Le blanchiment dentaire est un soin esthétique encadré. Certaines situations médicales ou bucco-dentaires nécessitent de reporter ou d'écarter le traitement.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Générales */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-[#A17E60]/20 rounded-[24px] p-6 md:p-8 space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#A17E60]/10 flex items-center justify-center">
                  <Ban className="h-5 w-5 text-[#A17E60]" />
                </div>
                <h3 className="font-serif text-xl md:text-2xl text-charcoal font-medium">Contre-indications générales</h3>
              </div>

              <ul className="space-y-4">
                {[
                  'Grossesse et allaitement : Le traitement est interdit par précaution, car l\'effet du peroxyde d\'hydrogène n\'est pas évalué sur ces publics.',
                  'Allergies : Une allergie connue au peroxyde d\'hydrogène ou aux agents utilisés dans le gel exclut le traitement.',
                  'Pathologies spécifiques : Les personnes souffrant de maladies parodontales non contrôlées ou de certaines affections rares comme la porphyrie ne doivent pas se blanchir les dents.',
                ].map((item, idx) => (
                  <li key={`contre-gen-${idx}`} className="flex items-start gap-3 text-sm text-charcoal/80">
                    <AlertTriangle className="h-5 w-5 text-[#A17E60] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Bucco-dentaires */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-[#9FA392]/25 rounded-[24px] p-6 md:p-8 space-y-5"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#9FA392]/15 flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-[#9FA392]" />
                </div>
                <h3 className="font-serif text-xl md:text-2xl text-charcoal font-medium">Problèmes dentaires et bucco-dentaires</h3>
              </div>

              <ul className="space-y-4">
                {[
                  'Caries et infections : Le produit actif peut pénétrer dans la pulpe et causer de fortes douleurs si la dent est cariée ou fissurée.',
                  'Hypersensibilité : Des dents déjà très sensibles ou des gencives irritées risquent d\'aggraver leur inconfort face aux agents oxydants.',
                  'Présence de restaurations : Les couronnes, bridges, facettes ou obturations (composites) ne changent pas de couleur, ce qui peut créer un résultat inesthétique et hétérogène.',
                  'Mauvaise hygiène bucco-dentaire : Un brossage insuffisant ou la présence excessive de tartre empêchent la réalisation du soin tant que la bouche n\'est pas soignée.',
                ].map((item, idx) => (
                  <li key={`contre-dent-${idx}`} className="flex items-start gap-3 text-sm text-charcoal/80">
                    <Info className="h-5 w-5 text-[#9FA392] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Accordion FAQs */}
      <section className="bg-white py-16 border-t border-[#B88F4D]/10">
        <FaqSection
          faqItems={BLANCHIMENT_DENTAIRE_DATA.faq}
          title="FAQ Blanchiment Dentaire • Le Pré-Saint-Gervais"
          subtitle="Toutes les réponses pour concilier émail dentaire protégé et luminosité."
        />
      </section>

    </div>
  );
}
