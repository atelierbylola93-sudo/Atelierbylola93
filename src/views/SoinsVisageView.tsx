import { motion } from 'motion/react';
import { Calendar, CheckCircle2, Sparkles } from 'lucide-react';
import { SOINS_VISAGE_DATA, LUXURY_IMAGES } from '../data';
import FaqSection from '../components/FaqSection';
import LocalSeoSection from '../components/LocalSeoSection';
import PrixVitrine from '../components/PrixVitrine';

export default function SoinsVisageView() {
  return (
    <div id="soins-visage-view" className="w-full pt-28 pb-10">
      
      {/* Top Banner */}
      <section className="relative h-[250px] md:h-[350px] flex items-center justify-center bg-black overflow-hidden rounded-b-[24px]">
        <img
          src={LUXURY_IMAGES.hydraFacial}
          alt="Soins du visage d'exception Le Pré-Saint-Gervais L'Atelier by Lola"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-102 filter brightness-[0.80]"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#EFE7D2] via-black/10 to-black/35" />
        
        <div className="relative z-10 text-center space-y-3 px-4">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/95 font-bold bg-[#A3A485] px-4 py-1.5 rounded-full border border-white/20 animate-pulse">
            Soins du visage d'exception
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-white font-light tracking-wide">
            Soins du Visage d'Exception
          </h1>
          <p className="text-white/80 text-xs md:text-sm italic font-serif">
            Technologie médico-esthétique de pointe pour un glow immédiat et durable au Pré-Saint-Gervais
          </p>
        </div>
      </section>

      {/* Main Grid: Description & Services Display */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Side: Services Catalog */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#B88F4D] font-bold">Rituels Cliniques & Bio</span>
            <h2 className="font-serif text-2xl md:text-4xl text-charcoal font-medium">
              {SOINS_VISAGE_DATA.subtitle}
            </h2>
            <div className="h-[1px] w-20 bg-[#B88F4D]/40" />
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SOINS_VISAGE_DATA.items.map((item, idx) => (
              <div
                key={`visage-${idx}`}
                className={`bg-white rounded-[24px] p-6 border transition-all duration-300 flex flex-col justify-between group relative h-full shadow-sm ${
                  item.isPopular
                    ? 'border-[#B88F4D] shadow-md'
                    : 'border-[#B88F4D]/10 hover:border-[#B88F4D]/20 hover:shadow-lg'
                }`}
              >
                {item.isPopular && (
                  <span className="inline-block self-start mb-3 bg-[#B88F4D] shadow-sm text-white text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">
                    Glow Vedette
                  </span>
                )}


                <div className="space-y-3">
                  <div className="flex justify-between items-baseline gap-4">
                    <h4 className="font-serif text-base md:text-lg font-bold text-charcoal group-hover:text-[#B88F4D] transition-colors">
                      {item.name}
                    </h4>
                    <span className="font-serif text-lg font-bold text-[#B88F4D] shrink-0 whitespace-nowrap">
                      <PrixVitrine nom={item.name} prix={item.price} />
                    </span>
                  </div>

                  {item.duration && (
                    <span className="inline-flex items-center gap-1 text-sm text-[#8A6A38] bg-[#B88F4D]/10 border border-[#B88F4D]/20 px-3 py-1.5 rounded-full font-semibold tracking-wide">
                      {item.duration}
                    </span>
                  )}

                  {item.description && (
                    <p className="text-xs md:text-sm text-secondary-gray leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-[#EFE7D2] flex items-center justify-between text-xs">
                  <span className="text-secondary-gray flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-[#B88F4D]" />
                    {item.isPopular ? 'Éclat immédiat & durable' : 'Peau nette & lumineuse'}
                  </span>
                  <button
                    onClick={() => {
                      window.location.assign('/reservation');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-[#B88F4D] font-semibold group-hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Réserver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Skincare wisdom */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="bg-[#1E1E1E] text-white p-8 rounded-[24px] shadow-lg border-t-4 border-[#A3A485] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/[0.02] filter blur-xl pointer-events-none" />
            
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#A3A485] font-bold block">La Science du Teint</span>
            <h3 className="font-serif text-xl text-white font-medium">Bénéfices Visuels Immédiats</h3>
            
            <div className="h-[1px] w-full bg-white/10" />

            <ul className="space-y-4">
              {SOINS_VISAGE_DATA.benefits.map((benefit, idx) => (
                <li key={`visage-ben-${idx}`} className="flex items-start gap-3.5 text-xs md:text-sm text-gray-300">
                  <CheckCircle2 className="h-5 w-5 text-[#A3A485] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-xs text-gray-400 space-y-1">
              <span className="text-[#B88F4D] font-semibold block">Conseil d'éclat :</span>
              Nous recommandons le soin du visage signature 4 jours avant un grand événement pour un fini maquillage sublime, ou le soin régénérant pour traiter les imperfections en profondeur.
            </div>
          </div>

          {/* Planity Action Banner */}
          <div className="bg-white border border-[#B88F4D]/20 p-8 rounded-[24px] shadow-sm text-center space-y-4">
            <h4 className="font-serif text-lg text-charcoal">Éclat & Pureté Directe</h4>
            <p className="text-secondary-gray text-xs leading-relaxed">
              Planifiez votre protocole de soin visage de prestige avec Lola sur Planity au Pré-Saint-Gervais.
            </p>
            <motion.button
              onClick={() => {
                window.location.assign('/reservation');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full flex items-center justify-center gap-2 rounded-[24px] bg-[#B88F4D] tracking-[0.1em] py-4 text-xs font-semibold uppercase text-white shadow-md hover:bg-[#A17E60] transition-colors cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar className="h-4 w-4" />
              Réserver mon rendez-vous
            </motion.button>
          </div>

        </div>

      </section>

      {/* SEO Local — Accès, adresse & horaires */}
      <LocalSeoSection
        serviceName="Soins du Visage Signature au Pré-Saint-Gervais"
        serviceDescription="Soins du visage d'exception : soin signature éclat, soin régénérant et protocoles sur mesure pour une peau lumineuse, au Pré-Saint-Gervais, proche Pantin, Les Lilas et Paris 19e."
        url="https://latelierbylola.fr/soins-visage"
        accent="#A3A485"
      />

      {/* Accordion FAQs */}
      <section className="bg-white py-16 border-t border-[#B88F4D]/10">
        <FaqSection
          faqItems={SOINS_VISAGE_DATA.faq}
          title="FAQ Soins du Visage • Le Pré-Saint-Gervais"
          subtitle="Toutes les réponses de notre experte esthétique pour guider l'éclat de votre peau."
        />
      </section>

    </div>
  );
}
