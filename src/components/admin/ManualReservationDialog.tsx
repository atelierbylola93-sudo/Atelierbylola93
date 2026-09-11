import { useCallback, useEffect, useMemo, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { X, Loader2, Check, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SERVICE_CATALOG, CATALOG_CATEGORIES, formatCatalogDuration, type CatalogService } from '@/lib/service-catalog';
import { getAvailableSlots } from '@/lib/availability.functions';
import { createManualReservation } from '@/lib/admin.functions';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  prefill?: { date?: string; time?: string };
  onCreated: () => void;
}

type Source = 'telephone' | 'instagram' | 'autre' | 'site';

export function ManualReservationDialog({ open, onOpenChange, prefill, onCreated }: Props) {
  const slotsFn = useServerFn(getAvailableSlots);
  const createFn = useServerFn(createManualReservation);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('Tous');
  const [selected, setSelected] = useState<CatalogService[]>([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [source, setSource] = useState<Source>('telephone');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Reset when opening
  useEffect(() => {
    if (!open) return;
    setName(''); setPhone(''); setEmail(''); setNote('');
    setCategory('Tous'); setSelected([]);
    setDate(prefill?.date ?? '');
    setTime(prefill?.time ?? '');
    setSource('telephone');
    setSlots([]);
  }, [open, prefill]);

  const duration_min = useMemo(() => selected.reduce((s, x) => s + x.duration_min, 0), [selected]);
  const total_price = useMemo(() => selected.reduce((s, x) => s + x.price, 0), [selected]);

  const loadSlots = useCallback(async (d: string, dur: number) => {
    if (!d || dur <= 0) { setSlots([]); return; }
    setLoadingSlots(true);
    try {
      const res = await slotsFn({ data: { date: d, duration_min: dur } });
      setSlots(res.slots);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [slotsFn]);

  useEffect(() => {
    if (date && duration_min > 0) loadSlots(date, duration_min);
    else setSlots([]);
    // if prefilled time is not in the returned slots we clear it
  }, [date, duration_min, loadSlots]);

  // Keep prefilled time if server confirms it, otherwise clear
  useEffect(() => {
    if (!time) return;
    if (slots.length > 0 && !slots.includes(time)) setTime('');
  }, [slots, time]);

  const toggleService = (s: CatalogService) => {
    setSelected((prev) => prev.some((x) => x.id === s.id) ? prev.filter((x) => x.id !== s.id) : [...prev, s]);
  };

  const filteredCatalog = category === 'Tous' ? SERVICE_CATALOG : SERVICE_CATALOG.filter((s) => s.category === category);

  const canSubmit = name.trim().length > 0 && phone.trim().length >= 6 && selected.length > 0 && date && time && !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await createFn({ data: {
        client_name: name.trim(),
        client_phone: phone.trim(),
        client_email: email.trim() || undefined,
        client_note: note.trim() || null,
        services: selected.map((s) => ({ id: s.id, name: s.name, price: s.price, duration_min: s.duration_min })),
        appointment_date: date,
        appointment_time: time,
        source,
      } });
      onCreated();
      onOpenChange(false);
    } catch (e: unknown) {
      const msg = String((e as { message?: string })?.message ?? e);
      if (msg.includes('CONFLICT')) {
        toast.error('Créneau indisponible — choisissez-en un autre');
        loadSlots(date, duration_min);
        setTime('');
      } else {
        toast.error('Création impossible');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="px-5 sm:px-7 py-4 border-b border-[#DDCCB2] sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#B88F4D] font-semibold">Nouveau RDV</p>
              <DialogTitle className="font-serif text-xl text-[#2A241C] mt-1">Créer une réservation</DialogTitle>
            </div>
            <button onClick={() => onOpenChange(false)} className="h-9 w-9 rounded-full bg-[#EFE7D2] inline-flex items-center justify-center" aria-label="Fermer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="p-5 sm:p-7 space-y-6">
          {/* Client */}
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Nom *">
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} required
                className="h-11 w-full px-3 rounded-lg border border-[#DDCCB2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]" />
            </Field>
            <Field label="Téléphone *">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} required inputMode="tel"
                className="h-11 w-full px-3 rounded-lg border border-[#DDCCB2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]" />
            </Field>
            <Field label="Email (optionnel)">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255}
                className="h-11 w-full px-3 rounded-lg border border-[#DDCCB2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]" />
            </Field>
            <Field label="Source">
              <select value={source} onChange={(e) => setSource(e.target.value as Source)}
                className="h-11 w-full px-3 rounded-lg border border-[#DDCCB2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]">
                <option value="telephone">Téléphone</option>
                <option value="instagram">Instagram</option>
                <option value="autre">Autre</option>
                <option value="site">Site</option>
              </select>
            </Field>
          </div>

          {/* Services */}
          <div>
            <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
              <p className="text-[10px] uppercase tracking-widest text-[#8B7F6E]">Prestations *</p>
              <div className="flex gap-1 overflow-x-auto max-w-full">
                {CATALOG_CATEGORIES.map((c) => (
                  <button key={c} onClick={() => setCategory(c)}
                    className={`h-7 px-2.5 rounded-full text-[11px] shrink-0 border transition-colors ${
                      category === c ? 'bg-[#2A241C] text-white border-[#2A241C]' : 'bg-white text-[#2A241C] border-[#DDCCB2] hover:bg-[#EFE7D2]'
                    }`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <ul className="space-y-1.5">
              {filteredCatalog.map((s) => {
                const on = selected.some((x) => x.id === s.id);
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => toggleService(s)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border flex items-center gap-3 transition-colors ${
                        on ? 'bg-[#B88F4D]/10 border-[#B88F4D]' : 'bg-white border-[#DDCCB2] hover:bg-[#EFE7D2]/60'
                      }`}
                    >
                      <span className={`h-6 w-6 rounded-full inline-flex items-center justify-center shrink-0 ${
                        on ? 'bg-[#B88F4D] text-white' : 'bg-white border border-[#DDCCB2] text-[#8B7F6E]'
                      }`}>
                        {on ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-medium text-[#2A241C] truncate">{s.name}</span>
                        <span className="block text-xs text-[#6E6455]">{formatCatalogDuration(s.duration_min)} • {s.category}</span>
                      </span>
                      <span className="text-sm font-semibold text-[#B88F4D]">{s.priceOnQuote ? 'Sur devis' : `${s.price} €`}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {selected.length > 0 && (
              <div className="mt-3 p-3 rounded-lg bg-[#F6F0DF] border border-[#DDCCB2] flex items-center justify-between">
                <div className="text-xs text-[#6E6455]">
                  {selected.length} prestation{selected.length > 1 ? 's' : ''} • {formatCatalogDuration(duration_min)}
                </div>
                <div className="text-base font-semibold text-[#B88F4D]">{selected.some((x) => x.priceOnQuote) ? (total_price > 0 ? `${total_price} € + sur devis` : 'Sur devis') : `${total_price} €`}</div>
              </div>
            )}
          </div>

          {/* Date + slot */}
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Date *">
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                className="h-11 w-full px-3 rounded-lg border border-[#DDCCB2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]" />
            </Field>
            <Field label={`Créneau * ${loadingSlots ? '(chargement…)' : selected.length === 0 ? '(sélectionnez une prestation)' : ''}`}>
              {slots.length === 0 ? (
                <div className="h-11 px-3 rounded-lg border border-dashed border-[#DDCCB2] bg-[#F6F0DF] text-xs text-[#8B7F6E] inline-flex items-center">
                  {loadingSlots ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : null}
                  {!date ? 'Choisissez une date' : selected.length === 0 ? 'Choisissez une prestation' : 'Aucun créneau disponible'}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
                  {slots.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setTime(s)}
                      className={`h-9 px-3 rounded-full text-xs border transition-colors ${
                        time === s ? 'bg-[#2A241C] text-white border-[#2A241C]' : 'bg-white text-[#2A241C] border-[#DDCCB2] hover:bg-[#EFE7D2]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </Field>
          </div>

          <Field label="Note (optionnel)">
            <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={1000} rows={2}
              className="w-full px-3 py-2 rounded-lg border border-[#DDCCB2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]" />
          </Field>
        </div>

        <div className="px-5 sm:px-7 py-4 border-t border-[#DDCCB2] flex items-center gap-2 sticky bottom-0 bg-white">
          <button
            onClick={() => onOpenChange(false)}
            className="h-11 px-5 rounded-full border border-[#DDCCB2] bg-white text-sm hover:bg-[#EFE7D2]"
          >
            Annuler
          </button>
          <button
            onClick={submit}
            disabled={!canSubmit}
            className="ml-auto h-11 px-6 rounded-full bg-[#B88F4D] text-white text-sm font-medium hover:bg-[#A17E60] disabled:opacity-40 inline-flex items-center gap-2"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Confirmer le RDV
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-widest text-[#8B7F6E] mb-1">{label}</span>
      {children}
    </label>
  );
}

// Silence unused-import for the Minus icon we may want later
void Minus;
