import { useMemo } from 'react';
import { useCatalogue } from '@/lib/use-catalogue';
import { formatJour } from '@/lib/catalogue';

/**
 * Prix affiché sur les pages de prestations.
 *
 * Les pages portent leur propre contenu rédactionnel, tarifs compris. Ces
 * tarifs étaient donc une seconde source de vérité, qui pouvait diverger de
 * celle appliquée à la réservation — une cliente aurait lu un prix et payé
 * l'autre.
 *
 * Le catalogue en base fait désormais foi : le prix écrit dans la page ne sert
 * plus que de repli si la prestation n'y est pas retrouvée. Les promotions en
 * cours apparaissent ici comme dans le tunnel de réservation.
 */
function normaliser(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

interface Props {
  /** Nom de la prestation, tel qu'écrit dans la page. */
  nom: string;
  /** Tarif écrit dans la page, utilisé seulement en repli. */
  prix: number | string;
  /** Mention accolée au tarif, par exemple « / séance ». */
  suffixe?: string;
}

export default function PrixVitrine({ nom, prix, suffixe }: Props) {
  const catalogue = useCatalogue();

  const prestation = useMemo(() => {
    const cible = normaliser(nom);

    // 1. Correspondance exacte.
    const exact = catalogue.find((c) => normaliser(c.name) === cible);
    if (exact) return exact;

    // 2. La page ajoute parfois une mention décorative — « Formule MAX WHITE
    //    (Recommandé) » désigne bien « Formule MAX WHITE ». On accepte donc
    //    qu'un nom du catalogue soit le début du nom affiché, en retenant le
    //    plus long pour éviter qu'un intitulé court n'attrape trop large.
    const prefixes = catalogue
      .filter((c) => cible.startsWith(normaliser(c.name)))
      .sort((x, y) => y.name.length - x.name.length);
    if (prefixes.length) return prefixes[0];

    // 3. Certaines lignes de la vitrine sont des finitions, pas des
    //    prestations : on les cherche aussi, sans promotion possible.
    for (const c of catalogue) {
      const f = c.upsells.find((u) => normaliser(u.name) === cible);
      if (f) {
        return {
          ...c,
          id: f.id,
          name: f.name,
          price: f.price,
          priceOnQuote: false,
          enPromo: false,
          prixBarre: null,
          finPromo: null,
          remise: null,
        };
      }
    }

    return undefined;
  }, [catalogue, nom]);

  const mention = suffixe ? (
    <span className="text-[10px] text-gray-500 font-normal"> {suffixe}</span>
  ) : null;

  // Aucune correspondance : on rend ce que la page annonce.
  if (!prestation) {
    return <>{typeof prix === 'number' ? `${prix} €` : prix}{mention}</>;
  }

  if (prestation.priceOnQuote) {
    return <>Sur devis</>;
  }

  if (!prestation.enPromo) {
    return <>{prestation.price} €{mention}</>;
  }

  return (
    <span className="inline-flex flex-wrap items-baseline justify-end gap-x-2 gap-y-1">
      {prestation.prixBarre !== null && (
        <span className="text-sm font-normal text-gray-400 line-through">{prestation.prixBarre} €</span>
      )}
      <span className="text-[#9E2B25]">{prestation.price} €{mention}</span>
      {prestation.remise !== null && (
        <span className="inline-flex items-center rounded-full bg-[#9E2B25] px-2 py-0.5 text-[11px] font-bold text-white whitespace-nowrap">
          −{prestation.remise} %
          {prestation.finPromo ? ` jusqu'au ${formatJour(prestation.finPromo)}` : ''}
        </span>
      )}
    </span>
  );
}
