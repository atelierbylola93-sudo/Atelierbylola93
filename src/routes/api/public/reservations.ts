import { createFileRoute } from '@tanstack/react-router';
import { reservationSchema, priceBooking, parisNow } from '@/lib/booking-validation';



function toMin(t: string): number {
  const [h, m] = t.slice(0, 5).split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export const Route = createFileRoute('/api/public/reservations')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const origin = request.headers.get('origin');
        if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'Origine non autorisée.' }, { status: 403 });
        if (Number(request.headers.get('content-length') || 0) > 16384) return Response.json({ error: 'Requête trop volumineuse.' }, { status: 413 });
        let payload: unknown;
        try {
          const body = await request.text();
          if (new TextEncoder().encode(body).length > 16384) return Response.json({ error: 'Requête trop volumineuse.' }, { status: 413 });
          payload = JSON.parse(body);
        } catch {
          return Response.json({ error: 'Invalid JSON' }, { status: 400 });
        }
        const parsed = reservationSchema.safeParse(payload);
        if (!parsed.success) {
          return Response.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
        }
        let priced;
        try { priced = priceBooking(parsed.data); } catch (error) {
          return Response.json({ error: error instanceof Error ? error.message : 'Sélection invalide.' }, { status: 400 });
        }
        const b = { ...parsed.data, ...priced, reference: 'LOL-' + crypto.randomUUID().toUpperCase() };
        const now = parisNow();
        if (b.appointment_date < now.date || (b.appointment_date === now.date && b.appointment_time <= now.time)) {
          return Response.json({ error: 'Choisissez une date et une heure futures.' }, { status: 400 });
        }
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
          return Response.json({ error: 'La réservation en ligne est temporairement indisponible. Contactez l’institut par téléphone.' }, { status: 503 });
        }
        const { supabaseAdmin } = await import('@/integrations/supabase/client.server');

        // --- Re-verify availability server-side ---
        const dt = new Date(b.appointment_date + 'T00:00:00Z');
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
            .eq('date', b.appointment_date)
            .maybeSingle(),
          supabaseAdmin
            .from('blocked_slots')
            .select('start_time,end_time')
            .eq('date', b.appointment_date),
          supabaseAdmin
            .from('reservations')
            .select('appointment_time,duration_min')
            .eq('appointment_date', b.appointment_date)
            .neq('status', 'cancelled'),
        ]);

        if (hoursRes.error || closedRes.error || blockedRes.error || resvRes.error) {
          console.error('[reservations] availability lookup failed', hoursRes.error || blockedRes.error || resvRes.error);
          return Response.json({ error: 'Impossible de vérifier les disponibilités. Merci de réessayer.' }, { status: 500 });
        }

        if (!hoursRes.data || !hoursRes.data.is_open || closedRes.data) {
          return Response.json({ error: 'Ce jour n’est plus disponible. Merci de choisir une autre date.' }, { status: 409 });
        }

        const start = toMin(b.appointment_time);
        const end = start + (b.duration_min || 60);
        const openMin = toMin(hoursRes.data.open_time as unknown as string);
        const closeMin = toMin(hoursRes.data.close_time as unknown as string);

        if (start < openMin || end > closeMin) {
          return Response.json({ error: 'Le créneau choisi est en dehors des horaires d’ouverture.' }, { status: 409 });
        }

        const busy: Array<[number, number]> = [];
        (blockedRes.data ?? []).forEach((x) =>
          busy.push([toMin(x.start_time as unknown as string), toMin(x.end_time as unknown as string)]),
        );
        (resvRes.data ?? []).forEach((r) => {
          const s = toMin(r.appointment_time as unknown as string);
          busy.push([s, s + ((r.duration_min as number) || 60)]);
        });
        const conflict = busy.some(([bs, be]) => start < be && end > bs);
        if (conflict) {
          return Response.json({ error: 'Ce créneau vient d’être réservé. Merci d’en choisir un autre.' }, { status: 409 });
        }

        const { data, error } = await supabaseAdmin
          .from('reservations')
          .insert({
            reference: b.reference,
            client_name: b.client_name,
            client_email: b.client_email,
            client_phone: b.client_phone,
            client_note: b.client_note ?? null,
            services: b.services,
            options: b.options,
            appointment_date: b.appointment_date,
            appointment_time: b.appointment_time,
            duration_min: b.duration_min,
            total_price: b.total_price,
            source: 'site',
          })
          .select('id, reference')
          .single();
        if (error) {
          if (error.code === '23P01') return Response.json({ error: 'Ce créneau vient d’être réservé. Choisissez un autre horaire.' }, { status: 409 });
          console.error('[reservations] insert failed', error);
          return Response.json({ error: 'Could not save reservation' }, { status: 500 });
        }
        return Response.json({ ok: true, id: data.id, reference: data.reference }, { status: 201 });
      },
    },
  },
});
