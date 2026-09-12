/**
 * Catalogue des prestations, tel qu'il vit en base.
 *
 * Les tarifs étaient écrits dans le code : les changer demandait une
 * intervention technique. Ils sont désormais gérés depuis l'espace patron.
 *
 * Ce module ne fait que décrire et calculer. Il est partagé par le serveur
 * (qui facture) et le navigateur (qui affiche) pour qu'un prix montré soit
 * exactement le prix appliqué.
 */
import { parisNow } from './paris-time';

export interface FinitionBase {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface PrestationBase {
  id: string;
  name: string;
  category: string;
  description: string;
  /** Tarif de référence, hors promotion. */
  price: number;
  duration_min: number;
  duration_label: string;
  price_on_quote: boolean;
  price_note: string | null;
  promo_price: number | null;
  promo_start: string | null;
  promo_end: string | null;
  upsells: FinitionBase[];
}

export interface PrixEffectif {
  /** Ce qui sera réellement facturé. */
  prix: number;
  /** Vrai lorsqu'une promotion court aujourd'hui. */
  enPromo: boolean;
  /** Tarif de référence à barrer à l'écran, uniquement en promotion. */
  prixBarre: number | null;
  /** Dernier jour de l'offre, pour l'annoncer à la cliente. */
  finPromo: string | null;
}

/**
 * Prix appliqué aujourd'hui pour une prestation.
 *
 * Une promotion court du premier au dernier jour inclus. La date de
 * comparaison est celle de Paris : une offre qui finit le 31 doit rester
 * valable toute la journée du 31 pour une cliente française, quelle que soit
 * la zone dans laquelle tourne le serveur.
 */
export function prixEffectif(
  p: Pick<PrestationBase, 'price' | 'promo_price' | 'promo_start' | 'promo_end'>,
  aujourdhui = parisNow().date,
): PrixEffectif {
  const prixNormal = Number(p.price) || 0;
  const promo = p.promo_price === null || p.promo_price === undefined ? null : Number(p.promo_price);

  const enPromo =
    promo !== null &&
    !!p.promo_start &&
    !!p.promo_end &&
    aujourdhui >= p.promo_start &&
    aujourdhui <= p.promo_end;

  if (!enPromo) {
    return { prix: prixNormal, enPromo: false, prixBarre: null, finPromo: null };
  }
  return { prix: promo!, enPromo: true, prixBarre: prixNormal, finPromo: p.promo_end };
}

/** Remise en pourcentage, arrondie, pour l'affichage d'un badge. */
export function pourcentageRemise(p: Pick<PrestationBase, 'price' | 'promo_price'>): number | null {
  const normal = Number(p.price) || 0;
  const promo = p.promo_price === null || p.promo_price === undefined ? null : Number(p.promo_price);
  if (promo === null || normal <= 0 || promo >= normal) return null;
  return Math.round((1 - promo / normal) * 100);
}

/** '2026-12-31' -> '31 décembre' */
export function formatJour(iso: string): string {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
  } catch {
    return iso;
  }
}

export function formatDuree(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h00` : `${h}h${String(m).padStart(2, '0')}`;
}

/** Catégories dans l'ordre d'affichage du catalogue. */
export function categoriesDe(prestations: PrestationBase[]): string[] {
  const vues: string[] = [];
  for (const p of prestations) if (!vues.includes(p.category)) vues.push(p.category);
  return vues;
}

/**
 * Forme consommée par les écrans.
 *
 * `price` porte déjà le tarif du jour, promotion comprise : tout l'affichage
 * et les totaux existants montrent donc le bon montant sans avoir à connaître
 * l'existence des promotions. Le tarif barré reste disponible à part, pour
 * les écrans qui veulent le mettre en avant.
 */
export interface PrestationAffichee {
  id: string;
  name: string;
  category: string;
  description: string;
  /** Tarif appliqué aujourd'hui. */
  price: number;
  duration_min: number;
  duration_label: string;
  priceOnQuote: boolean;
  priceNote: string | null;
  upsells: FinitionBase[];
  enPromo: boolean;
  /** Tarif de référence à barrer, uniquement en promotion. */
  prixBarre: number | null;
  finPromo: string | null;
  remise: number | null;
}

export function pourAffichage(p: PrestationBase, aujourdhui?: string): PrestationAffichee {
  const { prix, enPromo, prixBarre, finPromo } = prixEffectif(p, aujourdhui);
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    price: prix,
    duration_min: p.duration_min,
    duration_label: p.duration_label,
    priceOnQuote: p.price_on_quote,
    priceNote: p.price_note,
    upsells: p.upsells,
    enPromo,
    prixBarre,
    finPromo,
    remise: enPromo ? pourcentageRemise(p) : null,
  };
}
