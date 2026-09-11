export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'done';
export type PaymentStatus = 'unpaid' | 'paid';
export type PaymentMethod = 'cb' | 'especes' | 'planity' | 'autre' | null;
export type ReservationSource = 'site' | 'telephone' | 'instagram' | 'autre';

export interface AdminReservation {
  id: string;
  reference: string;
  status: ReservationStatus;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_note: string | null;
  services: Array<{ id?: string; name: string; price: number; duration?: string }>;
  options: string[];
  appointment_date: string;
  appointment_time: string;
  duration_min: number;
  total_price: number;
  source: ReservationSource;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  created_at: string;
}

export const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  done: 'Terminée',
  cancelled: 'Annulée',
};

export const STATUS_STYLE: Record<ReservationStatus, { bg: string; text: string; border: string; block: string }> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', block: 'bg-amber-100/90 border-amber-300 text-amber-900' },
  confirmed: { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', block: 'bg-emerald-100/90 border-emerald-300 text-emerald-900' },
  done: { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-neutral-200', block: 'bg-neutral-100 border-neutral-300 text-neutral-600' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-200', block: 'bg-red-50 border-red-200 text-red-800 line-through opacity-60' },
};

export const SOURCE_LABEL: Record<ReservationSource, string> = {
  site: 'Site',
  telephone: 'Téléphone',
  instagram: 'Instagram',
  autre: 'Autre',
};

export const SOURCE_STYLE: Record<ReservationSource, string> = {
  site: 'bg-[#EFE7D2] text-[#B88F4D] border-[#DDCCB2]',
  telephone: 'bg-sky-50 text-sky-800 border-sky-200',
  instagram: 'bg-pink-50 text-pink-800 border-pink-200',
  autre: 'bg-neutral-100 text-neutral-700 border-neutral-200',
};

export function formatDateFr(iso: string): string {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString('fr-FR', {
      weekday: 'short', day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function toMinutes(t: string): number {
  const [h, m] = t.slice(0, 5).split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function toHHMM(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
