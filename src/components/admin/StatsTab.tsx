import { useCallback, useEffect, useMemo, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { CalendarClock, Wallet, TrendingUp, Users, XCircle, Loader2 } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { getAdminStats } from '@/lib/admin.functions';
import { STATUS_LABEL, STATUS_STYLE, SOURCE_LABEL, SOURCE_STYLE, formatDateFr, type ReservationSource, type ReservationStatus } from './types';

type Period = '7d' | '30d' | 'month' | 'year';

interface StatsData {
  kpis: {
    revenueDone: number;
    revenueForecast: number;
    totalBookings: number;
    averageBasket: number;
    cancellationRate: number;
  };
  daily: Array<{ date: string; revenue: number }>;
  topServices: Array<{ name: string; revenue: number; count: number }>;
  bySource: Array<{ source: string; count: number; pct: number }>;
  recent: Array<{
    id: string; reference: string; client_name: string;
    status: ReservationStatus; source: ReservationSource; total_price: number;
    appointment_date: string; appointment_time: string;
  }>;
}

const PERIODS: { key: Period; label: string }[] = [
  { key: '7d', label: '7 jours' },
  { key: '30d', label: '30 jours' },
  { key: 'month', label: 'Mois en cours' },
  { key: 'year', label: 'Année' },
];

function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function periodRange(p: Period): { start_date: string; end_date: string } {
  const now = new Date();
  const end = new Date(now);
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  if (p === '7d') start.setDate(end.getDate() - 6);
  else if (p === '30d') start.setDate(end.getDate() - 29);
  else if (p === 'month') {
    start.setDate(1);
  } else {
    start.setMonth(0, 1);
  }
  // Extend end to cover future confirmed within same period (year/month)
  const rangeEnd = new Date(end);
  if (p === 'month') {
    rangeEnd.setMonth(end.getMonth() + 1, 0);
  } else if (p === 'year') {
    rangeEnd.setMonth(11, 31);
  }
  return { start_date: isoDate(start), end_date: isoDate(rangeEnd) };
}

const SOURCE_COLORS: Record<string, string> = {
  site: '#B88F4D',
  telephone: '#A17E60',
  instagram: '#DDCCB2',
  autre: '#9FA392',
};

function useSessionState<T extends string>(key: string, initial: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    return (sessionStorage.getItem(key) as T) || initial;
  });
  const set = (next: T) => {
    setV(next);
    if (typeof window !== 'undefined') sessionStorage.setItem(key, next);
  };
  return [v, set];
}

export function StatsTab() {
  const [period, setPeriod] = useSessionState<Period>('admin-stats-period', '30d');
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchStats = useServerFn(getAdminStats);

  const range = useMemo(() => periodRange(period), [period]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchStats({ data: range });
      setData(res as StatsData);
    } catch (e: unknown) {
      setError(String((e as { message?: string })?.message ?? e));
    } finally {
      setLoading(false);
    }
  }, [fetchStats, range]);

  useEffect(() => { load(); }, [load]);

  const fmtEuro = (n: number) => `${Math.round(n).toLocaleString('fr-FR')} €`;
  const fmtDay = (iso: string) => {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };

  return (
    <section className="space-y-6">
      {/* Period picker */}
      <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 pb-1">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`h-9 px-4 rounded-full text-xs border shrink-0 transition-colors ${
              period === p.key
                ? 'bg-[#2A241C] text-white border-[#2A241C]'
                : 'bg-white text-[#2A241C] border-[#DDCCB2] hover:bg-[#EFE7D2]'
            }`}
          >
            {p.label}
          </button>
        ))}
        {loading && <Loader2 className="w-4 h-4 animate-spin text-[#B88F4D] shrink-0" />}
      </div>

      {error && (
        <div className="text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          Impossible de charger les statistiques.
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
        {loading && !data ? (
          Array.from({ length: 5 }).map((_, i) => <KpiSkeleton key={i} />)
        ) : data ? (
          <>
            <Kpi icon={Wallet} label="CA réalisé" value={fmtEuro(data.kpis.revenueDone)} accent />
            <Kpi icon={TrendingUp} label="CA prévisionnel" value={fmtEuro(data.kpis.revenueForecast)} />
            <Kpi icon={CalendarClock} label="Nombre de RDV" value={data.kpis.totalBookings.toString()} />
            <Kpi icon={Users} label="Panier moyen" value={fmtEuro(data.kpis.averageBasket)} />
            <Kpi icon={XCircle} label="Taux d'annulation" value={`${data.kpis.cancellationRate.toFixed(1)}%`} />
          </>
        ) : null}
      </div>

      {/* Revenue line chart */}
      <Card title="CA par jour" subtitle="Chiffre d'affaires réalisé (statut « Terminée »)">
        {loading && !data ? (
          <ChartSkeleton />
        ) : data && data.daily.some((d) => d.revenue > 0) ? (
          <div className="h-64 sm:h-72 -mx-2 sm:mx-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.daily} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                <CartesianGrid stroke="#EFE7D2" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickFormatter={fmtDay} tick={{ fill: '#8B7F6E', fontSize: 11 }}
                  axisLine={{ stroke: '#DDCCB2' }} tickLine={false} minTickGap={20} />
                <YAxis tick={{ fill: '#8B7F6E', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `${v}€`} width={48} />
                <Tooltip
                  formatter={(v: number) => [fmtEuro(v), 'CA']}
                  labelFormatter={(l: string) => formatDateFr(l)}
                  contentStyle={{ background: 'white', border: '1px solid #DDCCB2', borderRadius: 12, fontSize: 12 }}
                  cursor={{ stroke: '#B88F4D', strokeOpacity: 0.15, strokeWidth: 40 }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#B88F4D" strokeWidth={2.5}
                  dot={{ fill: '#B88F4D', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState label="Aucun CA réalisé sur la période" />
        )}
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Top services */}
        <Card title="CA par prestation" subtitle="Top 8 sur la période">
          {loading && !data ? (
            <ChartSkeleton />
          ) : data && data.topServices.length > 0 ? (
            <div className="h-64 sm:h-72 -mx-2 sm:mx-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topServices} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#EFE7D2" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#8B7F6E', fontSize: 11 }}
                    axisLine={false} tickLine={false} tickFormatter={(v) => `${v}€`} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#2A241C', fontSize: 11 }}
                    axisLine={false} tickLine={false} width={120}
                    tickFormatter={(v: string) => v.length > 18 ? v.slice(0, 17) + '…' : v} />
                  <Tooltip
                    formatter={(v: number) => [fmtEuro(v), 'CA']}
                    contentStyle={{ background: 'white', border: '1px solid #DDCCB2', borderRadius: 12, fontSize: 12 }}
                    cursor={{ fill: 'rgba(184,143,77,0.08)' }}
                  />
                  <Bar dataKey="revenue" fill="#B88F4D" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState label="Aucune prestation terminée sur la période" />
          )}
        </Card>

        {/* By source donut */}
        <Card title="RDV par canal" subtitle="Origine des réservations (hors annulées)">
          {loading && !data ? (
            <ChartSkeleton />
          ) : data && data.bySource.length > 0 ? (
            <div className="h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.bySource}
                    dataKey="count"
                    nameKey="source"
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="85%"
                    stroke="white"
                    strokeWidth={2}
                    paddingAngle={2}
                  >
                    {data.bySource.map((entry) => (
                      <Cell key={entry.source} fill={SOURCE_COLORS[entry.source] ?? '#9FA392'} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: number, _n: unknown, item: { payload?: { pct?: number } }) => {
                      const pct = item?.payload?.pct ?? 0;
                      return [`${v} (${pct.toFixed(1)}%)`, 'RDV'];
                    }}
                    contentStyle={{ background: 'white', border: '1px solid #DDCCB2', borderRadius: 12, fontSize: 12 }}
                  />
                  <Legend
                    formatter={(v: string) => SOURCE_LABEL[v as ReservationSource] ?? v}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState label="Aucune réservation sur la période" />
          )}
        </Card>
      </div>

      {/* Recent list */}
      <Card title="10 dernières réservations">
        {loading && !data ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-[#EFE7D2] animate-pulse" />
            ))}
          </div>
        ) : data && data.recent.length > 0 ? (
          <ul className="divide-y divide-[#EFE7D2] -mx-4 sm:-mx-6">
            {data.recent.map((r) => {
              const st = STATUS_STYLE[r.status];
              return (
                <li key={r.id} className="px-4 sm:px-6 py-3 flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#2A241C] truncate">{r.client_name}</p>
                    <p className="text-xs text-[#6E6455] truncate">
                      {formatDateFr(r.appointment_date)} · {r.appointment_time.slice(0, 5)} · #{r.reference}
                    </p>
                  </div>
                  <span className={`hidden sm:inline-flex items-center h-5 px-2 rounded-full text-[10px] font-medium border ${SOURCE_STYLE[r.source]}`}>
                    {SOURCE_LABEL[r.source]}
                  </span>
                  <span className={`inline-flex items-center h-5 px-2 rounded-full text-[10px] font-medium border ${st.bg} ${st.text} ${st.border}`}>
                    {STATUS_LABEL[r.status]}
                  </span>
                  <span className="text-sm font-semibold text-[#B88F4D] shrink-0 w-16 text-right">{Math.round(r.total_price)} €</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState label="Aucune réservation sur la période" />
        )}
      </Card>
    </section>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-[#DDCCB2] p-4 sm:p-6">
      <header className="mb-4">
        <h3 className="font-serif text-lg text-[#2A241C]">{title}</h3>
        {subtitle && <p className="text-xs text-[#6E6455] mt-0.5">{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}

function Kpi({ icon: Icon, label, value, accent }: {
  icon: typeof CalendarClock; label: string; value: string; accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-3 sm:p-4 ${
      accent ? 'bg-[#B88F4D] text-white border-[#B88F4D]' : 'bg-white text-[#2A241C] border-[#DDCCB2]'
    }`}>
      <div className="flex items-center justify-between gap-2">
        <p className={`text-[10px] uppercase tracking-widest ${accent ? 'text-white/85' : 'text-[#8B7F6E]'} truncate`}>
          {label}
        </p>
        <Icon className={`w-4 h-4 shrink-0 ${accent ? 'text-white/85' : 'text-[#B88F4D]'}`} />
      </div>
      <p className="mt-1 text-xl sm:text-2xl font-serif truncate">{value}</p>
    </div>
  );
}

function KpiSkeleton() {
  return <div className="h-[76px] sm:h-[92px] rounded-2xl bg-[#EFE7D2] animate-pulse" />;
}

function ChartSkeleton() {
  return <div className="h-64 sm:h-72 rounded-xl bg-[#EFE7D2] animate-pulse" />;
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="h-56 rounded-xl border border-dashed border-[#DDCCB2] bg-[#F6F0DF]/40 flex items-center justify-center">
      <p className="text-sm text-[#8B7F6E]">{label}</p>
    </div>
  );
}
