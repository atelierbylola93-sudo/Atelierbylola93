import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';

// NOTE: pour rester compatible avec le splitter de server functions, chaque
// handler embarque sa propre vérification admin (pas de helper sibling).

// ---------- Réservations : lecture / statut / paiement / suppression ----------

export const listReservations = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: role } = await context.supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', context.userId)
      .eq('role', 'admin')
      .maybeSingle();
    if (!role) throw new Error('Forbidden');
    const { data, error } = await context.supabase
      .from('reservations')
      .select('*')
      .order('appointment_date', { ascending: false })
      .order('appointment_time', { ascending: false });
    if (error) throw new Error(error.message);
    return { reservations: data ?? [] };
  });

export const updateReservationStatus = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; status: 'pending' | 'confirmed' | 'cancelled' | 'done' }) =>
    z.object({
      id: z.string().uuid(),
      status: z.enum(['pending', 'confirmed', 'cancelled', 'done']),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: role } = await context.supabase
      .from('user_roles').select('role').eq('user_id', context.userId).eq('role', 'admin').maybeSingle();
    if (!role) throw new Error('Forbidden');
    const { error } = await context.supabase
      .from('reservations')
      .update({ status: data.status })
      .eq('id', data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateReservationPayment = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string; payment_status: 'unpaid' | 'paid'; payment_method: 'cb' | 'especes' | 'planity' | 'autre' | null }) =>
    z.object({
      id: z.string().uuid(),
      payment_status: z.enum(['unpaid', 'paid']),
      payment_method: z.enum(['cb', 'especes', 'planity', 'autre']).nullable(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: role } = await context.supabase
      .from('user_roles').select('role').eq('user_id', context.userId).eq('role', 'admin').maybeSingle();
    if (!role) throw new Error('Forbidden');
    const { error } = await context.supabase
      .from('reservations')
      .update({ payment_status: data.payment_status, payment_method: data.payment_method })
      .eq('id', data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteReservation = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: role } = await context.supabase
      .from('user_roles').select('role').eq('user_id', context.userId).eq('role', 'admin').maybeSingle();
    if (!role) throw new Error('Forbidden');
    const { error } = await context.supabase.from('reservations').delete().eq('id', data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getMyAdminStatus = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from('user_roles').select('role').eq('user_id', context.userId).eq('role', 'admin').maybeSingle();
    return { isAdmin: !!data };
  });

// ---------- Horaires hebdomadaires ----------

export const listBusinessHours = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: role } = await context.supabase
      .from('user_roles').select('role').eq('user_id', context.userId).eq('role', 'admin').maybeSingle();
    if (!role) throw new Error('Forbidden');
    const { data, error } = await context.supabase
      .from('business_hours')
      .select('*')
      .order('weekday', { ascending: true });
    if (error) throw new Error(error.message);
    return { hours: data ?? [] };
  });

export const upsertBusinessHour = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { weekday: number; is_open: boolean; open_time: string; close_time: string }) =>
    z.object({
      weekday: z.number().int().min(0).max(6),
      is_open: z.boolean(),
      open_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
      close_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
    }).refine((v) => v.close_time > v.open_time, { message: 'Heure de fermeture doit être après ouverture' })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: role } = await context.supabase
      .from('user_roles').select('role').eq('user_id', context.userId).eq('role', 'admin').maybeSingle();
    if (!role) throw new Error('Forbidden');
    const open = data.open_time.length === 5 ? `${data.open_time}:00` : data.open_time;
    const close = data.close_time.length === 5 ? `${data.close_time}:00` : data.close_time;
    const { error } = await context.supabase
      .from('business_hours')
      .upsert(
        { weekday: data.weekday, is_open: data.is_open, open_time: open, close_time: close },
        { onConflict: 'weekday' },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Fermetures exceptionnelles ----------

export const listClosedDates = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: role } = await context.supabase
      .from('user_roles').select('role').eq('user_id', context.userId).eq('role', 'admin').maybeSingle();
    if (!role) throw new Error('Forbidden');
    const { data, error } = await context.supabase
      .from('closed_dates')
      .select('*')
      .order('date', { ascending: true });
    if (error) throw new Error(error.message);
    return { closed: data ?? [] };
  });

export const addClosedDates = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { start_date: string; end_date?: string | null; reason?: string | null }) =>
    z.object({
      start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
      reason: z.string().trim().max(200).nullable().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: role } = await context.supabase
      .from('user_roles').select('role').eq('user_id', context.userId).eq('role', 'admin').maybeSingle();
    if (!role) throw new Error('Forbidden');
    const start = new Date(data.start_date + 'T00:00:00Z');
    const end = data.end_date ? new Date(data.end_date + 'T00:00:00Z') : start;
    if (end < start) throw new Error('Plage invalide');
    const rows: { date: string; reason: string | null }[] = [];
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      rows.push({ date: d.toISOString().slice(0, 10), reason: data.reason ?? null });
    }
    const { error } = await context.supabase
      .from('closed_dates')
      .upsert(rows, { onConflict: 'date' });
    if (error) throw new Error(error.message);
    return { ok: true, count: rows.length };
  });

export const deleteClosedDate = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: role } = await context.supabase
      .from('user_roles').select('role').eq('user_id', context.userId).eq('role', 'admin').maybeSingle();
    if (!role) throw new Error('Forbidden');
    const { error } = await context.supabase.from('closed_dates').delete().eq('id', data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Créneaux bloqués ----------

export const listBlockedSlots = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: role } = await context.supabase
      .from('user_roles').select('role').eq('user_id', context.userId).eq('role', 'admin').maybeSingle();
    if (!role) throw new Error('Forbidden');
    const { data, error } = await context.supabase
      .from('blocked_slots')
      .select('*')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });
    if (error) throw new Error(error.message);
    return { blocked: data ?? [] };
  });

export const addBlockedSlot = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { date: string; start_time: string; end_time: string; reason?: string | null }) =>
    z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      start_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
      end_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
      reason: z.string().trim().max(200).nullable().optional(),
    }).refine((v) => v.end_time > v.start_time, { message: 'Fin doit être après début' }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: role } = await context.supabase
      .from('user_roles').select('role').eq('user_id', context.userId).eq('role', 'admin').maybeSingle();
    if (!role) throw new Error('Forbidden');
    const start = data.start_time.length === 5 ? `${data.start_time}:00` : data.start_time;
    const end = data.end_time.length === 5 ? `${data.end_time}:00` : data.end_time;
    const { error } = await context.supabase
      .from('blocked_slots')
      .insert({ date: data.date, start_time: start, end_time: end, reason: data.reason ?? null });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteBlockedSlot = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: role } = await context.supabase
      .from('user_roles').select('role').eq('user_id', context.userId).eq('role', 'admin').maybeSingle();
    if (!role) throw new Error('Forbidden');
    const { error } = await context.supabase.from('blocked_slots').delete().eq('id', data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Agenda : réservations sur une plage de dates ----------

export const listReservationsRange = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { start_date: string; end_date: string }) =>
    z.object({
      start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: role } = await context.supabase
      .from('user_roles').select('role').eq('user_id', context.userId).eq('role', 'admin').maybeSingle();
    if (!role) throw new Error('Forbidden');
    const [resvRes, blockedRes, closedRes] = await Promise.all([
      context.supabase
        .from('reservations')
        .select('*')
        .gte('appointment_date', data.start_date)
        .lte('appointment_date', data.end_date)
        .order('appointment_date', { ascending: true })
        .order('appointment_time', { ascending: true }),
      context.supabase
        .from('blocked_slots')
        .select('*')
        .gte('date', data.start_date)
        .lte('date', data.end_date),
      context.supabase
        .from('closed_dates')
        .select('*')
        .gte('date', data.start_date)
        .lte('date', data.end_date),
    ]);
    if (resvRes.error) throw new Error(resvRes.error.message);
    if (blockedRes.error) throw new Error(blockedRes.error.message);
    if (closedRes.error) throw new Error(closedRes.error.message);
    return {
      reservations: resvRes.data ?? [],
      blocked: blockedRes.data ?? [],
      closed: closedRes.data ?? [],
    };
  });

// ---------- Création manuelle de RDV ----------

const manualReservationSchema = z.object({
  client_name: z.string().trim().min(1).max(120),
  client_phone: z.string().trim().min(6).max(30),
  client_email: z.string().trim().email().max(255).optional().or(z.literal('')),
  client_note: z.string().trim().max(1000).optional().nullable(),
  services: z.array(z.object({
    id: z.string().max(120),
    name: z.string().max(200),
    price: z.number().nonnegative(),
    duration_min: z.number().int().nonnegative().max(1440),
  })).min(1).max(20),
  appointment_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  appointment_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/),
  source: z.enum(['telephone', 'instagram', 'autre', 'site']).default('telephone'),
});

function toMinLocal(t: string): number {
  const [h, m] = t.slice(0, 5).split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export const createManualReservation = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => manualReservationSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { data: role } = await context.supabase
      .from('user_roles').select('role').eq('user_id', context.userId).eq('role', 'admin').maybeSingle();
    if (!role) throw new Error('Forbidden');

    const duration_min = data.services.reduce((sum, s) => sum + (s.duration_min || 0), 0);
    const total_price = data.services.reduce((sum, s) => sum + Number(s.price || 0), 0);
    const timeHHMMSS = data.appointment_time.length === 5 ? `${data.appointment_time}:00` : data.appointment_time;
    const timeHHMM = timeHHMMSS.slice(0, 5);
    const startMin = toMinLocal(timeHHMM);
    const endMin = startMin + duration_min;

    // --- Anti-conflit côté serveur ---
    const dt = new Date(data.appointment_date + 'T00:00:00Z');
    const weekday = dt.getUTCDay();

    const [hoursRes, closedRes, blockedRes, resvRes] = await Promise.all([
      context.supabase.from('business_hours')
        .select('is_open,open_time,close_time').eq('weekday', weekday).maybeSingle(),
      context.supabase.from('closed_dates')
        .select('date').eq('date', data.appointment_date).maybeSingle(),
      context.supabase.from('blocked_slots')
        .select('start_time,end_time').eq('date', data.appointment_date),
      context.supabase.from('reservations')
        .select('appointment_time,duration_min,status')
        .eq('appointment_date', data.appointment_date)
        .neq('status', 'cancelled'),
    ]);

    if (!hoursRes.data || !hoursRes.data.is_open || closedRes.data) {
      throw new Error('CONFLICT: jour fermé');
    }
    const openMin = toMinLocal(hoursRes.data.open_time as string);
    const closeMin = toMinLocal(hoursRes.data.close_time as string);
    if (startMin < openMin || endMin > closeMin) {
      throw new Error('CONFLICT: hors horaires');
    }
    const conflicts: Array<[number, number]> = [];
    (blockedRes.data ?? []).forEach((b) =>
      conflicts.push([toMinLocal(b.start_time as string), toMinLocal(b.end_time as string)]),
    );
    (resvRes.data ?? []).forEach((r) => {
      const s = toMinLocal(r.appointment_time as string);
      conflicts.push([s, s + ((r.duration_min as number) || 60)]);
    });
    if (conflicts.some(([bs, be]) => startMin < be && endMin > bs)) {
      throw new Error('CONFLICT: créneau déjà pris');
    }

    // Référence courte
    const reference = `LOL-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

    const { data: inserted, error } = await context.supabase
      .from('reservations')
      .insert({
        reference,
        status: 'confirmed',
        client_name: data.client_name,
        client_email: data.client_email && data.client_email.length > 0 ? data.client_email : 'sans-email@atelier.local',
        client_phone: data.client_phone,
        client_note: data.client_note ?? null,
        services: data.services.map((s) => ({ id: s.id, name: s.name, price: s.price, duration: `${s.duration_min} min` })),
        options: [],
        appointment_date: data.appointment_date,
        appointment_time: timeHHMM,
        duration_min,
        total_price,
        source: data.source,
        payment_status: 'unpaid',
      })
      .select('id, reference')
      .single();
    if (error) throw new Error(error.message);
    return { ok: true, id: inserted.id, reference: inserted.reference };
  });

// ---------- Statistiques ----------

export const getAdminStats = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { start_date: string; end_date: string }) =>
    z.object({
      start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: role } = await context.supabase
      .from('user_roles').select('role').eq('user_id', context.userId).eq('role', 'admin').maybeSingle();
    if (!role) throw new Error('Forbidden');

    const { data: rows, error } = await context.supabase
      .from('reservations')
      .select('id,reference,client_name,status,source,total_price,appointment_date,appointment_time,services,created_at')
      .gte('appointment_date', data.start_date)
      .lte('appointment_date', data.end_date);
    if (error) throw new Error(error.message);

    type Row = {
      id: string; reference: string; client_name: string;
      status: 'pending' | 'confirmed' | 'cancelled' | 'done';
      source: 'site' | 'telephone' | 'instagram' | 'autre';
      total_price: number; appointment_date: string; appointment_time: string;
      services: Array<{ name: string; price: number }>; created_at: string;
    };
    const list = (rows ?? []) as unknown as Row[];

    // KPIs — CA réalisé = uniquement 'done'
    const doneRows = list.filter((r) => r.status === 'done');
    const confirmedUpcomingRows = list.filter((r) => r.status === 'confirmed');
    const nonCancelled = list.filter((r) => r.status !== 'cancelled');
    const cancelled = list.filter((r) => r.status === 'cancelled');

    const revenueDone = doneRows.reduce((s, r) => s + Number(r.total_price || 0), 0);
    const revenueForecast = confirmedUpcomingRows.reduce((s, r) => s + Number(r.total_price || 0), 0);
    const totalBookings = nonCancelled.length;
    const averageBasket = totalBookings > 0
      ? nonCancelled.reduce((s, r) => s + Number(r.total_price || 0), 0) / totalBookings
      : 0;
    const totalIncludingCancelled = list.length;
    const cancellationRate = totalIncludingCancelled > 0
      ? (cancelled.length / totalIncludingCancelled) * 100
      : 0;

    // Série CA par jour (basé sur done)
    const dailyMap = new Map<string, number>();
    // Init tous les jours à 0
    const start = new Date(data.start_date + 'T00:00:00');
    const end = new Date(data.end_date + 'T00:00:00');
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      dailyMap.set(key, 0);
    }
    doneRows.forEach((r) => {
      dailyMap.set(r.appointment_date, (dailyMap.get(r.appointment_date) ?? 0) + Number(r.total_price || 0));
    });
    const daily = Array.from(dailyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => ({ date, revenue }));

    // Top prestations par CA (réalisé)
    const serviceMap = new Map<string, { name: string; revenue: number; count: number }>();
    doneRows.forEach((r) => {
      (r.services ?? []).forEach((s) => {
        const name = String(s?.name ?? '—');
        const cur = serviceMap.get(name) ?? { name, revenue: 0, count: 0 };
        cur.revenue += Number(s?.price ?? 0);
        cur.count += 1;
        serviceMap.set(name, cur);
      });
    });
    const topServices = Array.from(serviceMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);

    // Répartition par canal (non annulées)
    const sourceMap = new Map<string, number>();
    nonCancelled.forEach((r) => {
      const key = r.source ?? 'autre';
      sourceMap.set(key, (sourceMap.get(key) ?? 0) + 1);
    });
    const bySource = Array.from(sourceMap.entries()).map(([source, count]) => ({
      source,
      count,
      pct: totalBookings > 0 ? (count / totalBookings) * 100 : 0,
    }));

    // 10 dernières réservations (créées récemment)
    const recent = [...list]
      .sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''))
      .slice(0, 10)
      .map((r) => ({
        id: r.id, reference: r.reference, client_name: r.client_name,
        status: r.status, source: r.source, total_price: Number(r.total_price || 0),
        appointment_date: r.appointment_date, appointment_time: r.appointment_time,
      }));

    return {
      kpis: {
        revenueDone,
        revenueForecast,
        totalBookings,
        averageBasket,
        cancellationRate,
      },
      daily,
      topServices,
      bySource,
      recent,
    };
  });
