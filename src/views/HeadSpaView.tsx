import { motion } from 'motion/react';
import { Calendar, CheckCircle2, Star, ShieldCheck, Clock, Leaf, AlertTriangle, Info } from 'lucide-react';
import { HEAD_SPA_DATA } from '../data';
import FaqSection from '../components/FaqSection';
import LocalSeoSection from '../components/LocalSeoSection';
import headspaHeroAsset from '../assets/headspa-hero.png';

export default function HeadSpaView() {
  return (
    <div id="head-spa-view" className="w-full pt-28 pb-10">

      {/* Immersive Top Hero */}
      <section className="relative h-[360px] md:h-[520px] flex items-center justify-center bg-[#EFE7D2] overflow-hidden rounded-b-[24px]">
        <img
          src={headspaHeroAsset}
          alt="Head Spa L'Atelier by Lola Le Pré-Saint-Gervais"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#EFE7D2]/90 via-[#EFE7D2]/50 to-[#EFE7D2]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#EFE7D2] via-transparent to-[#EFE7D2]/20" />

        <div className="relative z-10 text-left px-4 md:px-8 max-w-7xl w-full">
          <div className="max-w-2xl space-y-5">
            <span className="inline-block text-[10px] md:text-xs uppercase tracking-[0.3em] text-white font-bold bg-[#B88F4D] px-4 py-1.5 rounded-full shadow-sm">
              Soin Signature National Japonais
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-[#2A2621] font-light tracking-wide leading-tight drop-shadow-sm">
              Head Spa<br className="hidden md:block" /> Le Pré-Saint-Gervais
            </h1>
            <p className="text-[#2A2621]/90 text-sm md:text-lg italic font-serif max-w-xl drop-shadow-sm">
              Le rituel d'hydro-thérapie et d'aromathérapie suprême pour votre esprit et votre chevelure
            </p>
          </div>
        </div>
      </section>

      {/* Main Core Detail Panel */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Side: Summary */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-[0.2em] text-[#B88F4D] font-bold">L'Expérience Authentique</span>
            <h2 className="font-serif text-2xl md:text-4xl text-charcoal font-medium">
              {HEAD_SPA_DATA.subtitle}
            </h2>
            <p className="text-secondary-gray text-xs md:text-base leading-relaxed">
              {HEAD_SPA_DATA.description}
            </p>
          </div>

        </div>

        {/* Right Side: CTA Box */}
        <div className="lg:col-span-5 space-y-8">
          {/* Quick CTA Box */}
          <div className="bg-white border border-[#B88F4D]/20 p-8 rounded-[24px] shadow-sm text-center space-y-6">
            <p className="text-[#B88F4D] text-xs font-semibold tracking-widest uppercase">
              Expérience Extrêmement Demandée
            </p>
            <p className="text-secondary-gray text-xs leading-relaxed">
              En raison de la haute technicité et des massages Shiatsu prolongés de notre dôme thermal, les places pour le Head Spa sont limitées. Réservation recommandée 72 heures à l'avance.
            </p>
            
            <motion.button
              onClick={() => {
                window.location.assign('/reservation');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full btn-primary flex items-center justify-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Calendar className="h-4 w-4" />
              Réserver ma fontaine d'eau
            </motion.button>
          </div>
        </div>
      </section>

      {/* Pricing Formulas Section */}
      <section className="bg-[#EFE7D2]/40 py-16 md:py-24 border-y border-[#B88F4D]/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-[0.2em] text-[#B88F4D] font-bold">Nos Formules</span>
            <h2 className="font-serif text-2xl md:text-4xl text-charcoal font-medium">
              Choisissez votre parenthèse de bien-être
            </h2>
            <p className="text-secondary-gray text-sm md:text-base leading-relaxed">
              Trois rituels pensés pour chaque envie : une première découverte, une expérience signature ou un soin premium entièrement personnalisé.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HEAD_SPA_DATA.formulas.map((formula, idx) => (
              <motion.div
                key={formula.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative bg-white rounded-[24px] p-6 md:p-8 border transition-shadow duration-300 flex flex-col ${
                  formula.isPopular
                    ? 'border-[#B88F4D] shadow-[0_8px_30px_-8px_rgba(184,143,77,0.25)] ring-1 ring-[#B88F4D]/20'
                    : 'border-[#B88F4D]/10 premium-shadow hover:shadow-lg'
                }`}
              >
                {formula.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 bg-[#B88F4D] text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-sm">
                      <Star className="h-3 w-3 fill-current" />
                      Le plus demandé
                    </span>
                  </div>
                )}

                <div className="space-y-3 flex-1">
                  <div className="flex justify-between items-baseline gap-4">
                    <h3 className="font-serif text-lg md:text-xl text-charcoal font-semibold">
                      {formula.name}
                    </h3>
                    <span className="font-serif text-base font-medium text-[#A17E60] shrink-0 whitespace-nowrap">
                      {formula.price} €
                    </span>
                  </div>

                  {formula.duration && (
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#B88F4D] bg-[#EFE7D2] border border-[#B88F4D]/30 px-3 py-1.5 rounded-full tracking-wide">
                      <Clock className="h-3.5 w-3.5" />
                      {formula.duration}
                    </span>
                  )}

                  <p className="text-secondary-gray text-xs md:text-sm leading-relaxed">
                    {formula.description}
                  </p>
                </div>

                <motion.button
                  onClick={() => {
                    window.location.assign('/reservation');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`mt-6 w-full py-3 px-4 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    formula.isPopular
                      ? 'bg-[#B88F4D] text-white hover:bg-[#A17E60]'
                      : 'bg-[#EFE7D2] text-charcoal hover:bg-[#DDCCB2]'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Calendar className="h-4 w-4" />
                  Réserver
                </motion.button>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-secondary-gray text-xs md:text-sm">
            Séchage naturel inclus dans toutes nos formules. Possibilité d'ajouter un brushing ou un séchage brushing en supplément sur place.
          </p>
        </div>
      </section>

      {/* Scientific Benefits Section — moved lower */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="bg-[#EFE7D2] text-charcoal p-8 md:p-12 rounded-[24px] shadow-sm border border-[#B88F4D]/30 border-t-4 border-t-[#B88F4D] space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-[#B88F4D]/8 filter blur-xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative">
            <div className="lg:col-span-4 space-y-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#B88F4D] font-bold block">Clinique & Bien-être</span>
              <h3 className="font-serif text-2xl md:text-3xl text-charcoal font-medium">Bienfaits Scientifiques</h3>
              <p className="text-secondary-gray text-sm leading-relaxed">
                Au-delà du moment de détente, le Head Spa agit sur l'équilibre du cuir chevelu, la qualité du sommeil et la gestion du stress grâce à des protocoles validés.
              </p>
            </div>
            
            <div className="lg:col-span-8">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                {HEAD_SPA_DATA.benefits.map((benefit, idx) => (
                  <li key={`benefit-${idx}`} className="flex items-start gap-3.5 text-sm text-charcoal/80">
                    <CheckCircle2 className="h-5 w-5 text-[#B88F4D] shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-4 bg-white/70 rounded-lg border border-[#B88F4D]/15 text-sm text-charcoal/70 space-y-2 relative">
                <div className="flex items-center gap-2 text-[#A17E60] font-bold">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Régulation & Pureté</span>
                </div>
                <p>Analysé attentivement, nous choisissons uniquement des produits hypoallergéniques d'exception aux essences d'Argan bio, menthe japonaise et thym sauvage.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bons réflexes & Contre-indications */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16 md:pb-24">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.2em] text-[#B88F4D] font-bold">Votre séance en toute sérénité</span>
          <h2 className="font-serif text-2xl md:text-4xl text-charcoal font-medium">
            Bons réflexes & Contre-indications
          </h2>
          <p className="text-secondary-gray text-sm md:text-base leading-relaxed">
            Quelques conseils simples pour préparer votre rituel Head Spa et identifier les rares situations où il vaut mieux reporter la séance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bons réflexes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#EFE7D2]/50 border border-[#A3A485]/25 rounded-[24px] p-6 md:p-8 space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#A3A485]/15 flex items-center justify-center">
                <Leaf className="h-5 w-5 text-[#A3A485]" />
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-charcoal font-medium">Bons réflexes</h3>
            </div>

            <ul className="space-y-4">
              {[
                'Cheveux au naturel : Évitez de saturer vos cheveux de laques, gels, huiles ou sprays dans les 12 à 24 heures précédant le soin pour ne pas bloquer l\'action des produits.',
                'Ne pas se laver les cheveux juste avant : Venez de préférence avec des cheveux non lavés depuis un ou deux jours pour éviter une surstimulation du cuir chevelu.',
                'Éviter les excitants : Limitez le café ou les boissons énergisantes pour favoriser la détente nerveuse.',
                'Informer le praticien : Signalez vos allergies, votre sensibilité cutanée, vos problèmes de migraines ou si vos cheveux ont subi des traitements chimiques récents.',
              ].map((item, idx) => (
                <li key={`bon-${idx}`} className="flex items-start gap-3 text-sm text-charcoal/80">
                  <CheckCircle2 className="h-5 w-5 text-[#A3A485] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contre-indications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-[#A17E60]/20 rounded-[24px] p-6 md:p-8 space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#A17E60]/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-[#A17E60]" />
              </div>
              <h3 className="font-serif text-xl md:text-2xl text-charcoal font-medium">Contre-indications</h3>
            </div>
            <p className="text-secondary-gray text-sm">
              Quand reporter la séance :
            </p>

            <ul className="space-y-4">
              {[
                'Affections du cuir chevelu : Plaies ouvertes, irritations sévères, croûtes récentes, mycoses, poux ou lentes.',
                'État inflammatoire ou infectieux : Fièvre, forte fatigue liée à une infection en cours.',
                'Grossesse : Les huiles essentielles sont à écarter par précaution, et un avis médical est requis en cas de grossesse à risque.',
              ].map((item, idx) => (
                <li key={`contre-${idx}`} className="flex items-start gap-3 text-sm text-charcoal/80">
                  <Info className="h-5 w-5 text-[#A17E60] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-2 p-4 bg-[#EFE7D2]/60 rounded-xl border border-[#B88F4D]/15 text-sm text-charcoal/80">
              <span className="font-semibold text-[#B88F4D]">Conseil personnalisé — </span>
              Si vous le souhaitez, dites-moi si vous avez une condition médicale particulière ou un type de cuir chevelu spécifique (gras, sec, sensible) pour que je vous donne des conseils plus personnalisés.
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEO Local — Accès, adresse & horaires */}
      <LocalSeoSection
        serviceName="Head Spa Japonais au Pré-Saint-Gervais"
        serviceDescription="Rituel de soin capillaire japonais premium : diagnostic du cuir chevelu, massage crânien thérapeutique et soins purifiants au cœur du Pré-Saint-Gervais, proche Pantin, Les Lilas et Paris 19e."
        url="https://latelierbylola.fr/head-spa"
        accent="#B88F4D"
      />

      {/* SEO Dedicated Accordion FAQs */}
      <section className="bg-white py-16 border-t border-[#B88F4D]/10">
        <FaqSection
          faqItems={HEAD_SPA_DATA.faq}
          title="FAQ Head Spa • Le Pré-Saint-Gervais"
          subtitle="Comprendre le pouvoir thérapeutique du cuir chevelu en quelques réponses clés."
        />
      </section>

    </div>
  );
}
