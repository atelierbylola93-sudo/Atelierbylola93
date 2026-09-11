import { useEffect, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { X, Trash2, Loader2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  updateReservationStatus, updateReservationPayment, deleteReservation,
} from '@/lib/admin.functions';
import {
  type AdminReservation, type PaymentMethod, type PaymentStatus, type ReservationStatus,
  STATUS_LABEL, STATUS_STYLE, SOURCE_LABEL, SOURCE_STYLE, formatDateFr,
} from './types';

interface Props {
  reservation: AdminReservation | null;
  onClose: () => void;
  onChange: () => void;
}

const STATUSES: ReservationStatus[] = ['pending', 'confirmed', 'done', 'cancelled'];
const METHODS: Array<{ v: Exclude<PaymentMethod, null>; label: string }> = [
  { v: 'cb', label: 'CB' }, { v: 'especes', label: 'Espèces' },
  { v: 'planity', label: 'Planity' }, { v: 'autre', label: 'Autre' },
];

export function ReservationDetailSheet({ reservation, onClose, onChange }: Props) {
  const statusFn = useServerFn(updateReservationStatus);
  const payFn = useServerFn(updateReservationPayment);
  const delFn = useServerFn(deleteReservation);

  const [savingStatus, setSavingStatus] = useState(false);
  const [savingPay, setSavingPay] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [payStatus, setPayStatus] = useState<PaymentStatus>('unpaid');
  const [payMethod, setPayMethod] = useState<PaymentMethod>(null);

  useEffect(() => {
    if (reservation) {
      setPayStatus(reservation.payment_status);
      setPayMethod(reservation.payment_method);
    }
  }, [reservation]);

  if (!reservation) return null;

  const r = reservation;
  const st = STATUS_STYLE[r.status];

  const setStatus = async (s: ReservationStatus) => {
    setSavingStatus(true);
    try {
      await statusFn({ data: { id: r.id, status: s } });
      toast.success('Statut mis à jour');
      onChange();
    } catch { toast.error('Mise à jour impossible'); }
    finally { setSavingStatus(false); }
  };

  const savePay = async (nextStatus: PaymentStatus, nextMethod: PaymentMethod) => {
    setPayStatus(nextStatus); setPayMethod(nextMethod);
    setSavingPay(true);
    try {
      await payFn({ data: { id: r.id, payment_status: nextStatus, payment_method: nextMethod } });
      toast.success('Paiement mis à jour');
      onChange();
    } catch { toast.error('Mise à jour impossible'); }
    finally { setSavingPay(false); }
  };

  const doDelete = async () => {
    setDeleting(true);
    try {
      await delFn({ data: { id: r.id } });
      toast.success('Réservation supprimée');
      onChange();
      onClose();
    } catch { toast.error('Suppression impossible'); }
    finally { setDeleting(false); setConfirmDel(false); }
  };

  return (
    <Sheet open onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col bg-[#F6F0DF] border-l border-[#DDCCB2]">
        {/* Header */}
        <header className="px-5 py-4 border-b border-[#DDCCB2] bg-white flex items-center gap-3 sticky top-0">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#B88F4D] font-semibold">Réservation</p>
            <h2 className="font-serif text-xl text-[#2A241C] truncate">{r.client_name}</h2>
            <p className="text-xs text-[#6E6455] mt-0.5 inline-flex items-center gap-1">
              #{r.reference}
              <button
                onClick={() => { navigator.clipboard.writeText(r.reference); toast.success('Référence copiée'); }}
                className="ml-1 h-5 w-5 rounded-full inline-flex items-center justify-center hover:bg-[#EFE7D2]"
                aria-label="Copier référence"
              >
                <Copy className="w-3 h-3" />
              </button>
            </p>
          </div>
          <span className={`inline-flex items-center h-6 px-2 rounded-full text-[11px] font-medium border ${st.bg} ${st.text} ${st.border}`}>
            {STATUS_LABEL[r.status]}
          </span>
          <button onClick={onClose} className="h-9 w-9 rounded-full bg-[#EFE7D2] inline-flex items-center justify-center shrink-0" aria-label="Fermer">
            <X className="w-4 h-4" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-2">
            <MetaCard label="Date">{formatDateFr(r.appointment_date)}</MetaCard>
            <MetaCard label="Heure">{r.appointment_time}</MetaCard>
            <MetaCard label="Durée">{r.duration_min} min</MetaCard>
            <MetaCard label="Total">{r.total_price} €</MetaCard>
          </div>

          {/* Client */}
          <Card title="Contact">
            <Row label="Téléphone">
              <a href={`tel:${r.client_phone}`} className="text-[#B88F4D] underline underline-offset-2">{r.client_phone}</a>
            </Row>
            {r.client_email && (
              <Row label="Email">
                <a href={`mailto:${r.client_email}`} className="text-[#B88F4D] underline underline-offset-2 break-all">{r.client_email}</a>
              </Row>
            )}
            <Row label="Source">
              <span className={`inline-flex items-center h-5 px-2 rounded-full text-[10px] font-medium border ${SOURCE_STYLE[r.source]}`}>
                {SOURCE_LABEL[r.source]}
              </span>
            </Row>
            {r.client_note && (
              <Row label="Note">
                <p className="text-sm text-[#2A241C] whitespace-pre-wrap">{r.client_note}</p>
              </Row>
            )}
          </Card>

          {/* Services */}
          <Card title="Prestations">
            <ul className="divide-y divide-[#EFE7D2]">
              {r.services.map((s, i) => (
                <li key={i} className="py-2 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#2A241C]">{s.name}</p>
                    {s.duration && <p className="text-xs text-[#6E6455]">{s.duration}</p>}
                  </div>
                  <p className="text-sm font-semibold text-[#B88F4D] shrink-0">{s.price} €</p>
                </li>
              ))}
            </ul>
            {r.options.length > 0 && (
              <div className="mt-2 pt-2 border-t border-[#EFE7D2]">
                <p className="text-[10px] uppercase tracking-widest text-[#8B7F6E] mb-1">Options</p>
                <div className="flex flex-wrap gap-1">
                  {r.options.map((o, i) => (
                    <span key={i} className="inline-flex h-6 px-2 rounded-full bg-[#EFE7D2] text-[11px] text-[#2A241C] items-center">{o}</span>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Statut */}
          <Card title="Statut">
            <div className="flex flex-wrap gap-1.5">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  disabled={savingStatus || r.status === s}
                  onClick={() => setStatus(s)}
                  className={`h-9 px-3 rounded-full text-xs border transition-colors ${
                    r.status === s
                      ? 'bg-[#2A241C] text-white border-[#2A241C]'
                      : 'bg-white text-[#2A241C] border-[#DDCCB2] hover:bg-[#EFE7D2]'
                  } disabled:opacity-60`}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
              {savingStatus && <Loader2 className="w-4 h-4 animate-spin text-[#B88F4D] self-center" />}
            </div>
          </Card>

          {/* Paiement */}
          <Card title="Paiement">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(['unpaid', 'paid'] as PaymentStatus[]).map((s) => (
                <button
                  key={s}
                  disabled={savingPay}
                  onClick={() => savePay(s, s === 'paid' ? (payMethod ?? 'cb') : null)}
                  className={`h-9 px-3 rounded-full text-xs border transition-colors ${
                    payStatus === s
                      ? s === 'paid'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white text-[#2A241C] border-[#DDCCB2] hover:bg-[#EFE7D2]'
                  } disabled:opacity-60`}
                >
                  {s === 'paid' ? 'Payé' : 'À payer'}
                </button>
              ))}
            </div>
            {payStatus === 'paid' && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#8B7F6E] mb-1">Méthode</p>
                <div className="flex flex-wrap gap-1.5">
                  {METHODS.map((m) => (
                    <button
                      key={m.v}
                      disabled={savingPay}
                      onClick={() => savePay('paid', m.v)}
                      className={`h-8 px-3 rounded-full text-xs border transition-colors ${
                        payMethod === m.v
                          ? 'bg-[#B88F4D] text-white border-[#B88F4D]'
                          : 'bg-white text-[#2A241C] border-[#DDCCB2] hover:bg-[#EFE7D2]'
                      } disabled:opacity-60`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Footer */}
        <footer className="px-5 py-3 border-t border-[#DDCCB2] bg-white flex items-center gap-2">
          <button
            onClick={() => setConfirmDel(true)}
            disabled={deleting}
            className="h-11 px-4 rounded-full border border-red-200 text-red-700 bg-white hover:bg-red-50 text-sm inline-flex items-center gap-2 disabled:opacity-60"
          >
            <Trash2 className="w-4 h-4" /> Supprimer
          </button>
          <button
            onClick={onClose}
            className="ml-auto h-11 px-5 rounded-full bg-[#2A241C] text-white text-sm hover:bg-[#3a3227]"
          >
            Fermer
          </button>
        </footer>

        <AlertDialog open={confirmDel} onOpenChange={setConfirmDel}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer cette réservation ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Le créneau redeviendra libre.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={doDelete} disabled={deleting} className="bg-red-600 hover:bg-red-700">
                {deleting ? 'Suppression…' : 'Supprimer'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SheetContent>
    </Sheet>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-[#DDCCB2] p-4">
      <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#B88F4D] font-semibold mb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function MetaCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-[#DDCCB2] px-3 py-2">
      <p className="text-[10px] uppercase tracking-widest text-[#8B7F6E]">{label}</p>
      <p className="text-sm font-semibold text-[#2A241C]">{children}</p>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs text-[#8B7F6E] shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-right min-w-0 flex-1">{children}</span>
    </div>
  );
}
