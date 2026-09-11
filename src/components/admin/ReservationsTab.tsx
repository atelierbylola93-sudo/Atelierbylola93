import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { AdminReservation, STATUS_LABEL, SOURCE_LABEL, SOURCE_STYLE, STATUS_STYLE, formatDateFr } from './types';

interface Props {
  reservations: AdminReservation[];
  loading: boolean;
  onChange: () => void;
}

export function ReservationsTab({ reservations, loading }: Props) {
  const [filter, setFilter] = useState<'all' | AdminReservation['status']>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      if (filter !== 'all' && r.status !== filter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return (
          r.client_name.toLowerCase().includes(q) ||
          r.client_email.toLowerCase().includes(q) ||
          r.client_phone.toLowerCase().includes(q) ||
          r.reference.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [reservations, filter, query]);

  const counts = useMemo(() => ({
    all: reservations.length,
    pending: reservations.filter((r) => r.status === 'pending').length,
    confirmed: reservations.filter((r) => r.status === 'confirmed').length,
    done: reservations.filter((r) => r.status === 'done').length,
    cancelled: reservations.filter((r) => r.status === 'cancelled').length,
  }), [reservations]);

  return (
    <section>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'confirmed', 'done', 'cancelled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`h-9 px-3 rounded-full text-xs border transition-colors ${
                filter === f
                  ? 'bg-[#2A241C] text-white border-[#2A241C]'
                  : 'bg-white text-[#2A241C] border-[#DDCCB2] hover:bg-[#EFE7D2]'
              }`}
            >
              {f === 'all' ? 'Toutes' : STATUS_LABEL[f]} ({counts[f]})
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7F6E]" />
          <input
            type="search"
            placeholder="Nom, email, tél., réf."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 pl-9 pr-3 rounded-full border border-[#DDCCB2] bg-white text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#B88F4D]"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-[#6E6455]">Chargement…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[#6E6455] bg-white/60 rounded-2xl border border-[#DDCCB2]">
          Aucune réservation pour ce filtre.
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('admin:open-reservation', { detail: r }))}
                className="w-full text-left bg-white rounded-2xl border border-[#DDCCB2] hover:border-[#B88F4D] transition-colors p-4 sm:p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border ${STATUS_STYLE[r.status].bg} ${STATUS_STYLE[r.status].text} ${STATUS_STYLE[r.status].border}`}>
                        {STATUS_LABEL[r.status]}
                      </span>
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border ${SOURCE_STYLE[r.source]}`}>
                        {SOURCE_LABEL[r.source]}
                      </span>
                      {r.payment_status === 'paid' && (
                        <span className="inline-block text-[10px] px-2 py-0.5 rounded-full border bg-emerald-50 text-emerald-800 border-emerald-200">
                          Payé
                        </span>
                      )}
                      <span className="text-[11px] text-[#8B7F6E]">#{r.reference}</span>
                    </div>
                    <p className="font-serif text-lg text-[#2A241C] truncate">{r.client_name}</p>
                    <p className="text-sm text-[#6E6455] truncate">
                      {r.services.map((s) => s.name).join(' + ')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-[#2A241C] font-semibold">{formatDateFr(r.appointment_date)}</p>
                    <p className="text-sm text-[#6E6455]">{r.appointment_time.slice(0, 5)}</p>
                    <p className="text-base font-semibold text-[#B88F4D] mt-1">{Number(r.total_price).toFixed(0)} €</p>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
