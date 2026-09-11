import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Clock,
  Plus,
  Check,
  Calendar,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Phone,
  CheckCircle2,
  X,
  Search,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { getAvailability, getAvailableSlots } from '@/lib/availability.functions';
import { SERVICE_CATALOG, CATALOG_CATEGORIES, type CatalogService } from '@/lib/service-catalog';

// Alias local pour lisibilité : la réservation consomme le catalogue partagé
// (source de vérité = src/data.ts → src/lib/service-catalog.ts).
type BookingService = CatalogService;

const RESERVATION_SERVICES: BookingService[] = SERVICE_CATALOG;
const CATEGORIES = CATALOG_CATEGORIES;

// Design tokens conformes Apple HIG :
// - min tap target 44px
// - body text ≥ 14px, labels ≥ 12px
// - hiérarchie lisible avec bon contraste

const GOLD = '#B88F4D';
const SAGE = '#A3A485';
const CREAM = '#EFE7D2';


const formatDuration = (mins: number) => {
  if (mins <= 0) return '—';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h${m > 0 ? String(m).padStart(2, '0') : ''}` : `${m} min`;
};

export default function ReservationView() {
  const [step, setStep] = useState<number>(1);
  const [selectedServices, setSelectedServices] = useState<BookingService[]>([]);
  const [selectedUpsells, setSelectedUpsells] = useState<string[]>([]);
  const [expandedServices, setExpandedServices] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [clientInfo, setClientInfo] = useState({ name: '', email: '', phone: '', note: '' });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('Tous');

  const [isSyncingSlots, setIsSyncingSlots] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingConfirmedDetails, setBookingConfirmedDetails] = useState<any | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // Mobile: panier tiroir ouvert/fermé
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Génère les 14 prochains jours
  const datesList = useMemo(() => {
    const dates = [];
    const locale = 'fr-FR';
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        dayName: d.toLocaleDateString(locale, { weekday: 'short' }).replace('.', ''),
        dayNum: d.toLocaleDateString(locale, { day: 'numeric' }),
        monthName: d.toLocaleDateString(locale, { month: 'short' }).replace('.', ''),
        fullIso: d.toISOString().split('T')[0],
      });
    }
    return dates;
  }, []);

  // Availability map (date iso -> open?) sourced from server
  const [openDates, setOpenDates] = useState<Record<string, boolean>>({});
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const totalDurationMin = useMemo(() => {
    return selectedServices.reduce((acc, s) => acc + s.duration_min, 0);
  }, [selectedServices]);


  // Fetch availability for each month spanned by datesList
  useEffect(() => {
    const months = Array.from(new Set(datesList.map((d) => d.fullIso.slice(0, 7))));
    let cancelled = false;
    (async () => {
      try {
        const results = await Promise.all(
          months.map((month) => getAvailability({ data: { month } })),
        );
        if (cancelled) return;
        const map: Record<string, boolean> = {};
        results.forEach((r) => {
          r.days.forEach((d) => {
            map[d.date] = d.open;
          });
        });
        setOpenDates(map);
      } catch (err) {
        console.error('availability fetch failed', err);
        setBookingError('La réservation en ligne est temporairement indisponible. Contactez l’institut par téléphone.');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [datesList]);

  const refreshSlots = useCallback(
    async (date: string) => {
      if (!date) {
        setAvailableSlots([]);
        return;
      }
      setIsSyncingSlots(true);
      try {
        const res = await getAvailableSlots({
          data: { date, duration_min: totalDurationMin || 60 },
        });
        setAvailableSlots(res.slots);
      } catch (err) {
        console.error('slots fetch failed', err);
        setAvailableSlots([]);
      } finally {
        setIsSyncingSlots(false);
      }
    },
    [totalDurationMin],
  );

  const handleDateClick = (isoString: string) => {
    if (openDates[isoString] === false) return;
    setSelectedDate(isoString);
    setSelectedTimeSlot('');
    void refreshSlots(isoString);
  };

  // Refresh slots when the selected duration changes for an already picked date
  useEffect(() => {
    if (selectedDate) void refreshSlots(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalDurationMin]);

  const isFormValid =
    clientInfo.name.trim().length > 2 &&
    clientInfo.email.includes('@') &&
    clientInfo.phone.trim().length >= 8;

  const handleToggleService = (service: BookingService) => {
    const isAlreadySelected = selectedServices.some(s => s.id === service.id);
    if (isAlreadySelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
      const serviceUpsellIds = service.upsells.map(u => u.id);
      setSelectedUpsells(selectedUpsells.filter(id => !serviceUpsellIds.includes(id)));
      setExpandedServices(expandedServices.filter(id => id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
      // Ouvre automatiquement les options si le service en a
      if (service.upsells.length > 0) {
        setExpandedServices([...expandedServices, service.id]);
      }
    }
  };

  const handleToggleUpsell = (upsellId: string) => {
    if (selectedUpsells.includes(upsellId)) {
      setSelectedUpsells(selectedUpsells.filter(id => id !== upsellId));
    } else {
      setSelectedUpsells([...selectedUpsells, upsellId]);
    }
  };

  const handleToggleExpand = (serviceId: string) => {
    if (expandedServices.includes(serviceId)) {
      setExpandedServices(expandedServices.filter(id => id !== serviceId));
    } else {
      setExpandedServices([...expandedServices, serviceId]);
    }
  };

  const getSubtotal = () => {
    let total = 0;
    selectedServices.forEach(service => {
      total += service.price;
      service.upsells.forEach(up => {
        if (selectedUpsells.includes(up.id)) total += up.price;
      });
    });
    return total;
  };

  const hasQuoteService = () => selectedServices.some(s => s.priceOnQuote);

  const formatTotal = () => {
    const sub = getSubtotal();
    if (!hasQuoteService()) return `${sub} €`;
    return sub > 0 ? `${sub} € + sur devis` : 'Sur devis';
  };


  const getTotalDurationMin = () => totalDurationMin;


  const filteredServices = RESERVATION_SERVICES.filter(service => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      service.name.toLowerCase().includes(q) ||
      service.description.toLowerCase().includes(q);
    const matchesCategory = activeCategory === 'Tous' || service.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const goToStep = (target: number) => {
    // Un utilisateur peut revenir librement en arrière, mais pas sauter en avant sans conditions
    if (target < step) {
      setStep(target);
      return;
    }
    if (target === 2 && selectedServices.length === 0) return;
    if (target === 3 && (!selectedDate || !selectedTimeSlot)) return;
    setStep(target);
  };

  const handleCompleteBooking = async () => {
    if (selectedServices.length === 0 || !selectedDate || !selectedTimeSlot || !isFormValid) return;
    setIsSubmitting(true);
    const reference = ''; // La référence définitive est générée par le serveur.
    const optionsList = selectedServices
      .flatMap(s => s.upsells)
      .filter(u => selectedUpsells.includes(u.id))
      .map(u => u.name);
    const durationMin = getTotalDurationMin();
    const totalPrice = getSubtotal();
    const priceLabel = formatTotal();
    const finalBooking = {
      id: reference,
      serviceName: selectedServices.map(s => s.name).join(' + '),
      price: totalPrice,
      priceLabel,

      date: selectedDate,
      time: selectedTimeSlot,
      duration: formatDuration(durationMin),
      durationMin,
      client: clientInfo,
      options: optionsList,
    };
    setBookingError(null);
    try {
      const res = await fetch('/api/public/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference,
          client_name: clientInfo.name.trim(),
          client_email: clientInfo.email.trim(),
          client_phone: clientInfo.phone.trim(),
          client_note: clientInfo.note?.trim() || null,
          services: selectedServices.map(s => ({ id: s.id, name: s.name, price: s.price, duration: s.duration_label })),
          options: optionsList,
          appointment_date: selectedDate,
          appointment_time: selectedTimeSlot,
          duration_min: durationMin,
          total_price: totalPrice,
        }),
      });
      if (!res.ok) {
        let msg = 'Nous n’avons pas pu enregistrer votre réservation. Merci de réessayer dans un instant ou de nous contacter directement.';
        try {
          const data = await res.json();
          if (data?.error && typeof data.error === 'string') msg = data.error;
        } catch {}
        console.error('reservation save failed', res.status, msg);
        setBookingError(msg);
        setIsSubmitting(false);
        if (res.status === 409) {
          // Conflict: refresh slots and force the user back to step 2
          setSelectedTimeSlot('');
          await refreshSlots(selectedDate);
          setStep(2);
        }
        return;
      }
      const saved: { reference: string } = await res.json();
      finalBooking.id = saved.reference;
    } catch (err) {
      console.error('reservation save failed', err);
      setBookingError('Connexion interrompue. Vérifiez votre réseau et réessayez.');
      setIsSubmitting(false);
      return;
    }
    setBookingConfirmedDetails(finalBooking);
    setIsSubmitting(false);
    setStep(4);
  };


  const computeEndHHMM = (time: string, durationMin: number) => {
    const [h, m] = time.split(':').map(Number);
    const total = h * 60 + m + (durationMin || 60);
    const endH = Math.floor(total / 60) % 24;
    const endM = total % 60;
    return `${String(endH).padStart(2, '0')}${String(endM).padStart(2, '0')}`;
  };

  const getGoogleCalendarUrl = (booking: any) => {
    const title = encodeURIComponent(`L'Atelier by Lola - ${booking.serviceName}`);
    const cleanedDate = booking.date.replace(/-/g, '');
    const cleanedTime = booking.time.replace(/:/g, '');
    const endTime = computeEndHHMM(booking.time, booking.durationMin);
    const startAndEnd = `${cleanedDate}T${cleanedTime}00/${cleanedDate}T${endTime}00`;
    const details = encodeURIComponent(
      `Rendez-vous à L'Atelier by Lola.\n\nPrestation(s) : ${booking.serviceName}\nOptions : ${booking.options.join(', ') || 'Aucune'}\nDurée : ${booking.duration}\nTotal : ${booking.priceLabel ?? booking.price + ' €'}`
    );
    const location = encodeURIComponent("L'Atelier by Lola, Le Pré-Saint-Gervais");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startAndEnd}&details=${details}&location=${location}`;
  };

  const getIcsFileUrl = (booking: any) => {
    const cleanedDate = booking.date.replace(/-/g, '');
    const cleanedTime = booking.time.replace(/:/g, '');
    const endTime = computeEndHHMM(booking.time, booking.durationMin);
    const icsText = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      "PRODID:-//LAtelier by Lola//Booking//FR",
      'BEGIN:VEVENT',
      `UID:${booking.id}@atelierbylola.com`,
      `DTSTAMP:${cleanedDate}T${cleanedTime}00`,
      `DTSTART:${cleanedDate}T${cleanedTime}00`,
      `DTEND:${cleanedDate}T${endTime}00`,
      `SUMMARY:L'Atelier by Lola - ${booking.serviceName}`,
      `DESCRIPTION:Prestations: ${booking.serviceName}\\nOptions: ${booking.options.join(', ')}\\nTotal: ${booking.priceLabel ?? booking.price + ' EUR'}`,
      `LOCATION:L'Atelier by Lola\\, Le Pré-Saint-Gervais`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n');
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsText)}`;
  };

  const totalCount = selectedServices.length + selectedUpsells.length;

  // ============================================================
  //   RENDU DES SECTIONS RÉCAP (Panier)
  // ============================================================

  const renderCartLines = (compact = false) => (
    <div className="space-y-3">
      {selectedServices.length === 0 ? (
        <div className="text-center py-6 flex flex-col items-center gap-2">
          <Sparkles className="h-5 w-5" style={{ color: GOLD, opacity: 0.5 }} />
          <p className="text-sm text-gray-500 italic">Aucun soin sélectionné</p>
        </div>
      ) : (
        <>
          {selectedServices.map(service => {
            const serviceUpsells = service.upsells.filter(u => selectedUpsells.includes(u.id));
            return (
              <div key={`cart-${service.id}`} className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-sm font-semibold text-charcoal leading-snug break-words">
                      {service.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {service.category} · {service.duration_label}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-serif text-sm font-bold whitespace-nowrap" style={{ color: GOLD }}>
                      {service.priceOnQuote ? 'Sur devis' : `${service.price} €`}
                    </span>
                    <button
                      onClick={() => handleToggleService(service)}
                      aria-label={`Retirer ${service.name}`}
                      className="h-8 w-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {serviceUpsells.length > 0 && (
                  <div className="pl-3 border-l-2 border-[#B88F4D]/20 space-y-1">
                    {serviceUpsells.map(u => (
                      <div key={`cart-up-${u.id}`} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 truncate pr-2">+ {u.name}</span>
                        <span className="font-semibold shrink-0" style={{ color: GOLD }}>
                          +{u.price} €
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {(selectedDate || selectedTimeSlot) && (
            <div className="pt-3 border-t border-slate-100">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1.5">
                Créneau
              </p>
              <div className="bg-[#EFE7D2]/60 rounded-xl p-3 space-y-0.5">
                {selectedDate && (
                  <p className="text-sm text-charcoal font-medium">
                    📅{' '}
                    {new Date(selectedDate).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </p>
                )}
                {selectedTimeSlot && (
                  <p className="text-sm font-bold" style={{ color: GOLD }}>
                    ⏰ {selectedTimeSlot}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Total</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Durée · {formatDuration(getTotalDurationMin())}
              </p>
            </div>
            <p className="font-serif text-2xl font-bold text-right" style={{ color: GOLD }}>
              {formatTotal()}
            </p>
          </div>


          {!compact && step !== 1 && (
            <button
              onClick={() => setStep(1)}
              className="w-full mt-2 h-11 rounded-xl border border-[#B88F4D]/30 text-[#B88F4D] text-sm font-semibold hover:bg-[#B88F4D]/5 transition flex items-center justify-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Ajouter / modifier un soin
            </button>
          )}
        </>
      )}
    </div>
  );

  // ============================================================
  //   RENDU DES STEPPERS
  // ============================================================

  const stepLabels = ['Rituels', 'Instant', 'Signature'];

  const renderStepper = () => (
    <div className="max-w-xl mx-auto mb-8">
      <div className="flex items-center justify-between gap-2">
        {stepLabels.map((label, i) => {
          const s = i + 1;
          const isActive = step === s;
          const isDone = step > s;
          const clickable = s < step || (s === 2 && selectedServices.length > 0) || (s === 3 && selectedDate && selectedTimeSlot);
          return (
            <button
              key={label}
              onClick={() => clickable && goToStep(s)}
              disabled={!clickable}
              className={`flex-1 flex items-center gap-2 h-11 px-3 rounded-xl transition ${
                isActive
                  ? 'bg-charcoal text-white'
                  : isDone
                  ? 'bg-[#B88F4D]/10 text-[#B88F4D] hover:bg-[#B88F4D]/15 cursor-pointer'
                  : 'bg-white text-gray-400 border border-slate-100'
              } ${!clickable && !isActive ? 'cursor-not-allowed' : ''}`}
            >
              <span
                className={`h-6 w-6 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                  isActive
                    ? 'bg-white text-charcoal'
                    : isDone
                    ? 'bg-[#B88F4D] text-white'
                    : 'bg-slate-100 text-gray-400'
                }`}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : s}
              </span>
              <span className="text-sm font-semibold truncate">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // ============================================================
  //   RENDU DE CHAQUE ÉTAPE
  // ============================================================

  const renderStep1 = () => (
    <motion.div
      key="step-1"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-serif text-2xl md:text-3xl text-charcoal font-medium leading-tight">
          Composez votre rituel
        </h2>
        <p className="text-sm text-gray-500 mt-1.5">
          Sélectionnez un ou plusieurs soins. Les finitions s'ajoutent au sein de chaque soin.
        </p>
      </div>

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un soin, une technique…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-11 pr-4 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B88F4D]/30 focus:border-[#B88F4D] bg-white placeholder:text-gray-500"
        />
      </div>

      {/* Catégories */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none snap-x">
        {CATEGORIES.map((cat) => (
          <button
            key={`cat-${cat}`}
            onClick={() => setActiveCategory(cat)}
            className={`h-10 px-4 rounded-full text-sm font-semibold whitespace-nowrap transition snap-start ${
              activeCategory === cat
                ? 'bg-[#B88F4D] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-gray-700 hover:border-[#B88F4D]/40'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Liste des services */}
      <div className="space-y-3">
        {filteredServices.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400 italic">
            Aucun soin ne correspond à votre recherche.
          </div>
        ) : (
          filteredServices.map((service) => {
            const isSelected = selectedServices.some(s => s.id === service.id);
            const isExpanded = expandedServices.includes(service.id);
            return (
              <div
                key={`service-${service.id}`}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isSelected
                    ? 'border-[#B88F4D] bg-white shadow-[0_2px_16px_rgba(184,143,77,0.10)]'
                    : 'border-slate-200 bg-white hover:border-[#B88F4D]/40'
                }`}
              >
                {/* Ligne principale (grid pour éviter les recouvrements sur mobile) */}
                <div className="p-4 md:p-5 grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-start">
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded"
                        style={{ color: GOLD, backgroundColor: `${GOLD}1A` }}
                      >
                        {service.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" /> {service.duration_label}
                      </span>
                    </div>
                    <h4 className="font-serif text-base md:text-lg font-semibold text-charcoal leading-snug">
                      {service.name}
                    </h4>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="font-serif text-lg md:text-xl font-bold whitespace-nowrap" style={{ color: GOLD }}>
                      {service.priceOnQuote ? 'Sur devis' : `${service.price} €`}
                    </span>
                    {service.priceNote && (
                      <span className="text-[10px] text-gray-500 italic text-right max-w-[140px] leading-tight">
                        {service.priceNote}
                      </span>
                    )}
                    <button
                      onClick={() => handleToggleService(service)}
                      aria-label={isSelected ? `Retirer ${service.name}` : `Ajouter ${service.name}`}
                      className={`h-11 w-11 rounded-full flex items-center justify-center transition font-semibold ${
                        isSelected
                          ? 'bg-[#B88F4D] text-white'
                          : 'bg-slate-50 text-gray-600 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Options inline (finitions) — apparaît quand le soin est sélectionné */}
                {isSelected && service.upsells.length > 0 && (
                  <div className="border-t border-slate-100 bg-[#FCFCFB]">
                    <button
                      onClick={() => handleToggleExpand(service.id)}
                      className="w-full h-12 px-4 md:px-5 flex items-center justify-between text-sm font-semibold text-charcoal hover:bg-slate-50 transition"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" style={{ color: GOLD }} />
                        Finitions & options
                        <span className="text-xs font-normal text-gray-500">
                          ({service.upsells.filter(u => selectedUpsells.includes(u.id)).length}/{service.upsells.length})
                        </span>
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 md:px-5 pb-4 space-y-2">
                            {service.upsells.map((up) => {
                              const isAdded = selectedUpsells.includes(up.id);
                              return (
                                <button
                                  key={up.id}
                                  onClick={() => handleToggleUpsell(up.id)}
                                  className={`w-full text-left p-3.5 rounded-xl border transition grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-center ${
                                    isAdded
                                      ? 'border-[#B88F4D] bg-white'
                                      : 'border-slate-200 bg-white hover:border-[#B88F4D]/40'
                                  }`}
                                >
                                  <div className="min-w-0">
                                    <p className="font-semibold text-sm text-charcoal">{up.name}</p>
                                    <p className="text-xs text-gray-500 leading-relaxed mt-0.5">
                                      {up.description}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="font-serif text-sm font-bold" style={{ color: GOLD }}>
                                      +{up.price} €
                                    </span>
                                    <div
                                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                        isAdded
                                          ? 'bg-[#B88F4D] text-white'
                                          : 'bg-slate-100 text-gray-500'
                                      }`}
                                    >
                                      {isAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      key="step-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-serif text-2xl md:text-3xl text-charcoal font-medium leading-tight">
          Choisissez votre instant
        </h2>
        <p className="text-sm text-gray-500 mt-1.5">
          Sélectionnez une date puis un créneau. Vous pouvez toujours{' '}
          <button
            onClick={() => setStep(1)}
            className="underline font-semibold"
            style={{ color: GOLD }}
          >
            ajouter un autre soin
          </button>
          .
        </p>
      </div>

      {/* Date scroller */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-semibold text-charcoal">Date</p>
          {selectedDate && (
            <p className="text-sm font-medium" style={{ color: GOLD }}>
              {new Date(selectedDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
          )}
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none snap-x">
          {datesList.map((d) => {
            const isSelected = selectedDate === d.fullIso;
            const isClosed = openDates[d.fullIso] === false;
            return (
              <button
                key={d.fullIso}
                onClick={() => handleDateClick(d.fullIso)}
                disabled={isClosed}
                aria-label={isClosed ? `${d.dayName} ${d.dayNum} ${d.monthName} — fermé` : undefined}
                className={`flex flex-col items-center justify-center min-w-[68px] h-[80px] rounded-2xl border transition snap-start ${
                  isSelected
                    ? 'border-charcoal bg-charcoal text-white shadow-md'
                    : isClosed
                    ? 'border-slate-100 bg-slate-50 text-gray-300 cursor-not-allowed line-through decoration-1'
                    : 'border-slate-200 bg-white hover:border-[#B88F4D]/40 text-gray-700'
                }`}
              >
                <span
                  className={`text-xs uppercase font-semibold ${
                    isSelected ? 'text-[#B88F4D]' : isClosed ? 'text-gray-300' : 'text-gray-500'
                  }`}
                >
                  {d.dayName}
                </span>
                <span className="font-serif text-2xl font-bold leading-none my-1">
                  {d.dayNum}
                </span>
                <span className="text-xs uppercase">{d.monthName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Créneaux */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-charcoal">Créneau disponible</p>

        {!selectedDate ? (
          <div className="border border-dashed border-[#B88F4D]/30 p-6 rounded-2xl text-center text-sm text-gray-500 bg-[#FCFCFB]">
            Sélectionnez d'abord une date pour afficher les horaires.
          </div>
        ) : isSyncingSlots ? (
          <div className="h-24 flex flex-col items-center justify-center gap-2 bg-[#FCFCFB] rounded-2xl border border-slate-100">
            <div className="h-5 w-5 border-2 border-t-transparent border-[#B88F4D] rounded-full animate-spin" />
            <span className="text-sm text-gray-500 italic">Lecture des disponibilités…</span>
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="border border-dashed border-[#B88F4D]/30 p-6 rounded-2xl text-center text-sm text-gray-500 bg-[#FCFCFB]">
            Aucun créneau disponible pour cette date. Merci d’en choisir une autre.
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-2.5">
            {availableSlots.map((slot) => {
              const isSelected = selectedTimeSlot === slot;
              return (
                <button
                  key={slot}
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`h-12 rounded-xl font-semibold text-sm border transition ${
                    isSelected
                      ? 'border-[#B88F4D] bg-[#B88F4D] text-white shadow-sm'
                      : 'border-slate-200 bg-white text-charcoal hover:border-[#B88F4D]/40'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );



  const renderStep3 = () => (
    <motion.div
      key="step-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-serif text-2xl md:text-3xl text-charcoal font-medium leading-tight">
          Vos coordonnées
        </h2>
        <p className="text-sm text-gray-500 mt-1.5">
          Pour la confirmation et le rappel SMS de votre rendez-vous.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-charcoal flex items-center gap-1.5">
              <User className="h-4 w-4" style={{ color: SAGE }} /> Prénom & Nom
            </label>
            <input
              type="text"
              required
              placeholder="Sophie Martin"
              value={clientInfo.name}
              onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
              className="w-full h-12 px-4 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B88F4D]/30 focus:border-[#B88F4D] bg-white placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-charcoal flex items-center gap-1.5">
              <Phone className="h-4 w-4" style={{ color: SAGE }} /> Portable
            </label>
            <input
              type="tel"
              required
              placeholder="06 12 34 56 78"
              value={clientInfo.phone}
              onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
              className="w-full h-12 px-4 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B88F4D]/30 focus:border-[#B88F4D] bg-white placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-charcoal flex items-center gap-1.5">
            <Mail className="h-4 w-4" style={{ color: SAGE }} /> Adresse e-mail
          </label>
          <input
            type="email"
            required
            placeholder="sophie@email.com"
            value={clientInfo.email}
            onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
            className="w-full h-12 px-4 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B88F4D]/30 focus:border-[#B88F4D] bg-white placeholder:text-gray-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-charcoal block">
            Message à Lola <span className="text-gray-400 font-normal">(optionnel)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Sensibilité, pression du massage, souhaits particuliers…"
            value={clientInfo.note}
            onChange={(e) => setClientInfo({ ...clientInfo, note: e.target.value })}
            className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B88F4D]/30 focus:border-[#B88F4D] bg-white placeholder:text-gray-500 resize-none"
          />
        </div>
      </div>

      <div className="p-4 bg-[#EFE7D2]/60 rounded-2xl text-sm text-gray-700 leading-relaxed">
        <strong className="text-charcoal">Politique de courtoisie :</strong> les modifications sont
        gratuites jusqu'à 24h avant votre rendez-vous. Aucun paiement en ligne, le règlement se fait
        directement à l'institut.
      </div>
    </motion.div>
  );

  const renderConfirmation = () => (
    <motion.div
      key="step-done"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-4 space-y-6"
    >
      <div
        className="mx-auto h-14 w-14 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${SAGE}22`, color: SAGE }}
      >
        <CheckCircle2 className="h-8 w-8" />
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-2xl md:text-3xl text-charcoal font-medium">
          Merci {bookingConfirmedDetails?.client.name.split(' ')[0]} !
        </h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Votre créneau est pré-réservé. Un SMS de confirmation vous parvient dans quelques minutes.
        </p>
      </div>

      {bookingConfirmedDetails && (
        <div className="max-w-md mx-auto bg-[#EFE7D2] rounded-2xl p-5 text-left space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-[#B88F4D]/20">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Ticket
              </p>
              <p className="font-mono text-sm font-semibold text-charcoal">
                {bookingConfirmedDetails.id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Date
              </p>
              <p className="font-serif text-sm font-semibold text-charcoal">
                {new Date(bookingConfirmedDetails.date).toLocaleDateString('fr-FR', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
              Prestations
            </p>
            <p className="font-serif text-base font-semibold text-charcoal leading-snug">
              {bookingConfirmedDetails.serviceName}
            </p>
          </div>

          {bookingConfirmedDetails.options.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1">
                Finitions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {bookingConfirmedDetails.options.map((option: string, i: number) => (
                  <span
                    key={`opt-con-${i}`}
                    className="text-xs font-semibold px-2 py-1 rounded"
                    style={{ color: SAGE, backgroundColor: `${SAGE}1A` }}
                  >
                    + {option}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-end pt-2 border-t border-[#B88F4D]/20">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Heure
              </p>
              <p className="font-serif text-lg font-bold" style={{ color: GOLD }}>
                {bookingConfirmedDetails.time}{' '}
                <span className="text-sm text-gray-500 font-normal">
                  ({bookingConfirmedDetails.duration})
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
                Total
              </p>
              <p className="font-serif text-xl font-bold text-charcoal">
                {bookingConfirmedDetails.priceLabel ?? `${bookingConfirmedDetails.price} €`}
              </p>
            </div>
          </div>
        </div>
      )}

      {bookingConfirmedDetails && (
        <div className="max-w-md mx-auto space-y-3">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5">
            <Calendar className="h-4 w-4" style={{ color: SAGE }} /> Ajouter à mon agenda
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={getGoogleCalendarUrl(bookingConfirmedDetails)}
              target="_blank"
              rel="noopener noreferrer"
              className="h-11 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-charcoal hover:border-[#B88F4D]/40 transition flex items-center justify-center gap-2"
            >
              <span className="h-2 w-2 rounded-full bg-red-500" /> Google
            </a>
            <a
              href={getIcsFileUrl(bookingConfirmedDetails)}
              download={`atelier_by_lola_${bookingConfirmedDetails.id}.ics`}
              className="h-11 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-charcoal hover:border-[#B88F4D]/40 transition flex items-center justify-center gap-2"
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: GOLD }} /> Apple / iCal
            </a>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-2">
        <button
          onClick={() => {
            setStep(1);
            setSelectedServices([]);
            setSelectedUpsells([]);
            setExpandedServices([]);
            setSelectedDate('');
            setSelectedTimeSlot('');
            setBookingConfirmedDetails(null);
          }}
          className="flex-1 h-12 rounded-xl bg-charcoal hover:bg-[#B88F4D] text-white text-sm font-semibold transition"
        >
          Prendre un autre rendez-vous
        </button>
      </div>
    </motion.div>
  );

  // ============================================================
  //   RENDU PRINCIPAL
  // ============================================================

  const primaryCtaLabel =
    step === 1
      ? 'Choisir mon instant'
      : step === 2
      ? 'Continuer'
      : isSubmitting
      ? 'Validation…'
      : 'Valider mon rendez-vous';

  const primaryCtaDisabled =
    (step === 1 && selectedServices.length === 0) ||
    (step === 2 && (!selectedDate || !selectedTimeSlot)) ||
    (step === 3 && (!isFormValid || isSubmitting));

  const handlePrimaryCta = () => {
    if (primaryCtaDisabled) return;
    if (step === 3) {
      handleCompleteBooking();
    } else {
      setStep(step + 1);
    }
  };

  const isConfirmed = step === 4 && bookingConfirmedDetails;

  return (
    <div
      id="reservation-view"
      className="w-full pt-20 md:pt-24 pb-32 md:pb-20 px-4 md:px-8 max-w-7xl mx-auto"
    >
      {/* En-tête */}
      <div className="text-center space-y-2 mb-8">
        <span
          className="text-xs uppercase tracking-[0.3em] font-bold"
          style={{ color: GOLD }}
        >
          L'Art de se coconner
        </span>
        <h1 className="font-serif text-3xl md:text-5xl text-charcoal font-light">
          Réservation
        </h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Composez votre parenthèse. Lola privatisera l'Atelier pour vous.
        </p>
      </div>

      {/* Stepper (masqué à la confirmation) */}
      {!isConfirmed && renderStepper()}

      {/* Layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* COLONNE GAUCHE : contenu de l'étape */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-3xl p-5 md:p-8 border border-[#B88F4D]/10 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
            <AnimatePresence mode="wait">
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {isConfirmed && renderConfirmation()}
            </AnimatePresence>
            {bookingError && step === 3 && !isConfirmed && (
              <div
                role="alert"
                className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                <strong className="font-semibold">Réservation non enregistrée.</strong>{' '}
                {bookingError}
              </div>
            )}

            {/* Navigation bas de carte (masquée sur mobile car sticky bar en bas) */}
            {!isConfirmed && (
              <div className="hidden md:flex mt-8 pt-5 border-t border-slate-100 items-center justify-between gap-3">
                {step > 1 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="h-12 px-5 rounded-xl bg-slate-50 hover:bg-slate-100 text-charcoal text-sm font-semibold transition flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" /> Retour
                  </button>
                ) : (
                  <span className="text-sm text-gray-500">
                    {selectedServices.length > 0
                      ? `${selectedServices.length} soin${selectedServices.length > 1 ? 's' : ''} sélectionné${selectedServices.length > 1 ? 's' : ''}`
                      : 'Sélectionnez au moins un soin'}
                  </span>
                )}
                <button
                  onClick={handlePrimaryCta}
                  disabled={primaryCtaDisabled}
                  className="h-12 px-6 rounded-xl bg-charcoal hover:bg-[#B88F4D] text-white text-sm font-semibold transition disabled:bg-slate-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {primaryCtaLabel} <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* COLONNE DROITE : Panier sticky (desktop) */}
        {!isConfirmed && (
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-3xl p-5 border border-[#B88F4D]/10 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-base font-semibold text-charcoal">
                    Votre panier
                  </h3>
                  <Sparkles className="h-4 w-4" style={{ color: GOLD }} />
                </div>
                {renderCartLines()}
              </div>

              <div className="p-4 bg-[#EFE7D2]/50 rounded-2xl flex items-start gap-2.5">
                <CheckCircle2
                  className="h-4 w-4 shrink-0 mt-0.5"
                  style={{ color: SAGE }}
                />
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong className="text-charcoal">Sans engagement.</strong> Aucun paiement en
                  ligne — règlement à l'institut.
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Barre sticky bas mobile (panier + CTA) */}
      {!isConfirmed && (
        <>
          {/* Fond du drawer quand ouvert */}
          <AnimatePresence>
            {isCartOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCartOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/40 z-40"
              />
            )}
          </AnimatePresence>

          {/* Drawer panier mobile */}
          <AnimatePresence>
            {isCartOpen && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="lg:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh] flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.15)]"
              >
                <div className="px-5 pt-3 pb-2 flex flex-col items-center">
                  <div className="h-1 w-10 rounded-full bg-slate-200 mb-3" />
                  <div className="w-full flex items-center justify-between">
                    <h3 className="font-serif text-lg font-semibold text-charcoal">
                      Votre panier
                    </h3>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      aria-label="Fermer le panier"
                      className="h-10 w-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-slate-100"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="px-5 pb-5 overflow-y-auto flex-1">
                  {renderCartLines()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Barre bas mobile permanente */}
          <div
            className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            <div className="px-4 py-3 flex items-center gap-3">
              <button
                onClick={() => setIsCartOpen(true)}
                disabled={selectedServices.length === 0}
                className="flex-1 min-w-0 h-12 rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-between px-3.5 gap-2"
              >
                <div className="flex flex-col items-start min-w-0">
                  <span className="text-xs text-gray-500 font-medium">
                    {totalCount > 0 ? `${selectedServices.length} soin${selectedServices.length > 1 ? 's' : ''}` : 'Panier'}
                  </span>
                  <span
                    className="font-serif text-base font-bold leading-none"
                    style={{ color: GOLD }}
                  >
                    {formatTotal()}
                  </span>

                </div>
                <ChevronUp className="h-4 w-4 text-gray-500 shrink-0" />
              </button>

              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  aria-label="Retour"
                  className="h-12 w-12 shrink-0 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition"
                >
                  <ArrowLeft className="h-5 w-5 text-charcoal" />
                </button>
              )}

              <button
                onClick={handlePrimaryCta}
                disabled={primaryCtaDisabled}
                className="flex-[1.4] min-w-0 h-12 rounded-xl bg-charcoal hover:bg-[#B88F4D] disabled:bg-slate-200 disabled:text-gray-400 text-white text-sm font-semibold transition flex items-center justify-center gap-1.5 px-3"
              >
                <span className="truncate">
                  {step === 1 && 'Continuer'}
                  {step === 2 && 'Continuer'}
                  {step === 3 && (isSubmitting ? '…' : 'Valider')}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
