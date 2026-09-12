import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Heart, Calendar, HelpCircle } from 'lucide-react';
import { COIFFURE_SERVICES, INSTITUT_INFO } from '../data';
import PrixVitrine from '../components/PrixVitrine';

export default function CoiffureView() {
  return (
    <div id="coiffure-view" className="w-full pt-28 pb-10">
      
      {/* Visual Ambient Banner */}
      <section className="relative h-[250px] md:h-[350px] flex items-center justify-center bg-[#EFE7D2] overflow-hidden rounded-b-[24px]">
        <img
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200"
          alt="Brushing de Luxe L'Atelier Lola"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover scale-102 filter brightness-110 contrast-95 saturate-95"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#EFE7D2]/70 via-[#EFE7D2]/55 to-[#EFE7D2]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#DDCCB2]/40 via-transparent to-[#A3A485]/15" />
        
        <div className="relative z-10 text-center space-y-3 px-4">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-charcoal font-bold bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#B88F4D]/30 shadow-sm">
            Coiffeur Le Pré-Saint-Gervais
          </span>
          <h1 className="font-serif text-3xl md:text-5xl text-charcoal font-light tracking-wider">
            Haute Coiffure & Lissages
          </h1>
          <p className="text-charcoal/70 text-xs md:text-sm italic font-serif">
            Coupes, couleurs créatrices et soins lissants moléculaires d'exception
          </p>
        </div>
      </section>

      {/* Intro Text */}
      <section className="py-12 max-w-4xl mx-auto px-4 md:px-8 text-center space-y-4">
        <h2 className="font-serif text-2xl md:text-3xl text-charcoal font-medium">L'Art de Sublime vos Cheveux</h2>
        <p className="text-secondary-gray text-xs md:text-sm leading-relaxed max-w-2xl mx-auto">
          À L'Atelier by Lola, vos cheveux reçoivent un traitement royal. Nous sommes experts en techniques de balayages créatifs, lissages organiques profonds et thérapie d'hydratation. Toujours avec les meilleurs agents renforçateurs comme <strong className="text-champagne">Olaplex</strong> et des concentrés actifs de biotine pure.
        </p>
      </section>

      {/* Detailed Services list styled with Luxury visual cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-20">
        {COIFFURE_SERVICES.map((group, groupIdx) => (
          <div key={`coif-group-${groupIdx}`} className="space-y-6">
            <div className="border-b border-[#B88F4D]/20 pb-4">
              <h3 className="font-serif text-xl md:text-2xl text-charcoal font-semibold tracking-wide uppercase flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#B88F4D]" />
                {group.categoryTitle}
              </h3>
              {group.description && (
                <p className="text-secondary-gray text-xs md:text-sm italic mt-1 pl-4">{group.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 md:pl-4">
              {group.items.map((item, itemIdx) => (
                <div
                  key={`coif-item-${itemIdx}`}
                  className={`bg-white card-rounded premium-shadow hover-lift p-6 border transition-all duration-300 flex flex-col justify-between group h-full ${
                    item.isPopular
                      ? 'border-[#B88F4D] relative'
                      : 'border-[#B88F4D]/10 hover:border-[#B88F4D]/30'
                  }`}
                >
                  {item.isPopular && (
                    <span className="inline-block self-start mb-3 bg-[#B88F4D] shadow-sm text-white text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">
                      Exclusivité
                    </span>
                  )}


                  <div className="space-y-3">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1 md:gap-3">
                      <h4 className="font-serif text-base md:text-lg font-bold text-charcoal group-hover:text-champagne transition-colors min-w-0">
                        {item.name}
                      </h4>
                      {item.price === undefined ? (
                        <div className="flex flex-col items-start md:items-end font-serif font-bold text-[#B88F4D] shrink-0 leading-tight">
                          <span className="text-sm">À consulter au salon</span>
                          <span className="text-xs text-[#B88F4D]/80">ou par téléphone</span>
                        </div>
                      ) : (
                        <span className="font-serif text-lg font-bold text-[#B88F4D] shrink-0 whitespace-nowrap">
                          <PrixVitrine nom={item.name} prix={item.price} />
                          {item.priceNote && (
                            <sup className="ml-0.5 text-[10px] md:text-xs">*</sup>
                          )}
                        </span>
                      )}
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

                    {item.priceNote && (
                      <p className="text-[10px] md:text-xs text-[#A17E60] italic leading-relaxed border-l-2 border-[#B88F4D]/30 pl-3">
                        * {item.priceNote}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-[#EFE7D2] flex items-center justify-between text-xs">
                    <span className="text-secondary-gray flex items-center gap-1">
                      <Heart className="h-3 w-3 text-[#A3A485]" /> Protections Olaplex incluses
                    </span>
                    <button
                      onClick={() => {
                        window.location.assign('/reservation');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-[#B88F4D] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Réserver</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Secondary Bottom Call-to-action */}
      <section className="bg-white py-16 border-t border-[#B88F4D]/10 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.2em] text-[#A3A485] font-bold">Un diagnostic gratuit ?</span>
          <h3 className="font-serif text-2xl md:text-3xl text-charcoal">Sublimez Votre Couleur Naturelle</h3>
          <p className="text-secondary-gray text-xs md:text-sm leading-relaxed">
            Vous hésitez entre un Ombré Hair doré et une patine polaire ? Nos stylistes vous reçoivent pour un diagnostic morpho-capillaire gratuit de 15 minutes. Profitez de conseils d'experts au Pré-Saint-Gervais.
          </p>
          <div className="pt-4">
            <motion.button
              onClick={() => {
                window.location.assign('/reservation');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-primary flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="h-4 w-4" />
              Réserver mon créneau de prestige
            </motion.button>
          </div>
        </div>
      </section>

    </div>
  );
}
