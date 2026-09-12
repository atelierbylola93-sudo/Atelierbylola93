import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { pagePath } from './lib/seo';
import { motion, AnimatePresence } from 'motion/react';
import { Page } from './types';

// Import Layout Components
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import GridOverlay from './components/GridOverlay';

// Import Views
import HomeView from './views/HomeView';
import CoiffureView from './views/CoiffureView';
import HeadSpaView from './views/HeadSpaView';
import SoinsVisageView from './views/SoinsVisageView';
import BeauteRegardView from './views/BeauteRegardView';
import IplView from './views/IplView';
import DetatouageView from './views/DetatouageView';
import BlanchimentDentaireView from './views/BlanchimentDentaireView';
import SoinsCorpsAlguesView from './views/SoinsCorpsAlguesView';
import ReservationView from './views/ReservationView';
import MentionsLegalesView from './views/MentionsLegalesView';
import ConfidentialiteView from './views/ConfidentialiteView';

export default function App({ currentPage = 'accueil' }: { currentPage?: Page }) {
  const navigate = useNavigate();
  useEffect(() => {
    const legacy = window.location.hash.slice(2) as Page;
    const pages = ['accueil', 'coiffure', 'head-spa', 'soins-visage', 'beaute-regard', 'ipl', 'detatouage', 'blanchiment-dentaire', 'soins-corps-algues', 'reservation', 'mentions-legales', 'confidentialite'];
    if (window.location.hash.startsWith('#/') && pages.includes(legacy)) {
      void navigate({ to: pagePath(legacy), replace: true });
    }
  }, [navigate]);
  const handleNavigate = (page: Page) => { void navigate({ to: pagePath(page) }); };

  // Helper to dynamically render currently selected premium view
  const renderView = () => {
    switch (currentPage) {
      case 'accueil':
        return <HomeView onNavigate={handleNavigate} />;
      case 'coiffure':
        return <CoiffureView />;
      case 'head-spa':
        return <HeadSpaView />;
      case 'soins-visage':
        return <SoinsVisageView />;
      case 'beaute-regard':
        return <BeauteRegardView />;
      case 'ipl':
        return <IplView />;
      case 'detatouage':
        return <DetatouageView />;
      case 'blanchiment-dentaire':
        return <BlanchimentDentaireView />;
      case 'soins-corps-algues':
        return <SoinsCorpsAlguesView />;
      case 'reservation':
        return <ReservationView />;
      case 'mentions-legales':
        return <MentionsLegalesView />;
      case 'confidentialite':
        return <ConfidentialiteView />;
      default:
        return <HomeView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-beige-bg flex flex-col justify-between selection:bg-[#B88F4D]/20 selection:text-[#B88F4D]">
      <div>
        {/* Header Navigation Grid */}
        <Header currentPage={currentPage} onNavigate={handleNavigate} />

        {/* Animated Main Content Stage */}
        <main id="main-content" className="relative overflow-x-clip">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Floating CTA Shortcuts (Phone, Booking, Scroll-to-Top) */}
      <FloatingActions />

      {/* Premium Footer with Embed Map, structured hours and social handles */}
      <Footer onNavigate={handleNavigate} />

      {/* Swiss Müller-Brockmann & Vignelli Interactive Grid Alignment System */}
      <GridOverlay />
    </div>
  );
}
