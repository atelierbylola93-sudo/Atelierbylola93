import { bookingDateSchema, parisNow } from './booking-validation';
import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';

const SLOT_INTERVAL_MIN = 30;

function toMin(t: string): number {
  const [h, m] = t.slice(0, 5).split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

function toHHMM(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Public : catalogue des prestations actives, promotions comprises.
 *
 * Lu avec la clé de service : la table est en lecture ouverte, mais passer par
 * le serveur évite un aller-retour depuis le navigateur et permet de servir le
 * catalogue dès le rendu initial.
 */
export const getCataloguePublic = createServerFn({ method: 'GET' }).handler(async () => {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');

  const [presta, finitions] = await Promise.all([
    supabaseAdmin
      .from('services')
      .select('id,name,category,description,price,duration_min,duration_label,price_on_quote,price_note,promo_price,promo_start,promo_end')
      .eq('active', true)
      .order('sort_order', { ascending: true }),
    supabaseAdmin
      .from('service_upsells')
      .select('id,service_id,name,price,description')
      .eq('active', true)
      .order('sort_order', { ascending: true }),
  ]);

  if (presta.error) throw new Error(presta.error.message);
  if (finitions.error) throw new Error(finitions.error.message);

  const parService = new Map<string, Array<{ id: string; name: string; price: number; description: string }>>();
  for (const f of finitions.data ?? []) {
    const liste = parService.get(f.service_id) ?? [];
    liste.push({ id: f.id, name: f.name, price: Number(f.price), description: f.description });
    parService.set(f.service_id, liste);
  }

  const catalogue = (presta.data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    category: s.category,
    description: s.description,
    price: Number(s.price),
    duration_min: s.duration_min,
    duration_label: s.duration_label,
    price_on_quote: s.price_on_quote,
    price_note: s.price_note,
    promo_price: s.promo_price === null ? null : Number(s.promo_price),
    promo_start: s.promo_start,
    promo_end: s.promo_end,
    upsells: parService.get(s.id) ?? [],
  }));

  return { catalogue };
});

/**
 * Public : horaires hebdomadaires de l'institut.
 *
 * Ils étaient écrits en dur dans le site et contredisaient la base. Les lire
 * ici fait de l'écran « Disponibilités » la seule source de vérité : ce que
 * Lola y règle s'affiche partout, y compris dans les données envoyées à Google.
 */
export const getBusinessHoursPublic = createServerFn({ method: 'GET' }).handler(async () => {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
  const { data, error } = await supabaseAdmin
    .from('business_hours')
    .select('weekday,is_open,open_time,close_time,break_start,break_end')
    .order('weekday', { ascending: true });
  if (error) throw new Error(error.message);
  return { hours: data ?? [] };
});

/**
 * Public: returns for each day of the given month whether the salon is open.
 * Never exposes the reason of a closure.
 */
export const getAvailability = createServerFn({ method: 'GET' })
  .inputValidator((d: { month: string }) =>
    z.object({ month: z.string().regex(/^\d{4}-(?:0[1-9]|1[0-2])$/) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const [year, month] = data.month.split('-').map(Number);
    const firstDay = new Date(Date.UTC(year, month - 1, 1));
    const lastDay = new Date(Date.UTC(year, month, 0));
    const startIso = firstDay.toISOString().slice(0, 10);
    const endIso = lastDay.toISOString().slice(0, 10);

    const [hoursRes, closedRes] = await Promise.all([
      supabaseAdmin.from('business_hours').select('weekday,is_open'),
      supabaseAdmin
        .from('closed_dates')
        .select('date')
        .gte('date', startIso)
        .lte('date', endIso),
    ]);

    if (closedRes.error) throw new Error(closedRes.error.message);
    if (hoursRes.error) throw new Error(hoursRes.error.message);

    const closedSet = new Set((closedRes.data ?? []).map((c) => c.date as string));
    const hoursMap = new Map<number, boolean>();
    (hoursRes.data ?? []).forEach((h) =>
      hoursMap.set(h.weekday as number, h.is_open as boolean),
    );

    const days: { date: string; open: boolean }[] = [];
    const daysInMonth = lastDay.getUTCDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(Date.UTC(year, month - 1, d));
      const iso = dt.toISOString().slice(0, 10);
      const weekday = dt.getUTCDay();
      const open = (hoursMap.get(weekday) ?? false) && !closedSet.has(iso);
      days.push({ date: iso, open });
    }
    return { month: data.month, days };
  });

/**
 * Public: returns bookable start times for a given date given the requested
 * duration. Combines business hours, closed dates, blocked slots and existing
 * non-cancelled reservations. Never exposes reasons or client data.
 */
export const getAvailableSlots = createServerFn({ method: 'GET' })
  .inputValidator((d: { date: string; duration_min?: number }) =>
    z
      .object({
        date: bookingDateSchema,
        duration_min: z.number().int().min(0).max(1440).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const duration = data.duration_min && data.duration_min > 0 ? data.duration_min : 60;
    const dt = new Date(data.date + 'T00:00:00Z');
    const weekday = dt.getUTCDay();

    const [hoursRes, closedRes, blockedRes, resvRes] = await Promise.all([
      supabaseAdmin
        .from('business_hours')
        .select('is_open,open_time,close_time,break_start,break_end')
        .eq('weekday', weekday)
        .maybeSingle(),
      supabaseAdmin
        .from('closed_dates')
        .select('date')
        .eq('date', data.date)
        .maybeSingle(),
      supabaseAdmin
        .from('blocked_slots')
        .select('start_time,end_time')
        .eq('date', data.date),
      supabaseAdmin
        .from('reservations')
        .select('appointment_time,duration_min,status')
        .eq('appointment_date', data.date)
        .is('deleted_at', null)
        .neq('status', 'cancelled'),
    ]);

    if (hoursRes.error) throw new Error(hoursRes.error.message);
    if (blockedRes.error) throw new Error(blockedRes.error.message);
    if (resvRes.error) throw new Error(resvRes.error.message);

    if (!hoursRes.data || !hoursRes.data.is_open || closedRes.data) {
      return { date: data.date, slots: [] as string[] };
    }

    const openMin = toMin(hoursRes.data.open_time as unknown as string);
    const closeMin = toMin(hoursRes.data.close_time as unknown as string);

    const busy: Array<[number, number]> = [];
    // La pause du jour se comporte comme un creneau deja pris.
    if (hoursRes.data.break_start && hoursRes.data.break_end) {
      busy.push([
        toMin(hoursRes.data.break_start as unknown as string),
        toMin(hoursRes.data.break_end as unknown as string),
      ]);
    }
    (blockedRes.data ?? []).forEach((b) =>
      busy.push([
        toMin(b.start_time as unknown as string),
        toMin(b.end_time as unknown as string),
      ]),
    );
    (resvRes.data ?? []).forEach((r) => {
      const s = toMin(r.appointment_time as unknown as string);
      busy.push([s, s + ((r.duration_min as number) || 60)]);
    });

    const slots: string[] = [];
    // Les creneaux vont de l'ouverture a la fermeture, sans retrancher la duree
    // du soin : l'institut est tenu par deux personnes, un soin long peut donc
    // commencer en fin de journee et se terminer apres la fermeture. Seule
    // l'heure de DEPART doit tomber dans les horaires.
    //
    // La detection de chevauchement, elle, garde la duree : elle reproduit la
    // contrainte d'exclusion de la base. Si les deux divergeaient, le site
    // proposerait un creneau que le serveur refuserait ensuite.
    for (let t = openMin; t <= closeMin; t += SLOT_INTERVAL_MIN) {
      const end = t + duration;
      const conflict = busy.some(([bs, be]) => t < be && end > bs);
      if (!conflict) slots.push(toHHMM(t));
    }

    const now = parisNow();
    if (data.date < now.date) return { date: data.date, slots: [] as string[] };
    return { date: data.date, slots: data.date === now.date ? slots.filter(s => s > now.time) : slots };
  });
