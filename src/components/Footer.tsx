import { pagePath } from '../lib/seo';
import { INSTITUT_INFO, NAV_ITEMS } from '../data';
import { Page } from '../types';
import SchemaLocalBusiness from './SchemaLocalBusiness';
import { MapPin, Phone, Clock, Instagram, Send, Star } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleLinkClick = (page: Page) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#3A2F26] text-white pt-20 pb-8 mt-24 border-t-2 border-[#B88F4D]/25 relative overflow-hidden">
      <SchemaLocalBusiness />
      
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-[#B88F4D]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[#A3A485]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16 border-b border-white/10">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <div className="flex items-baseline gap-1 focus:outline-none select-none">
              <span className="font-serif text-2xl font-light tracking-wider text-white">
                L'ATELIER
              </span>
              <span className="font-signature text-3xl text-[#B88F4D] italic ml-1 select-none">
                by Lola
              </span>
            </div>
            
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
              Maison de prestige dédiée à la beauté d'exception et au ressourcement sensoriel au Pré-Saint-Gervais. Head Spa japonais, soins du visage signature, esthétique avancée et techniques capillaires premium.
            </p>

            <div className="space-y-3.5 text-xs md:text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#B88F4D] shrink-0 mt-0.5" />
                <span>{INSTITUT_INFO.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#B88F4D] shrink-0" />
                <a href={`tel:${INSTITUT_INFO.phoneFormatted}`} className="hover:text-[#B88F4D] transition-colors">{INSTITUT_INFO.phone}</a>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-[#B88F4D] shrink-0 mt-0.5" />
                <span>{INSTITUT_INFO.hours}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Prestations */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-medium text-white tracking-wider border-l-2 border-[#B88F4D] pl-3">Prestations</h4>
            <ul className="space-y-2.5 text-xs md:text-sm text-gray-400">
              {NAV_ITEMS.slice(1).map((item) => (
                <li key={`footer-nav-${item.page}`}>
                  <a href={pagePath(item.page)}
                    
                    className="hover:text-[#B88F4D] transition-colors duration-200 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Local SEO Ready Blog & Social */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-serif text-lg font-medium text-white tracking-wider border-l-2 border-[#B88F4D] pl-3">Espace Conseils (Blog)</h4>
              <ul className="space-y-2.5 text-xs text-gray-400">
                <li className="p-2.5 bg-white/5 rounded-lg border border-white/5 hover:border-[#B88F4D]/20 transition-all duration-300">
                  <span className="text-[10px] uppercase font-bold text-[#B88F4D] block">Head Spa Japonais</span>
                  <a href="/head-spa" onClick={(e) => { e.preventDefault(); handleLinkClick('head-spa'); }} className="hover:text-white transition-colors font-medium">Découvrir le Head Spa</a>
                </li>
                <li className="p-2.5 bg-white/5 rounded-lg border border-white/5 hover:border-[#B88F4D]/20 transition-all duration-300">
                  <span className="text-[10px] uppercase font-bold text-[#A3A485] block">Soins du visage</span>
                  <a href="/soins-visage" onClick={(e) => { e.preventDefault(); handleLinkClick('soins-visage'); }} className="hover:text-white transition-colors font-medium">Découvrir nos soins visage</a>
                </li>
              </ul>
            </div>

            {/* Social Badges */}
            <div className="space-y-3 pt-2">
              <h5 className="text-xs uppercase font-bold text-gray-400 tracking-wider">Suivre nos transformations</h5>
              <div className="flex gap-3">
                <a href={INSTITUT_INFO.instagramUrl} target="_blank" rel="noopener noreferrer" className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:bg-[#B88F4D] hover:text-white transition-all duration-300" title="Instagram">
                  <Instagram className="h-4 w-4" />
                </a>
                <a href={INSTITUT_INFO.tiktokUrl} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:bg-[#A3A485] hover:text-white transition-all duration-300" title="TikTok">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V9.01a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.44Z" />
                  </svg>
                </a>
                <a href={INSTITUT_INFO.snapchatUrl} target="_blank" rel="noopener noreferrer" aria-label="Snapchat" className="h-9 w-9 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:bg-yellow-500 hover:text-white transition-all duration-300" title="Snapchat">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <path d="M12 2c3.14 0 5.36 2.15 5.36 5.3 0 1.42-.09 3.14-.32 3.83.36.2.86.2 1.35 0 .76-.31 1.09.66.44 1.05-.44.27-1.14.42-1.62.55-.35.09-.36.17-.24.53.22.62 1.36 2.05 3.44 2.4.34.06.6.34.5.72-.19.7-1.9 1.02-2.86 1.16-.09.31-.13.68-.29.94-.09.15-.29.14-.5.11-.5-.08-1.06-.22-1.94-.07-.55.09-1.06.42-1.6.79-.83.55-1.77 1.18-3.18 1.18s-2.31-.62-3.13-1.17c-.55-.37-1.06-.71-1.64-.8-.86-.13-1.42 0-1.94.08-.19.03-.4.05-.5-.11-.16-.26-.2-.63-.29-.94-.96-.14-2.67-.46-2.86-1.16-.1-.38.16-.66.5-.72 2.08-.35 3.22-1.78 3.44-2.4.12-.36.11-.44-.24-.53-.48-.13-1.18-.28-1.62-.55-.65-.39-.32-1.36.44-1.05.49.2.99.2 1.35 0-.23-.69-.32-2.41-.32-3.83C6.64 4.15 8.86 2 12 2Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Column 4: Google Maps Frame & Booking */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-medium text-white tracking-wider border-l-2 border-[#B88F4D] pl-3">Accès & Plan</h4>
            
            {/* Embedded Google Map */}
            <div className="w-full h-44 rounded-[24px] overflow-hidden border-2 border-[#B88F4D]/20 shadow-md group relative">
              <iframe
                title="L'Atelier by Lola Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.0886117395015!2d2.40263!3d48.88326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66dc38bd2fc25%3A0xe67db5bb6587c699!2s10%20Rue%20du%2014%20Juillet%2C%2093310%20Le%20Pr%C3%A9-Saint-Gervais!5e0!3m2!1sfr!2sfr!4v1718300000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="filter invert contrast-110 opacity-80"
              />
              <div className="absolute inset-0 bg-transparent pointer-events-none group-hover:bg-black/10 transition-colors" />
            </div>

            <a
              href="https://maps.google.com/?q=10+Rue+du+14+Juillet,+93310+Le+Pr%C3%A9-Saint-Gervais"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#B88F4D] hover:underline flex items-center gap-1 font-medium justify-center md:justify-start"
            >
              <span>Calculer mon itinéraire Google Maps ↗</span>
            </a>
          </div>

        </div>

        {/* Footer Bottom Credentials */}
        <div className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 L'Atelier by Lola. Tous droits réservés.</p>
          <div className="flex gap-4">
            <a href={pagePath('mentions-legales')}  className="hover:text-white transition-colors cursor-pointer">Mentions Légales</a>
            <span className="text-gray-700">•</span>
            <a href={pagePath('confidentialite')}  className="hover:text-white transition-colors cursor-pointer">RGPD & Confidentialité</a>
            <span className="text-gray-700">•</span>
            <a href={pagePath('accueil')}  className="hover:text-white transition-colors cursor-pointer">Accueil</a>
          </div>
          <p className="flex items-center gap-1 text-[10px] text-gray-600">
            Design Inspiré des Spas de Luxe <Star className="h-3 w-3 text-champagne fill-champagne" /> Paris
          </p>
        </div>
      </div>
    </footer>
  );
}
