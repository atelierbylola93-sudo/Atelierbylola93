import { motion } from 'motion/react';
import { Calendar, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { IPL_DATA, INSTITUT_INFO, LUXURY_IMAGES } from '../data';
import FaqSection from '../components/FaqSection';

export default function IplView() {
  return (
    <div id="ipl-view" className="w-full pt-28 pb-10">
      
      {/* Visual Ambient Banner */}
      <section className="relative h-[250px] md:h-[350px] flex items-center justify-center bg-black overflow-hidden rounded-b-[24px]">
        <img
          src={LUXURY_IMAGES.iplEpilation}
          alt="Épilation Lumière Pulsée Le Pré-Saint-Gervais L'Atelier Lola"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-102 filter brightness-[0.75]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#EFE7D2] via-black/10 to-black/30" />
        
        <div className="relative z-10 text-center space-y-3 px-4">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/95 font-bold bg-[#A3A485] px-4 py-1.5 rounded-full border border-white/20">
            Dermotechnologie Épilation Définitive
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-white font-light tracking-wide">
            Épilation IPL Haut de Gamme
          </h1>
          <p className="text-white/80 text-xs md:text-sm italic font-serif">
            La pureté d'une peau douce et satinée, libérée durablement des poils au Pré-Saint-Gervais
          </p>
        </div>
      </section>

      {/* Intro Text */}
      <section className="py-12 max-w-4xl mx-auto px-4 md:px-8 text-center space-y-4">
        <h2 className="font-serif text-2xl md:text-3xl text-charcoal font-medium">L'Éradication Douce & Définitive</h2>
        <p className="text-secondary-gray text-xs md:text-sm leading-relaxed max-w-2xl mx-auto">
          {IPL_DATA.description}
        </p>
      </section>

      {/* Pricing and Details Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left column: Priced table of IPL treatments */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#B88F4D] font-bold">Menu des Zones</span>
            <h3 className="font-serif text-xl md:text-2xl text-charcoal font-semibold">Tarifs Épilation IPL (Lumière Pulsée)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {IPL_DATA.items.map((item, idx) => (
              <div
                key={`ipl-item-${idx}`}
                className={`bg-white rounded-[24px] p-6 border transition-all duration-300 flex flex-col justify-between group h-full shadow-sm ${
                  item.isPopular
                    ? 'border-[#B88F4D] shadow-md relative'
                    : 'border-[#B88F4D]/10 hover:border-[#B88F4D]/20'
                }`}
              >
                {item.isPopular && (
                  <span className="inline-block self-start mb-3 bg-[#B88F4D] shadow-sm text-white text-[9px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">
                    Glow Populaire
                  </span>
                )}

                <div className="space-y-2">

                  <div className="flex justify-between items-baseline gap-4">
                    <h4 className="font-serif text-sm md:text-base font-bold text-charcoal group-hover:text-champagne transition-colors">
                      {item.name}
                    </h4>
                    <span className="font-serif text-lg font-bold text-[#B88F4D] shrink-0 whitespace-nowrap">
                      {item.price} € <span className="text-[10px] text-gray-500 font-normal">/ séance</span>
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

                <div className="mt-4 pt-3 border-t border-[#EFE7D2] flex items-center justify-between text-[11px]">
                  <span className="text-secondary-gray">Peau protégée & douce</span>
                  <a
                    href={INSTITUT_INFO.planityUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B88F4D] font-semibold group-hover:underline"
                  >
                    Réserver
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Benefits with safe clinical notes */}
        <div className="lg:col-span-4 space-y-8">
          
          <div className="bg-[#1E1E1E] text-white p-8 rounded-[24px] shadow-lg border-t-4 border-[#B88F4D] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-white/[0.02] filter blur-xl pointer-events-none" />
            
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#B88F4D] font-bold block">Sécurisé & Garanti</span>
            <h3 className="font-serif text-xl text-white font-medium">Bénéfices de l'IPL</h3>
            
            <div className="h-[1px] w-full bg-white/10" />

            <ul className="space-y-4">
              {IPL_DATA.benefits.map((benefit, idx) => (
                <li key={`ipl-ben-${idx}`} className="flex items-start gap-3.5 text-xs md:text-sm text-gray-300">
                  <CheckCircle2 className="h-5 w-5 text-[#B88F4D] shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20 text-xs text-amber-200/90 space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>Contre-indications</span>
              </div>
              <p className="text-[10px]">L'épilation IPL est inappropriée pour les femmes enceintes, les peaux bronzées au soleil récemment, les tatouages recouvrant la zone, ou les poils blancs/blon très clairs qui manquent de mélanine.</p>
            </div>
          </div>

          {/* Simple book box */}
          <div className="bg-white border border-[#B88F4D]/20 p-8 rounded-[24px] shadow-sm text-center space-y-4">
            <h4 className="font-serif text-lg text-charcoal">Prendre RDV</h4>
            <p className="text-secondary-gray text-xs leading-relaxed">
              Consultez les disponibilités de Lola pour vos séances d'épilation longue durée sur Planity.
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
              Réserver ma séance IPL
            </motion.a>
          </div>

        </div>

      </section>

      {/* Accordion FAQs */}
      <section className="bg-white py-16 border-t border-[#B88F4D]/10">
        <FaqSection
          faqItems={IPL_DATA.faq}
          title="FAQ Épilation IPL • Le Pré-Saint-Gervais"
          subtitle="Comprendre le cycle de repousse et le mécanisme de la lumière pulsée guidée par Lola."
        />
      </section>

    </div>
  );
}
