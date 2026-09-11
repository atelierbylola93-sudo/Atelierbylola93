import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { AdminReservation, STATUS_STYLE, formatDateFr, isoDate, toMinutes } from './types';

interface Props {
  reservations: AdminReservation[];
  loading: boolean;
  onOpenReservation: (r: AdminReservation) => void;
  onOpenEmptySlot: (date: string, time: string) => void;
}

const DAY_START = 9 * 60; // 9h
const DAY_END = 20 * 60; // 20h
const PX_PER_MIN = 1.4; // ~84px per hour
const GRID_HEIGHT = (DAY_END - DAY_START) * PX_PER_MIN;
const HOUR_STEP = 60;

export function AgendaTab({ reservations, loading, onOpenReservation, onOpenEmptySlot }: Props) {
  const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
  const [view, setView] = useState<'day' | 'week'>(isDesktop ? 'week' : 'day');
  const [cursor, setCursor] = useState<Date>(() => new Date(new Date().toDateString()));

  const days = useMemo(() => {
    if (view === 'day') return [cursor];
    // week starting Monday
    const d = new Date(cursor);
    const day = d.getDay();
    const diffToMonday = (day + 6) % 7;
    d.setDate(d.getDate() - diffToMonday);
    return Array.from({ length: 7 }, (_, i) => {
      const dd = new Date(d);
      dd.setDate(d.getDate() + i);
      return dd;
    });
  }, [cursor, view]);

  const byDate = useMemo(() => {
    const m = new Map<string, AdminReservation[]>();
    for (const r of reservations) {
      if (r.status === 'cancelled') continue; // hide cancelled from agenda
      const arr = m.get(r.appointment_date) ?? [];
      arr.push(r);
      m.set(r.appointment_date, arr);
    }
    return m;
  }, [reservations]);

  const goto = (delta: number) => {
    const d = new Date(cursor);
    d.setDate(d.getDate() + delta * (view === 'day' ? 1 : 7));
    setCursor(d);
  };
  const today = () => setCursor(new Date(new Date().toDateString()));

  const hourMarks: number[] = [];
  for (let t = DAY_START; t <= DAY_END; t += HOUR_STEP) hourMarks.push(t);

  return (
    <section>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          onClick={() => goto(-1)}
          className="h-10 w-10 rounded-full bg-white border border-[#DDCCB2] hover:bg-[#EFE7D2] inline-flex items-center justify-center"
          aria-label="Précédent"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={today}
          className="h-10 px-4 rounded-full bg-white border border-[#DDCCB2] text-sm hover:bg-[#EFE7D2] inline-flex items-center gap-1.5"
        >
          <CalendarDays className="w-4 h-4" />
          Aujourd'hui
        </button>
        <button
          onClick={() => goto(1)}
          className="h-10 w-10 rounded-full bg-white border border-[#DDCCB2] hover:bg-[#EFE7D2] inline-flex items-center justify-center"
          aria-label="Suivant"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <input
          type="date"
          value={isoDate(cursor)}
          onChange={(e) => setCursor(new Date(e.target.value + 'T00:00:00'))}
          className="h-10 px-3 rounded-full bg-white border border-[#DDCCB2] text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]"
        />
        <div className="ml-auto inline-flex rounded-full border border-[#DDCCB2] bg-white p-1">
          {(['day', 'week'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`h-8 px-3 rounded-full text-xs font-medium transition-colors ${
                view === v ? 'bg-[#2A241C] text-white' : 'text-[#2A241C] hover:bg-[#EFE7D2]'
              }`}
            >
              {v === 'day' ? 'Jour' : 'Semaine'}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm font-medium text-[#2A241C] mb-3">
        {view === 'day'
          ? formatDateFr(isoDate(cursor))
          : `${formatDateFr(isoDate(days[0]))} → ${formatDateFr(isoDate(days[days.length - 1]))}`}
      </div>

      {/* Grid */}
      <div className="bg-white rounded-2xl border border-[#DDCCB2] overflow-x-auto">
        <div className="min-w-full inline-block">
          {/* Header row of days */}
          <div className="flex sticky top-0 bg-white z-10 border-b border-[#DDCCB2]">
            <div className="w-14 shrink-0" />
            {days.map((d) => {
              const iso = isoDate(d);
              const isToday = iso === isoDate(new Date());
              return (
                <div
                  key={iso}
                  className={`flex-1 min-w-[110px] px-2 py-2 text-center border-l border-[#DDCCB2] ${
                    isToday ? 'bg-[#EFE7D2]' : ''
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-widest text-[#8B7F6E]">
                    {d.toLocaleDateString('fr-FR', { weekday: 'short' })}
                  </p>
                  <p className={`text-sm font-serif ${isToday ? 'text-[#B88F4D] font-bold' : 'text-[#2A241C]'}`}>
                    {d.getDate()}/{String(d.getMonth() + 1).padStart(2, '0')}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Time grid */}
          <div className="flex relative" style={{ height: GRID_HEIGHT }}>
            {/* Hours axis */}
            <div className="w-14 shrink-0 relative border-r border-[#DDCCB2]">
              {hourMarks.slice(0, -1).map((m) => (
                <div
                  key={m}
                  className="absolute left-0 right-0 pr-2 text-right text-[10px] text-[#8B7F6E]"
                  style={{ top: (m - DAY_START) * PX_PER_MIN }}
                >
                  {String(Math.floor(m / 60)).padStart(2, '0')}h
                </div>
              ))}
            </div>

            {/* Day columns */}
            {days.map((d) => {
              const iso = isoDate(d);
              const dayResvs = byDate.get(iso) ?? [];
              return (
                <div key={iso} className="flex-1 min-w-[110px] relative border-l border-[#DDCCB2]">
                  {/* Hour lines + click zones */}
                  {hourMarks.slice(0, -1).map((m) => (
                    <button
                      key={m}
                      onClick={() => onOpenEmptySlot(iso, `${String(Math.floor(m / 60)).padStart(2, '0')}:00`)}
                      className="absolute left-0 right-0 border-t border-[#EFE7D2] hover:bg-[#F6F0DF] transition-colors"
                      style={{ top: (m - DAY_START) * PX_PER_MIN, height: HOUR_STEP * PX_PER_MIN }}
                      aria-label={`Créer un RDV à ${String(Math.floor(m / 60)).padStart(2, '0')}:00`}
                    />
                  ))}

                  {/* Reservations */}
                  {dayResvs.map((r) => {
                    const start = toMinutes(r.appointment_time);
                    const top = (start - DAY_START) * PX_PER_MIN;
                    const height = Math.max(28, (r.duration_min || 60) * PX_PER_MIN);
                    const style = STATUS_STYLE[r.status];
                    return (
                      <button
                        key={r.id}
                        onClick={() => onOpenReservation(r)}
                        className={`absolute left-1 right-1 rounded-lg border px-2 py-1 text-left overflow-hidden shadow-sm hover:shadow-md transition-shadow ${style.block}`}
                        style={{ top, height }}
                      >
                        <div className="text-[10px] font-mono opacity-70">{r.appointment_time.slice(0, 5)}</div>
                        <div className="text-[11px] font-semibold truncate">{r.client_name}</div>
                        <div className="text-[10px] truncate opacity-80">
                          {r.services.map((s) => s.name).join(' + ')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {loading && <p className="mt-4 text-sm text-[#6E6455]">Chargement…</p>}

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-[#6E6455]">
        <LegendDot className="bg-amber-100 border-amber-300" label="En attente" />
        <LegendDot className="bg-emerald-100 border-emerald-300" label="Confirmée" />
        <LegendDot className="bg-neutral-100 border-neutral-300" label="Terminée" />
        <span className="ml-auto">Cliquez sur un créneau vide pour créer un RDV</span>
      </div>
    </section>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`inline-block w-3 h-3 rounded border ${className}`} />
      {label}
    </span>
  );
}
