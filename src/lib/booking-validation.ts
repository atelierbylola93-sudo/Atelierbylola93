import { z } from 'zod';
import { SERVICE_CATALOG } from './service-catalog';

export const bookingDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const date = new Date(value + 'T00:00:00Z');
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, 'Date invalide');
export const bookingTimeSchema = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/);

export function parisNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(now);
  const value = (type: string) => parts.find(p => p.type === type)!.value;
  return { date: `${value('year')}-${value('month')}-${value('day')}`, time: `${value('hour')}:${value('minute')}` };
}

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

export function priceBooking(input: z.infer<typeof reservationSchema>) {
  const ids = input.services.map(s => s.id);
  if (new Set(ids).size !== ids.length || new Set(input.options).size !== input.options.length) throw new Error('Sélection en double.');
  const services = ids.map(id => {
    const service = SERVICE_CATALOG.find(s => s.id === id);
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
  return {
    services: services.map(s => ({ id: s.id, name: s.name, price: s.price, duration: s.duration_label })),
    options: options.map(o => o.name),
    duration_min,
    total_price: services.reduce((sum, s) => sum + s.price, 0) + options.reduce((sum, o) => sum + o.price, 0),
  };
}
