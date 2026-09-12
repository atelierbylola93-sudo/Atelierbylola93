import { z } from 'zod';
import { SERVICE_CATALOG } from './service-catalog';
import { prixEffectif, type PrestationBase } from './catalogue';
import { parisNow } from './paris-time';

export { parisNow };

/**
 * Repli : le catalogue figé dans le code, converti au format de la base.
 * Il ne sert que si la lecture en base échoue — mieux vaut facturer au tarif
 * de référence que refuser toute réservation.
 */
export const CATALOGUE_DE_REPLI: PrestationBase[] = SERVICE_CATALOG.map((s) => ({
  id: s.id,
  name: s.name,
  category: s.category,
  description: s.description,
  price: s.price,
  duration_min: s.duration_min,
  duration_label: s.duration_label,
  price_on_quote: !!s.priceOnQuote,
  price_note: s.priceNote ?? null,
  promo_price: null,
  promo_start: null,
  promo_end: null,
  upsells: s.upsells.map((u) => ({ id: u.id, name: u.name, price: u.price, description: u.description })),
}));

export const bookingDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const date = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, 'Date invalide');
export const bookingTimeSchema = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/);

export const reservationSchema = z.object({
  client_name: z.string().trim().min(3).max(120),
  client_email: z.string().trim().email().max(255),
  client_phone: z.string().trim().min(8).max(30),
  client_note: z.string().trim().max(1000).optional().nullable(),
  services: z.array(z.object({ id: z.string().max(120) })).min(1).max(20),
  options: z.array(z.string().max(200)).max(30).default([]),
  appointment_date: bookingDateSchema,
  appointment_time: bookingTimeSchema,
});

/**
 * Calcule ce qui sera facturé, à partir du catalogue en base.
 *
 * Le prix n'est jamais repris de ce qu'envoie le navigateur : il est recalculé
 * ici. Une cliente qui modifierait les montants dans sa page n'obtiendrait
 * aucune remise.
 *
 * Les promotions en cours sont appliquées, et la réservation conserve une
 * photographie du tarif pratiqué ce jour-là : changer un prix plus tard
 * n'altère aucun historique ni aucune statistique.
 */
export function priceBooking(
  input: z.infer<typeof reservationSchema>,
  catalogue: PrestationBase[] = CATALOGUE_DE_REPLI,
) {
  const ids = input.services.map(s => s.id);
  if (new Set(ids).size !== ids.length || new Set(input.options).size !== input.options.length) throw new Error('Sélection en double.');
  const services = ids.map(id => {
    const service = catalogue.find(s => s.id === id);
    if (!service) throw new Error('Prestation inconnue.');
    return service;
  });
  const options = input.options.map(name => {
    const option = services.flatMap(s => s.upsells).find(o => o.name === name);
    if (!option) throw new Error('Option non disponible pour ces prestations.');
    return option;
  });
  const duration_min = services.reduce((sum, s) => sum + s.duration_min, 0);
  if (duration_min <= 0 || duration_min > 660) throw new Error('La durée dépasse une journée de réservation.');

  const lignes = services.map((s) => {
    const { prix, enPromo, prixBarre } = prixEffectif(s);
    return {
      id: s.id,
      name: s.name,
      price: prix,
      duration: s.duration_label,
      ...(enPromo ? { promo: true as const, price_before: prixBarre } : {}),
    };
  });

  return {
    services: lignes,
    options: options.map(o => o.name),
    duration_min,
    total_price:
      lignes.reduce((sum, l) => sum + l.price, 0) +
      options.reduce((sum, o) => sum + Number(o.price), 0),
  };
}
