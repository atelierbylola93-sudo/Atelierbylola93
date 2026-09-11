import { useCallback, useEffect, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Trash2, Plus, CalendarX, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  listBusinessHours, upsertBusinessHour,
  listClosedDates, addClosedDates, deleteClosedDate,
  listBlockedSlots, addBlockedSlot, deleteBlockedSlot,
} from '@/lib/admin.functions';

type BusinessHour = { id: string; weekday: number; is_open: boolean; open_time: string; close_time: string };
type ClosedDate = { id: string; date: string; reason: string | null };
type BlockedSlot = { id: string; date: string; start_time: string; end_time: string; reason: string | null };

const WEEKDAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export function AvailabilityTab() {
  const getHours = useServerFn(listBusinessHours);
  const saveHour = useServerFn(upsertBusinessHour);
  const getClosed = useServerFn(listClosedDates);
  const addClosed = useServerFn(addClosedDates);
  const delClosed = useServerFn(deleteClosedDate);
  const getBlocked = useServerFn(listBlockedSlots);
  const addBlocked = useServerFn(addBlockedSlot);
  const delBlocked = useServerFn(deleteBlockedSlot);

  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [closed, setClosed] = useState<ClosedDate[]>([]);
  const [blocked, setBlocked] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [h, c, b] = await Promise.all([getHours(), getClosed(), getBlocked()]);
      setHours(h.hours as BusinessHour[]);
      setClosed(c.closed as ClosedDate[]);
      setBlocked(b.blocked as BlockedSlot[]);
    } catch (e) {
      toast.error('Chargement impossible');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [getHours, getClosed, getBlocked]);

  useEffect(() => { load(); }, [load]);

  const updateHour = async (h: BusinessHour, patch: Partial<BusinessHour>) => {
    const next = { ...h, ...patch };
    setHours((prev) => prev.map((x) => (x.weekday === h.weekday ? next : x)));
    try {
      await saveHour({ data: {
        weekday: next.weekday,
        is_open: next.is_open,
        open_time: next.open_time.slice(0, 5),
        close_time: next.close_time.slice(0, 5),
      } });
      toast.success('Horaire enregistré');
    } catch (e) {
      toast.error('Sauvegarde impossible');
      setHours((prev) => prev.map((x) => (x.weekday === h.weekday ? h : x)));
      console.error(e);
    }
  };

  return (
    <section className="space-y-6">
      {loading && (
        <div className="flex items-center gap-2 text-sm text-[#6E6455]">
          <Loader2 className="w-4 h-4 animate-spin" /> Chargement…
        </div>
      )}

      {/* Horaires hebdomadaires */}
      <div className="bg-white rounded-2xl border border-[#DDCCB2] overflow-hidden">
        <header className="px-5 py-4 border-b border-[#DDCCB2] flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#B88F4D]" />
          <div>
            <h2 className="font-serif text-lg text-[#2A241C]">Horaires hebdomadaires</h2>
            <p className="text-xs text-[#6E6455]">Ouverture / fermeture par jour de la semaine</p>
          </div>
        </header>
        <ul className="divide-y divide-[#EFE7D2]">
          {[1, 2, 3, 4, 5, 6, 0].map((wd) => {
            const h = hours.find((x) => x.weekday === wd);
            if (!h) return null;
            return (
              <li key={wd} className="px-5 py-3 flex flex-wrap items-center gap-3">
                <div className="w-24 shrink-0 text-sm font-medium text-[#2A241C]">{WEEKDAYS[wd]}</div>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={h.is_open}
                    onChange={(e) => updateHour(h, { is_open: e.target.checked })}
                    className="h-4 w-4 accent-[#B88F4D]"
                  />
                  <span className="text-xs text-[#6E6455]">{h.is_open ? 'Ouvert' : 'Fermé'}</span>
                </label>
                <div className={`flex items-center gap-2 ml-auto ${!h.is_open ? 'opacity-40 pointer-events-none' : ''}`}>
                  <input
                    type="time"
                    value={h.open_time.slice(0, 5)}
                    onChange={(e) => updateHour(h, { open_time: e.target.value })}
                    className="h-9 px-2 rounded-lg border border-[#DDCCB2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]"
                  />
                  <span className="text-xs text-[#8B7F6E]">→</span>
                  <input
                    type="time"
                    value={h.close_time.slice(0, 5)}
                    onChange={(e) => updateHour(h, { close_time: e.target.value })}
                    className="h-9 px-2 rounded-lg border border-[#DDCCB2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]"
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Fermetures exceptionnelles */}
      <ClosedDatesBlock
        closed={closed}
        onAdd={async (start_date, end_date, reason) => {
          try {
            await addClosed({ data: { start_date, end_date: end_date || null, reason: reason || null } });
            toast.success('Fermeture enregistrée');
            load();
          } catch (e) { toast.error('Ajout impossible'); console.error(e); }
        }}
        onDelete={async (id) => {
          try { await delClosed({ data: { id } }); toast.success('Fermeture supprimée'); load(); }
          catch (e) { toast.error('Suppression impossible'); console.error(e); }
        }}
      />

      {/* Créneaux bloqués */}
      <BlockedSlotsBlock
        blocked={blocked}
        onAdd={async (date, start_time, end_time, reason) => {
          try {
            await addBlocked({ data: { date, start_time, end_time, reason: reason || null } });
            toast.success('Blocage enregistré');
            load();
          } catch (e) { toast.error('Ajout impossible'); console.error(e); }
        }}
        onDelete={async (id) => {
          try { await delBlocked({ data: { id } }); toast.success('Blocage supprimé'); load(); }
          catch (e) { toast.error('Suppression impossible'); console.error(e); }
        }}
      />
    </section>
  );
}

function ClosedDatesBlock({ closed, onAdd, onDelete }: {
  closed: ClosedDate[]; onAdd: (s: string, e: string, r: string) => void; onDelete: (id: string) => void;
}) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [reason, setReason] = useState('');
  const [pendingDel, setPendingDel] = useState<ClosedDate | null>(null);
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = closed.filter((c) => c.date >= today);

  return (
    <div className="bg-white rounded-2xl border border-[#DDCCB2] overflow-hidden">
      <header className="px-5 py-4 border-b border-[#DDCCB2] flex items-center gap-2">
        <CalendarX className="w-4 h-4 text-[#B88F4D]" />
        <div>
          <h2 className="font-serif text-lg text-[#2A241C]">Fermetures exceptionnelles</h2>
          <p className="text-xs text-[#6E6455]">Vacances, jour férié, absence — date unique ou plage</p>
        </div>
      </header>
      <div className="p-5 flex flex-wrap gap-2 items-end border-b border-[#EFE7D2]">
        <label className="flex-1 min-w-[130px]">
          <span className="block text-[10px] uppercase tracking-widest text-[#8B7F6E] mb-1">Du</span>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)}
            className="h-10 w-full px-3 rounded-lg border border-[#DDCCB2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]" />
        </label>
        <label className="flex-1 min-w-[130px]">
          <span className="block text-[10px] uppercase tracking-widest text-[#8B7F6E] mb-1">Au (optionnel)</span>
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)}
            className="h-10 w-full px-3 rounded-lg border border-[#DDCCB2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]" />
        </label>
        <label className="flex-[2] min-w-[180px]">
          <span className="block text-[10px] uppercase tracking-widest text-[#8B7F6E] mb-1">Motif (optionnel)</span>
          <input type="text" value={reason} maxLength={200} onChange={(e) => setReason(e.target.value)} placeholder="Congés d'été"
            className="h-10 w-full px-3 rounded-lg border border-[#DDCCB2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]" />
        </label>
        <button
          disabled={!start}
          onClick={() => { onAdd(start, end, reason); setStart(''); setEnd(''); setReason(''); }}
          className="h-10 px-4 rounded-full bg-[#B88F4D] text-white text-sm font-medium hover:bg-[#A17E60] disabled:opacity-40 inline-flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>
      <ul className="divide-y divide-[#EFE7D2]">
        {upcoming.length === 0 && (
          <li className="px-5 py-5 text-sm text-[#8B7F6E]">Aucune fermeture programmée.</li>
        )}
        {upcoming.map((c) => (
          <li key={c.id} className="px-5 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#2A241C]">
                {new Date(c.date + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
              </p>
              {c.reason && <p className="text-xs text-[#6E6455]">{c.reason}</p>}
            </div>
            <button
              onClick={() => setPendingDel(c)}
              className="h-9 w-9 rounded-full text-red-700 hover:bg-red-50 inline-flex items-center justify-center"
              aria-label="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>

      <AlertDialog open={!!pendingDel} onOpenChange={(v) => !v && setPendingDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette fermeture ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le jour redeviendra disponible à la réservation publique.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (pendingDel) onDelete(pendingDel.id); setPendingDel(null); }}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function BlockedSlotsBlock({ blocked, onAdd, onDelete }: {
  blocked: BlockedSlot[]; onAdd: (d: string, s: string, e: string, r: string) => void; onDelete: (id: string) => void;
}) {
  const [date, setDate] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [reason, setReason] = useState('');
  const [pendingDel, setPendingDel] = useState<BlockedSlot | null>(null);
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = blocked.filter((b) => b.date >= today);

  return (
    <div className="bg-white rounded-2xl border border-[#DDCCB2] overflow-hidden">
      <header className="px-5 py-4 border-b border-[#DDCCB2] flex items-center gap-2">
        <Clock className="w-4 h-4 text-[#B88F4D]" />
        <div>
          <h2 className="font-serif text-lg text-[#2A241C]">Créneaux bloqués</h2>
          <p className="text-xs text-[#6E6455]">Pause déjeuner, RDV personnel, formation…</p>
        </div>
      </header>
      <div className="p-5 grid grid-cols-2 md:grid-cols-5 gap-2 items-end border-b border-[#EFE7D2]">
        <label className="col-span-2 md:col-span-1">
          <span className="block text-[10px] uppercase tracking-widest text-[#8B7F6E] mb-1">Date</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="h-10 w-full px-3 rounded-lg border border-[#DDCCB2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]" />
        </label>
        <label>
          <span className="block text-[10px] uppercase tracking-widest text-[#8B7F6E] mb-1">Début</span>
          <input type="time" value={start} onChange={(e) => setStart(e.target.value)}
            className="h-10 w-full px-2 rounded-lg border border-[#DDCCB2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]" />
        </label>
        <label>
          <span className="block text-[10px] uppercase tracking-widest text-[#8B7F6E] mb-1">Fin</span>
          <input type="time" value={end} onChange={(e) => setEnd(e.target.value)}
            className="h-10 w-full px-2 rounded-lg border border-[#DDCCB2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]" />
        </label>
        <label className="col-span-2 md:col-span-1">
          <span className="block text-[10px] uppercase tracking-widest text-[#8B7F6E] mb-1">Motif</span>
          <input type="text" value={reason} maxLength={200} onChange={(e) => setReason(e.target.value)} placeholder="Pause"
            className="h-10 w-full px-3 rounded-lg border border-[#DDCCB2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]" />
        </label>
        <button
          disabled={!date || !start || !end}
          onClick={() => { onAdd(date, start, end, reason); setDate(''); setStart(''); setEnd(''); setReason(''); }}
          className="h-10 px-4 rounded-full bg-[#B88F4D] text-white text-sm font-medium hover:bg-[#A17E60] disabled:opacity-40 inline-flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>
      <ul className="divide-y divide-[#EFE7D2]">
        {upcoming.length === 0 && (
          <li className="px-5 py-5 text-sm text-[#8B7F6E]">Aucun blocage programmé.</li>
        )}
        {upcoming.map((b) => (
          <li key={b.id} className="px-5 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#2A241C]">
                {new Date(b.date + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short' })}
                {' • '}{b.start_time.slice(0, 5)} → {b.end_time.slice(0, 5)}
              </p>
              {b.reason && <p className="text-xs text-[#6E6455]">{b.reason}</p>}
            </div>
            <button
              onClick={() => setPendingDel(b)}
              className="h-9 w-9 rounded-full text-red-700 hover:bg-red-50 inline-flex items-center justify-center"
              aria-label="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>

      <AlertDialog open={!!pendingDel} onOpenChange={(v) => !v && setPendingDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce blocage ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le créneau redeviendra disponible à la réservation publique.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (pendingDel) onDelete(pendingDel.id); setPendingDel(null); }}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
