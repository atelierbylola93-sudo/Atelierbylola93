import { useCallback, useEffect, useMemo, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Search, Loader2, Tag, Percent, ChevronDown, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  listCatalogueAdmin, updateService, setServicePromo, updateUpsell,
} from '@/lib/admin.functions';
import { formatDuree, formatJour, prixEffectif } from '@/lib/catalogue';

interface ServiceRow {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration_min: number;
  duration_label: string;
  price_on_quote: boolean;
  price_note: string | null;
  active: boolean;
  promo_price: number | null;
  promo_start: string | null;
  promo_end: string | null;
}

interface UpsellRow {
  id: string;
  service_id: string;
  name: string;
  price: number;
  active: boolean;
}

const aujourdhui = () => new Date().toISOString().slice(0, 10);
const dansUnMois = () => {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
};

export function CatalogueTab() {
  const charger = useServerFn(listCatalogueAdmin);
  const enregistrer = useServerFn(updateService);
  const promotionner = useServerFn(setServicePromo);
  const majFinition = useServerFn(updateUpsell);

  const [services, setServices] = useState<ServiceRow[]>([]);
  const [upsells, setUpsells] = useState<UpsellRow[]>([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState('');
  const [ouvert, setOuvert] = useState<string | null>(null);

  const load = useCallback(async () => {
    setChargement(true);
    try {
      const r = await charger();
      setServices(r.services as unknown as ServiceRow[]);
      setUpsells(r.upsells as unknown as UpsellRow[]);
    } catch (e) {
      toast.error('Chargement du catalogue impossible');
      console.error(e);
    } finally {
      setChargement(false);
    }
  }, [charger]);

  useEffect(() => { load(); }, [load]);

  const filtres = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    if (!q) return services;
    return services.filter(
      (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q),
    );
  }, [services, recherche]);

  const parCategorie = useMemo(() => {
    const m = new Map<string, ServiceRow[]>();
    for (const s of filtres) {
      const l = m.get(s.category) ?? [];
      l.push(s);
      m.set(s.category, l);
    }
    return [...m.entries()];
  }, [filtres]);

  const nbPromos = services.filter((s) => prixEffectif(s).enPromo).length;

  return (
    <section className="space-y-4">
      {/* Barre d'outils */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-lg text-[#2A241C]">Prestations et tarifs</h2>
          <p className="text-xs text-[#6E6455]">
            {services.length} prestations · {nbPromos > 0 ? `${nbPromos} promotion${nbPromos > 1 ? 's' : ''} en cours` : 'aucune promotion en cours'}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7F6E]" />
          <input
            type="search"
            placeholder="Chercher une prestation"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="h-11 pl-9 pr-3 rounded-full border border-[#DDCCB2] bg-white text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#B88F4D]"
          />
        </div>
      </div>

      <div className="rounded-xl border border-[#DDCCB2] bg-[#FBF7EF] px-4 py-3 text-xs text-[#6E6455]">
        Un tarif modifié ici s'applique immédiatement sur le site et dans les rendez-vous à venir.
        <strong className="text-[#2A241C]"> Les réservations déjà enregistrées gardent le prix pratiqué le jour où elles ont été prises.</strong>
      </div>

      {chargement && (
        <div className="flex items-center gap-2 text-sm text-[#6E6455]">
          <Loader2 className="w-4 h-4 animate-spin" /> Chargement…
        </div>
      )}

      {parCategorie.map(([categorie, liste]) => (
        <div key={categorie} className="bg-white rounded-2xl border border-[#DDCCB2] overflow-hidden">
          <header className="px-5 py-3 border-b border-[#EFE7D2] bg-[#FBF7EF] flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#B88F4D]" />
            <h3 className="font-serif text-base text-[#2A241C]">{categorie}</h3>
            <span className="ml-auto text-[11px] text-[#8B7F6E]">{liste.length}</span>
          </header>
          <ul className="divide-y divide-[#EFE7D2]">
            {liste.map((s) => (
              <LignePrestation
                key={s.id}
                service={s}
                finitions={upsells.filter((u) => u.service_id === s.id)}
                ouvert={ouvert === s.id}
                onToggle={() => setOuvert(ouvert === s.id ? null : s.id)}
                onEnregistre={enregistrer}
                onPromo={promotionner}
                onFinition={majFinition}
                onRecharger={load}
              />
            ))}
          </ul>
        </div>
      ))}

      {!chargement && filtres.length === 0 && (
        <div className="text-center py-16 text-[#6E6455] bg-white/60 rounded-2xl border border-[#DDCCB2]">
          Aucune prestation ne correspond à cette recherche.
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------- ligne

interface LigneProps {
  service: ServiceRow;
  finitions: UpsellRow[];
  ouvert: boolean;
  onToggle: () => void;
  onEnregistre: ReturnType<typeof useServerFn<typeof updateService>>;
  onPromo: ReturnType<typeof useServerFn<typeof setServicePromo>>;
  onFinition: ReturnType<typeof useServerFn<typeof updateUpsell>>;
  onRecharger: () => void;
}

function LignePrestation({
  service, finitions, ouvert, onToggle, onEnregistre, onPromo, onFinition, onRecharger,
}: LigneProps) {
  const [prix, setPrix] = useState(String(service.price));
  const [duree, setDuree] = useState(String(service.duration_min));
  const [enregistrement, setEnregistrement] = useState(false);

  const [promoPrix, setPromoPrix] = useState(service.promo_price !== null ? String(service.promo_price) : '');
  const [promoDebut, setPromoDebut] = useState(service.promo_start ?? aujourdhui());
  const [promoFin, setPromoFin] = useState(service.promo_end ?? dansUnMois());
  const [promoEnCours, setPromoEnCours] = useState(false);

  useEffect(() => {
    setPrix(String(service.price));
    setDuree(String(service.duration_min));
    setPromoPrix(service.promo_price !== null ? String(service.promo_price) : '');
    setPromoDebut(service.promo_start ?? aujourdhui());
    setPromoFin(service.promo_end ?? dansUnMois());
  }, [service]);

  const etat = prixEffectif(service);
  const modifie = Number(prix) !== Number(service.price) || Number(duree) !== service.duration_min;

  const sauver = async () => {
    setEnregistrement(true);
    try {
      await onEnregistre({ data: { id: service.id, price: Number(prix), duration_min: Number(duree) } });
      toast.success(`${service.name} mis à jour`);
      onRecharger();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Enregistrement impossible');
    } finally {
      setEnregistrement(false);
    }
  };

  const basculerActif = async () => {
    try {
      await onEnregistre({ data: { id: service.id, active: !service.active } });
      toast.success(service.active ? 'Prestation masquée du site' : 'Prestation remise en ligne');
      onRecharger();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Modification impossible');
    }
  };

  const poserPromo = async () => {
    setPromoEnCours(true);
    try {
      await onPromo({
        data: {
          id: service.id,
          promo_price: Number(promoPrix),
          promo_start: promoDebut,
          promo_end: promoFin,
        },
      });
      toast.success('Promotion enregistrée');
      onRecharger();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Promotion refusée');
    } finally {
      setPromoEnCours(false);
    }
  };

  const retirerPromo = async () => {
    setPromoEnCours(true);
    try {
      await onPromo({ data: { id: service.id, promo_price: null, promo_start: null, promo_end: null } });
      toast.success('Promotion retirée');
      onRecharger();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Retrait impossible');
    } finally {
      setPromoEnCours(false);
    }
  };

  return (
    <li className={service.active ? '' : 'bg-[#FAF8F4]'}>
      {/* Résumé cliquable */}
      <button
        onClick={onToggle}
        className="w-full text-left px-5 py-3.5 flex items-center gap-3 hover:bg-[#FBF7EF] transition-colors min-h-[56px]"
      >
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-medium truncate ${service.active ? 'text-[#2A241C]' : 'text-[#8B7F6E] line-through'}`}>
            {service.name}
          </p>
          <p className="text-[11px] text-[#8B7F6E]">
            {formatDuree(service.duration_min)}
            {service.price_on_quote && ' · sur devis'}
            {!service.active && ' · masquée du site'}
          </p>
        </div>

        <div className="text-right shrink-0">
          {etat.enPromo ? (
            <>
              <span className="text-[11px] text-[#8B7F6E] line-through block leading-none">{etat.prixBarre} €</span>
              <span className="text-sm font-bold text-[#9E2B25]">{etat.prix} €</span>
            </>
          ) : (
            <span className="text-sm font-semibold text-[#B88F4D]">
              {service.price_on_quote ? 'Sur devis' : `${service.price} €`}
            </span>
          )}
        </div>

        {etat.enPromo && (
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-[#9E2B25] px-2 py-0.5 text-[10px] font-bold text-white">
            <Percent className="w-3 h-3" /> promo
          </span>
        )}

        <ChevronDown className={`w-4 h-4 text-[#8B7F6E] shrink-0 transition-transform ${ouvert ? 'rotate-180' : ''}`} />
      </button>

      {/* Édition */}
      {ouvert && (
        <div className="px-5 pb-5 space-y-4 bg-[#FBF7EF] border-t border-[#EFE7D2]">
          {/* Tarif et durée */}
          <div className="pt-4 flex flex-wrap items-end gap-3">
            <label className="block">
              <span className="block text-[10px] uppercase tracking-widest text-[#8B7F6E] mb-1">Tarif (€)</span>
              <input
                type="number" min={0} step={1} inputMode="decimal"
                value={prix}
                onChange={(e) => setPrix(e.target.value)}
                className="h-11 w-28 px-3 rounded-lg border border-[#DDCCB2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]"
              />
            </label>
            <label className="block">
              <span className="block text-[10px] uppercase tracking-widest text-[#8B7F6E] mb-1">Durée (min)</span>
              <input
                type="number" min={5} step={5} inputMode="numeric"
                value={duree}
                onChange={(e) => setDuree(e.target.value)}
                className="h-11 w-28 px-3 rounded-lg border border-[#DDCCB2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]"
              />
            </label>
            <button
              onClick={sauver}
              disabled={!modifie || enregistrement}
              className="h-11 px-4 rounded-lg bg-[#2A241C] text-white text-sm font-medium disabled:opacity-40 inline-flex items-center gap-2"
            >
              {enregistrement ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Enregistrer
            </button>
            <button
              onClick={basculerActif}
              className="h-11 px-4 rounded-lg border border-[#DDCCB2] bg-white text-sm text-[#2A241C] hover:bg-[#EFE7D2] ml-auto"
            >
              {service.active ? 'Masquer du site' : 'Remettre en ligne'}
            </button>
          </div>

          {/* Promotion */}
          <div className="rounded-xl border border-[#DDCCB2] bg-white p-4">
            <div className="flex items-center gap-2 mb-3">
              <Percent className="w-4 h-4 text-[#B88F4D]" />
              <h4 className="text-sm font-semibold text-[#2A241C]">Promotion</h4>
              {etat.enPromo && etat.finPromo && (
                <span className="ml-auto text-[11px] text-[#9E2B25] font-medium">
                  en cours jusqu'au {formatJour(etat.finPromo)}
                </span>
              )}
            </div>

            {service.price_on_quote ? (
              <p className="text-xs text-[#8B7F6E]">
                Prestation sur devis : le tarif est fixé au diagnostic, une promotion n'a pas de sens ici.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap items-end gap-3">
                  <label className="block">
                    <span className="block text-[10px] uppercase tracking-widest text-[#8B7F6E] mb-1">Tarif promo (€)</span>
                    <input
                      type="number" min={0} step={1} inputMode="decimal"
                      value={promoPrix}
                      onChange={(e) => setPromoPrix(e.target.value)}
                      placeholder={String(Math.round(service.price * 0.8))}
                      className="h-11 w-28 px-3 rounded-lg border border-[#DDCCB2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-[10px] uppercase tracking-widest text-[#8B7F6E] mb-1">Du</span>
                    <input
                      type="date" value={promoDebut}
                      onChange={(e) => setPromoDebut(e.target.value)}
                      className="h-11 px-3 rounded-lg border border-[#DDCCB2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-[10px] uppercase tracking-widest text-[#8B7F6E] mb-1">Au</span>
                    <input
                      type="date" value={promoFin}
                      onChange={(e) => setPromoFin(e.target.value)}
                      className="h-11 px-3 rounded-lg border border-[#DDCCB2] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#B88F4D]"
                    />
                  </label>
                  <button
                    onClick={poserPromo}
                    disabled={promoEnCours || !promoPrix || Number(promoPrix) >= service.price}
                    className="h-11 px-4 rounded-lg bg-[#9E2B25] text-white text-sm font-medium disabled:opacity-40 inline-flex items-center gap-2"
                  >
                    {promoEnCours ? <Loader2 className="w-4 h-4 animate-spin" /> : <Percent className="w-4 h-4" />}
                    Appliquer
                  </button>
                  {service.promo_price !== null && (
                    <button
                      onClick={retirerPromo}
                      disabled={promoEnCours}
                      className="h-11 px-4 rounded-lg border border-[#DDCCB2] bg-white text-sm text-[#2A241C] hover:bg-[#EFE7D2] inline-flex items-center gap-2"
                    >
                      <X className="w-4 h-4" /> Retirer
                    </button>
                  )}
                </div>
                <p className="mt-2 text-[11px] text-[#8B7F6E]">
                  La date de fin est obligatoire : la promotion s'arrête toute seule, sans risque de l'oublier.
                  {promoPrix && Number(promoPrix) >= service.price && (
                    <span className="block text-[#9E2B25] font-medium mt-1">
                      Le tarif promo doit être inférieur à {service.price} €.
                    </span>
                  )}
                </p>
              </>
            )}
          </div>

          {/* Finitions */}
          {finitions.length > 0 && (
            <div className="rounded-xl border border-[#DDCCB2] bg-white p-4">
              <h4 className="text-sm font-semibold text-[#2A241C] mb-3">Finitions proposées</h4>
              <ul className="space-y-2">
                {finitions.map((f) => (
                  <LigneFinition key={f.id} finition={f} onMaj={onFinition} onRecharger={onRecharger} />
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

// ---------------------------------------------------------------- finition

function LigneFinition({
  finition, onMaj, onRecharger,
}: {
  finition: UpsellRow;
  onMaj: ReturnType<typeof useServerFn<typeof updateUpsell>>;
  onRecharger: () => void;
}) {
  const [prix, setPrix] = useState(String(finition.price));
  const [occupe, setOccupe] = useState(false);
  useEffect(() => { setPrix(String(finition.price)); }, [finition]);

  const sauver = async () => {
    setOccupe(true);
    try {
      await onMaj({ data: { id: finition.id, price: Number(prix) } });
      toast.success('Finition mise à jour');
      onRecharger();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Enregistrement impossible');
    } finally {
      setOccupe(false);
    }
  };

  return (
    <li className="flex items-center gap-3">
      <span className="text-sm text-[#2A241C] flex-1 min-w-0 truncate">{finition.name}</span>
      <input
        type="number" min={0} step={1} inputMode="decimal"
        value={prix}
        onChange={(e) => setPrix(e.target.value)}
        className="h-10 w-24 px-2 rounded-lg border border-[#DDCCB2] bg-white text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#B88F4D]"
      />
      <span className="text-sm text-[#8B7F6E]">€</span>
      <button
        onClick={sauver}
        disabled={occupe || Number(prix) === Number(finition.price)}
        className="h-10 px-3 rounded-lg bg-[#2A241C] text-white text-xs disabled:opacity-40"
      >
        {occupe ? '…' : 'OK'}
      </button>
    </li>
  );
}
