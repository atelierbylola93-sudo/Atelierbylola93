import { pagePath } from '../lib/seo';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Calendar, Star } from 'lucide-react';
import { NAV_ITEMS, INSTITUT_INFO } from '../data';
import { Page } from '../types';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (page: Page) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-12 ${
        isScrolled
          ? 'py-3.5 glass-header shadow-sm bg-[#EFE7D2]/95 backdrop-blur-md border-b border-[#B88F4D]/15'
          : 'py-5 bg-[#EFE7D2]/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO AREA */}
        <a href={pagePath('accueil')}
          
          className="flex flex-col items-center focus:outline-none cursor-pointer group select-none"
        >
          <span className={`font-serif text-xl md:text-2xl font-bold tracking-[0.2em] transition-colors duration-300 text-charcoal group-hover:text-[#B88F4D]`}>
            L'ATELIER
          </span>
          <span className={`text-[10px] tracking-[0.3em] font-semibold uppercase mt-[-4px] transition-colors duration-300 text-[#B88F4D] group-hover:text-[#A17E60]`}>
            by lola
          </span>
        </a>

        {/* DESKTOP NAV */}
        <nav className="hidden lg:flex items-center gap-7 flex-nowrap">
          <ul className="flex items-center gap-5 xl:gap-6 flex-nowrap whitespace-nowrap">
            {NAV_ITEMS.slice(0, 5).map((item) => (
              <li key={item.page}>
                <a href={pagePath(item.page)}
                  
                  className={`relative py-1 text-[11px] xl:text-xs uppercase tracking-[0.16em] xl:tracking-[0.2em] font-medium whitespace-nowrap transition-colors duration-300 cursor-pointer ${
                    currentPage === item.page
                      ? 'text-[#B88F4D]'
                      : 'text-charcoal hover:text-[#B88F4D]'
                  }`}
                >
                  {item.name}
                  {currentPage === item.page && (
                    <motion.div
                      layoutId="activeDot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[#B88F4D]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              </li>
            ))}
            
            {/* SERVICES DROPDOWN SELECTOR FOR LUX NAVIGATION */}
            <li className="relative group">
              <button
                className={`py-1 text-[11px] xl:text-xs uppercase tracking-[0.16em] xl:tracking-[0.2em] font-medium whitespace-nowrap transition-colors duration-300 flex items-center gap-1 cursor-pointer text-charcoal hover:text-[#B88F4D]`}
              >
                Autres Prestations
                <span className="text-[11px] text-[#B88F4D]">▼</span>
              </button>
              
              <div className="absolute top-full right-0 mt-2 w-72 glass-premium border border-[#B88F4D]/25 rounded-[24px] p-4 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-focus-within:opacity-100 group-hover:scale-100 group-focus-within:scale-100 group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-all duration-300 shadow-xl bg-white/95 backdrop-blur-md">
                <div className="grid gap-2">
                  <span className="text-[10px] text-secondary-gray uppercase tracking-widest block border-b border-[#B88F4D]/10 pb-1.5 mb-1.5">Esthétique & Blanchiment</span>
                  {NAV_ITEMS.slice(5).map((item) => (
                    <a
                      key={item.page}
                      href={pagePath(item.page)}
                      className={`text-left px-3 py-2 text-xs rounded-[12px] transition-all duration-200 cursor-pointer flex justify-between items-center ${
                        currentPage === item.page
                          ? 'bg-[#B88F4D]/15 text-[#B88F4D] font-semibold'
                          : 'hover:bg-[#EFE7D2] text-charcoal'
                      }`}
                    >
                      <span>{item.name}</span>
                      {item.page === 'ipl' && <span className="bg-[#A3A485]/15 text-[#A3A485] text-[11px] px-1.5 py-0.5 rounded-full font-bold">IPL</span>}
                    </a>
                  ))}
                </div>
              </div>
            </li>
          </ul>

          {/* CTA RESERVATION */}
          <motion.a href={pagePath('reservation')}
            
            className="ml-4 btn-primary flex items-center gap-2 !py-3 !px-6 !text-[11px] cursor-pointer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Calendar className="h-3.5 w-3.5" />
            Prendre RDV
          </motion.a>
        </nav>
 
        {/* MOBILE BURGER TRIGGER */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 transition-colors focus:outline-none cursor-pointer text-charcoal hover:text-[#B88F4D]"
            aria-label="Menu principal" aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE COLLAPSIBLE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-[#EFE7D2] border-b border-[#B88F4D]/20 shadow-xl overflow-hidden"
          >
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              <span className="text-[10px] text-secondary-gray uppercase tracking-[0.2em] block mb-4 border-b border-[#B88F4D]/10 pb-2">Menu de l'Atelier</span>
              <ul className="flex flex-col gap-4">
                {NAV_ITEMS.map((item, idx) => (
                  <motion.li
                    key={item.page}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <a href={pagePath(item.page)}
                      
                      className={`w-full text-left py-2.5 px-3 rounded-[16px] text-sm font-medium transition-all duration-300 flex items-center justify-between cursor-pointer ${
                        currentPage === item.page
                          ? 'bg-[#B88F4D] text-white shadow-md'
                          : 'text-charcoal hover:bg-white hover:text-champagne hover:shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>{item.name}</span>
                        <span className={`text-[10px] ${currentPage === item.page ? 'text-white/80' : 'text-secondary-gray'}`}>{item.description}</span>
                      </div>
                      {item.page === 'head-spa' && (
                        <span className="flex items-center gap-1 bg-[#A3A485] text-white text-[11px] px-2 py-0.5 rounded-full uppercase font-bold">
                          <Star className="h-2 w-2 fill-white" /> Secret
                        </span>
                      )}
                    </a>
                  </motion.li>
                ))}
              </ul>
              
              <div className="mt-8 pt-6 border-t border-[#B88F4D]/10 flex flex-col gap-3">
                <a href={pagePath('reservation')}
                  
                  className="w-full flex items-center justify-center gap-2 rounded-[24px] bg-[#B88F4D] tracking-[0.1em] py-4 text-xs font-semibold uppercase text-white shadow-md cursor-pointer animate-pulse"
                >
                  <Calendar className="h-4 w-4" />
                  Prendre Rendez-vous
                </a>
                <div className="text-center text-xs text-secondary-gray">
                  📍 {INSTITUT_INFO.address}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
