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
        .select('is_open,open_time,close_time')
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
    for (let t = openMin; t + duration <= closeMin; t += SLOT_INTERVAL_MIN) {
      const end = t + duration;
      const conflict = busy.some(([bs, be]) => t < be && end > bs);
      if (!conflict) slots.push(toHHMM(t));
    }

    const now = parisNow();
    if (data.date < now.date) return { date: data.date, slots: [] as string[] };
    return { date: data.date, slots: data.date === now.date ? slots.filter(s => s > now.time) : slots };
  });
