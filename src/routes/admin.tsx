import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState, useCallback } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { CalendarDays, ListChecks, SlidersHorizontal, BarChart3, LogOut, Plus, RefreshCw } from 'lucide-react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { listReservations } from '@/lib/admin.functions';
import { AgendaTab } from '@/components/admin/AgendaTab';
import { ReservationsTab } from '@/components/admin/ReservationsTab';
import { AvailabilityTab } from '@/components/admin/AvailabilityTab';
import { StatsTab } from '@/components/admin/StatsTab';
import { ManualReservationDialog } from '@/components/admin/ManualReservationDialog';
import type { AdminReservation } from '@/components/admin/types';

export const Route = createFileRoute('/admin')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'Espace patron' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  component: AdminPage,
});

type TabKey = 'agenda' | 'reservations' | 'disponibilites' | 'stats';

const TABS: { key: TabKey; label: string; icon: typeof CalendarDays }[] = [
  { key: 'agenda', label: 'Agenda', icon: CalendarDays },
  { key: 'reservations', label: 'Réservations', icon: ListChecks },
  { key: 'disponibilites', label: 'Disponibilités', icon: SlidersHorizontal },
  { key: 'stats', label: 'Statistiques', icon: BarChart3 },
];

function AdminPage() {
  const navigate = useNavigate();
  const list = useServerFn(listReservations);

  const [tab, setTab] = useState<TabKey>('agenda');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<AdminReservation[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [manualOpen, setManualOpen] = useState(false);
  const [manualPrefill, setManualPrefill] = useState<{ date?: string; time?: string } | undefined>();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { reservations } = await list();
      setItems(reservations as unknown as AdminReservation[]);
    } catch (e: unknown) {
      const msg = String((e as { message?: string })?.message ?? e);
      if (msg.includes('Unauthorized')) {
        navigate({ to: '/login' });
        return;
      }
      if (msg.includes('Forbidden')) {
        setError("Accès refusé — ce compte n'a pas les droits admin.");
      } else {
        setError('Impossible de charger les réservations.');
      }
    } finally {
      setLoading(false);
    }
  }, [list, navigate]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        navigate({ to: '/login' });
        return;
      }
      setUserEmail(data.session.user.email ?? '');
      load();
    });
  }, [navigate, load]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: '/login' });
  };

  const openManualAt = (date?: string, time?: string) => {
    setManualPrefill({ date, time });
    setManualOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F6F0DF] text-[#2A241C]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-[#EFE7D2]/95 backdrop-blur border-b border-[#DDCCB2]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="min-w-0 flex items-center gap-3">
            <div className="hidden sm:flex h-10 w-10 rounded-full bg-[#B88F4D] text-white items-center justify-center font-serif text-lg">L</div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#B88F4D] font-semibold">Espace patron</p>
              <h1 className="text-lg sm:text-xl font-serif text-[#2A241C] truncate">
                {TABS.find((t) => t.key === tab)?.label}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-xs text-[#6E6455] truncate max-w-[200px]">{userEmail}</span>
            <button
              onClick={() => openManualAt()}
              className="h-10 px-3 sm:px-4 rounded-full bg-[#B88F4D] text-white text-sm font-medium hover:bg-[#A17E60] transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nouveau RDV</span>
            </button>
            <button
              onClick={load}
              className="h-10 w-10 sm:w-auto sm:px-3 rounded-full border border-[#DDCCB2] bg-white text-[#2A241C] hover:bg-[#EFE7D2] transition-colors inline-flex items-center justify-center gap-1.5"
              aria-label="Actualiser"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleSignOut}
              className="h-10 w-10 sm:w-auto sm:px-3 rounded-full bg-[#2A241C] text-white hover:bg-[#3A2F26] transition-colors inline-flex items-center justify-center gap-1.5"
              aria-label="Déconnexion"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline text-sm">Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex md:w-56 lg:w-64 shrink-0 flex-col gap-1 py-6 pr-4 pl-4 sm:pl-6 sticky top-[73px] self-start h-[calc(100vh-73px)]">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`h-11 px-4 rounded-xl text-left inline-flex items-center gap-3 text-sm transition-colors ${
                  active
                    ? 'bg-[#2A241C] text-white shadow-sm'
                    : 'text-[#2A241C] hover:bg-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {t.label}
              </button>
            );
          })}
          <div className="mt-auto text-[11px] text-[#8B7F6E] px-4">
            <p className="truncate">{userEmail}</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-4 sm:py-6 pb-24 md:pb-10">
          {error && (
            <div className="mb-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {error}
            </div>
          )}
          {tab === 'agenda' && (
            <AgendaTab
              reservations={items}
              loading={loading}
              onOpenReservation={(r) => setSelectedResv(r)}
              onOpenEmptySlot={openManualAt}
            />
          )}
          {tab === 'reservations' && (
            <ReservationsTab
              reservations={items}
              loading={loading}
              onChange={load}
            />
          )}
          {tab === 'disponibilites' && <AvailabilityTab />}
          {tab === 'stats' && <StatsTab />}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-[#DDCCB2] shadow-[0_-8px_24px_rgba(42,36,28,0.06)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="grid grid-cols-4">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex flex-col items-center justify-center gap-1 h-16 text-[11px] transition-colors ${
                  active ? 'text-[#B88F4D]' : 'text-[#6E6455]'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.2]' : ''}`} />
                <span className={active ? 'font-semibold' : ''}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <ManualReservationDialog
        open={manualOpen}
        onOpenChange={setManualOpen}
        prefill={manualPrefill}
        onCreated={() => {
          toast.success('Réservation créée');
          load();
        }}
      />

      <Toaster richColors position="top-center" />

      {/* Global reservation detail sheet used across tabs */}
      <ReservationDetailPortal reservations={items} onChange={load} />
    </div>
  );

  function setSelectedResv(_r: AdminReservation) {
    // handled via portal (kept simple: emit custom event)
    const evt = new CustomEvent('admin:open-reservation', { detail: _r });
    window.dispatchEvent(evt);
  }
}

// Wraps the detail sheet listening to a global event so multiple tabs can
// open the same sheet without prop-drilling.
import { ReservationDetailSheet } from '@/components/admin/ReservationDetailSheet';
function ReservationDetailPortal({ reservations, onChange }: { reservations: AdminReservation[]; onChange: () => void }) {
  const [current, setCurrent] = useState<AdminReservation | null>(null);
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<AdminReservation>).detail;
      setCurrent(detail);
    };
    window.addEventListener('admin:open-reservation', handler);
    return () => window.removeEventListener('admin:open-reservation', handler);
  }, []);
  // keep in sync when items refresh
  useEffect(() => {
    if (!current) return;
    const fresh = reservations.find((r) => r.id === current.id);
    if (fresh) setCurrent(fresh);
  }, [reservations, current]);
  return (
    <ReservationDetailSheet
      reservation={current}
      onClose={() => setCurrent(null)}
      onChange={onChange}
    />
  );
}
