export type Page =
  | 'accueil'
  | 'coiffure'
  | 'head-spa'
  | 'soins-visage'
  | 'beaute-regard'
  | 'ipl'
  | 'detatouage'
  | 'blanchiment-dentaire'
  | 'soins-corps-algues'
  | 'reservation'
  | 'mentions-legales'
  | 'confidentialite';


export interface ServiceItem {
  name: string;
  price?: string | number;
  duration?: string;
  description?: string;
  isPopular?: boolean;
  priceNote?: string;
}

export interface ServiceGroup {
  categoryTitle: string;
  description?: string;
  items: ServiceItem[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ReviewItem {
  author: string;
  rating: number;
  date: string;
  text: string;
  avatar?: string;
}

export interface BenefitItem {
  title: string;
  description: string;
}
