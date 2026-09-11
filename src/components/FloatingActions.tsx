import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Phone, Calendar, Instagram } from 'lucide-react';
import { INSTITUT_INFO } from '../data';

export default function FloatingActions() {
  const [isReservationView, setIsReservationView] = useState(false);
  const [isRitualSectionVisible, setIsRitualSectionVisible] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setIsReservationView(window.location.hash.includes('/reservation'));
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let rafId: number | null = null;

    const attach = () => {
      const target = document.getElementById('ritual-advisor-section');
      if (!target) {
        rafId = window.requestAnimationFrame(attach);
        return;
      }
      observer = new IntersectionObserver(
        ([entry]) => setIsRitualSectionVisible(entry.isIntersecting),
        { threshold: 0, rootMargin: '-10% 0px -10% 0px' }
      );
      observer.observe(target);
    };

    attach();

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  }, []);

  const hideOnDesktop = isRitualSectionVisible;


  return (
    <div
      id="floating-actions"
      className={`fixed z-40 flex flex-col items-center gap-2.5 transition-opacity duration-300 ${
        hideOnDesktop ? 'sm:opacity-0 sm:pointer-events-none' : 'opacity-100'
      }`}
      style={{
        bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))',
        right: 'calc(1rem + env(safe-area-inset-right, 0px))'
      }}
    >

      {/* Floating Instagram Action - desktop/tablet only to avoid covering card prices on mobile */}
      <motion.a
        href={INSTITUT_INFO.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex h-12 w-12 items-center justify-center rounded-[24px] bg-[#2E2E2E] text-[#B88F4D] shadow-xl hover:bg-black border border-[#B88F4D]/20 transition-all duration-300"
        aria-label="Voir notre Instagram"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        title="Nous suivre sur Instagram"
      >
        <Instagram className="h-5 w-5" />
      </motion.a>


      {/* Floating Phone Action - desktop/tablet only */}
      <motion.a
        href={`tel:${INSTITUT_INFO.phoneFormatted}`}
        className="hidden sm:flex h-12 w-12 items-center justify-center rounded-[24px] bg-[#B88F4D] text-white shadow-xl hover:bg-[#A17E60] border border-[#B88F4D]/40 transition-all duration-300"
        aria-label="Appeler l'Atelier"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        title={`Nous appeler au ${INSTITUT_INFO.phone}`}
      >
        <Phone className="h-5 w-5" />
      </motion.a>


      {/* Floating Booking Action - desktop/tablet only to avoid covering card prices on mobile */}
      {!isReservationView && (
        <motion.button
          onClick={() => {
            window.location.assign('/reservation');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="hidden sm:flex items-center gap-2 rounded-[24px] bg-[#B88F4D] tracking-wider px-4.5 py-3.5 text-[10px] md:text-xs font-semibold uppercase text-white shadow-xl hover:bg-[#A17E60] transition-all duration-300 cursor-pointer border border-[#B88F4D]/10"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <Calendar className="h-4 w-4 shrink-0" />
          <span>Réserver</span>
        </motion.button>
      )}
    </div>
  );
}
