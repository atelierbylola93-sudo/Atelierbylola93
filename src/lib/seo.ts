import type { Page } from '../types';

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://latelierbylola.fr').replace(/\/$/, '');
export function pagePath(page: Page) { return page === 'accueil' ? '/' as const : `/${page}` as `/${Exclude<Page, 'accueil'>}`; }

export const PAGE_SEO: Record<Page, { title: string; description: string }> = {
  accueil: { title: "L’Atelier by Lola | Institut de beauté au Pré-Saint-Gervais", description: "Découvrez L’Atelier by Lola au Pré-Saint-Gervais : Head Spa japonais, coiffure, soins du visage et du corps. Prestations, tarifs et réservation en ligne." },
  coiffure: { title: 'Coiffure et lissages au Pré-Saint-Gervais', description: 'Coupes, brushing, coloration et lissages chez L’Atelier by Lola au Pré-Saint-Gervais. Découvrez les prestations capillaires, leurs tarifs et réservez.' },
  'head-spa': { title: 'Head Spa japonais au Pré-Saint-Gervais', description: 'Découvrez nos rituels Head Spa japonais : Découverte, Signature et Premium. Un moment de détente du cuir chevelu au Pré-Saint-Gervais, près de Paris.' },
  'soins-visage': { title: 'Soins du visage au Pré-Saint-Gervais', description: 'Soins du visage bio, hydratants, signature et aux algues chez L’Atelier by Lola. Consultez les tarifs et prenez rendez-vous au Pré-Saint-Gervais.' },
  'beaute-regard': { title: 'Beauté du regard et Browlift au Pré-Saint-Gervais', description: 'Restructuration des sourcils, Browlift et rehaussement de cils au Pré-Saint-Gervais. Découvrez les prestations regard de L’Atelier by Lola.' },
  ipl: { title: 'Épilation IPL au Pré-Saint-Gervais', description: 'Découvrez l’épilation à la lumière pulsée IPL chez L’Atelier by Lola : zones, tarifs et informations avant votre rendez-vous au Pré-Saint-Gervais.' },
  detatouage: { title: 'Détatouage au Pré-Saint-Gervais', description: 'Informations sur les séances de détatouage chez L’Atelier by Lola au Pré-Saint-Gervais. Découvrez les modalités et contactez l’institut.' },
  'blanchiment-dentaire': { title: 'Blanchiment dentaire au Pré-Saint-Gervais', description: 'Découvrez la prestation de blanchiment dentaire de L’Atelier by Lola au Pré-Saint-Gervais, les tarifs et les informations avant de réserver.' },
  'soins-corps-algues': { title: 'Soins du corps aux algues au Pré-Saint-Gervais', description: 'Offrez-vous un soin du corps aux algues chez L’Atelier by Lola au Pré-Saint-Gervais. Découvrez les prestations, leurs durées et leurs tarifs.' },
  reservation: { title: 'Réserver un rendez-vous', description: 'Choisissez vos prestations et un créneau disponible chez L’Atelier by Lola au Pré-Saint-Gervais. Réservation en ligne, sans paiement bancaire sur le site.' },
  'mentions-legales': { title: 'Mentions légales', description: 'Informations sur l’éditeur et l’hébergement du site de L’Atelier by Lola au Pré-Saint-Gervais.' },
  confidentialite: { title: 'Politique de confidentialité', description: 'Informations sur les données personnelles et la gestion des réservations chez L’Atelier by Lola.' },
};

export function pageHead(page: Page) {
  const { title: label, description } = PAGE_SEO[page];
  const title = page === 'accueil' ? label : `${label} | L’Atelier by Lola`;
  const url = SITE_URL + pagePath(page);
  return {
    meta: [
      { title }, { name: 'description', content: description },
      { name: 'robots', content: 'index, follow, max-image-preview:large' },
      { property: 'og:title', content: title }, { property: 'og:description', content: description },
      { property: 'og:url', content: url }, { property: 'og:locale', content: 'fr_FR' },
      { name: 'twitter:title', content: title }, { name: 'twitter:description', content: description },
    ],
    links: [{ rel: 'canonical', href: url }],
  };
}
