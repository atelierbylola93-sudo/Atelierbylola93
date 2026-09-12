// Mise en forme des horaires d'ouverture.
//
// Les horaires étaient écrits en dur à trois endroits (pied de page, bloc
// contact, données structurées) et annonçaient « lundi au dimanche, 9h-20h »
// alors que la base disait « lundi au samedi, 10h-19h, fermé le dimanche ».
// Une cliente lisait donc des horaires que le moteur de réservation refusait,
// et Google affichait une ouverture le dimanche devant une porte close.
//
// Tout part désormais de la base. Ce module ne fait que présenter.

export interface JourOuverture {
  weekday: number;
  is_open: boolean;
  open_time: string;
  close_time: string;
  break_start: string | null;
  break_end: string | null;
}

const JOURS_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const JOURS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** '10:00:00' -> '10h00' */
export function formatHeure(t: string): string {
  const [h, m] = t.slice(0, 5).split(':');
  return `${Number(h)}h${m}`;
}

/** Ordre d'affichage français : lundi d'abord, dimanche en dernier. */
function ordreFr(j: JourOuverture) {
  return j.weekday === 0 ? 7 : j.weekday;
}

/** Signature d'une journée, pour regrouper les jours identiques. */
function signature(j: JourOuverture): string {
  if (!j.is_open) return 'ferme';
  const pause = j.break_start && j.break_end ? `|${j.break_start}-${j.break_end}` : '';
  return `${j.open_time}-${j.close_time}${pause}`;
}

/**
 * Regroupe les jours consécutifs partageant les mêmes horaires.
 * Rend par exemple : ['Lundi – Samedi : 10h00 – 19h00', 'Dimanche : fermé']
 */
export function resumerHoraires(jours: JourOuverture[]): string[] {
  if (!jours.length) return [];
  const tries = [...jours].sort((a, b) => ordreFr(a) - ordreFr(b));

  const groupes: { debut: JourOuverture; fin: JourOuverture }[] = [];
  for (const j of tries) {
    const dernier = groupes[groupes.length - 1];
    if (dernier && signature(dernier.fin) === signature(j) && ordreFr(j) === ordreFr(dernier.fin) + 1) {
      dernier.fin = j;
    } else {
      groupes.push({ debut: j, fin: j });
    }
  }

  return groupes.map(({ debut, fin }) => {
    const nom =
      debut.weekday === fin.weekday
        ? JOURS_FR[debut.weekday]
        : `${JOURS_FR[debut.weekday]} – ${JOURS_FR[fin.weekday]}`;
    if (!debut.is_open) return `${nom} : fermé`;
    const plage = `${formatHeure(debut.open_time)} – ${formatHeure(debut.close_time)}`;
    if (debut.break_start && debut.break_end) {
      return `${nom} : ${plage} (pause ${formatHeure(debut.break_start)} – ${formatHeure(debut.break_end)})`;
    }
    return `${nom} : ${plage}`;
  });
}

/** Version courte, sur une ligne, pour le pied de page. */
export function resumerHorairesCourt(jours: JourOuverture[]): string {
  const lignes = resumerHoraires(jours);
  return lignes.length ? `${lignes.join(' · ')} — sur rendez-vous` : '';
}

/**
 * Données structurées pour Google. Une pause déjeuner produit deux plages
 * distinctes dans la journée, ce que schema.org attend.
 */
export function horairesJsonLd(jours: JourOuverture[]) {
  const specs: Array<{ '@type': string; dayOfWeek: string; opens: string; closes: string }> = [];
  for (const j of jours) {
    if (!j.is_open) continue;
    const jour = JOURS_EN[j.weekday];
    const h = (t: string) => t.slice(0, 5);
    if (j.break_start && j.break_end) {
      specs.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: jour, opens: h(j.open_time), closes: h(j.break_start) });
      specs.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: jour, opens: h(j.break_end), closes: h(j.close_time) });
    } else {
      specs.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: jour, opens: h(j.open_time), closes: h(j.close_time) });
    }
  }
  return specs;
}

/**
 * Résumé en deux mots pour un bandeau de chiffres.
 *
 * Retient le plus grand groupe de jours ouverts consécutifs — celui qui
 * représente le rythme habituel de l'institut.
 * Rend par exemple : { jours: 'Lun – Sam', horaires: '10h00 – 19h00' }
 */
export function resumeCompact(jours: JourOuverture[]): { jours: string; horaires: string } | null {
  const ouverts = jours.filter((j) => j.is_open);
  if (!ouverts.length) return null;

  const tries = [...ouverts].sort((a, b) => ordreFr(a) - ordreFr(b));
  const groupes: JourOuverture[][] = [];
  for (const j of tries) {
    const dernier = groupes[groupes.length - 1];
    const precedent = dernier?.[dernier.length - 1];
    if (precedent && signature(precedent) === signature(j) && ordreFr(j) === ordreFr(precedent) + 1) {
      dernier.push(j);
    } else {
      groupes.push([j]);
    }
  }

  const principal = groupes.sort((a, b) => b.length - a.length)[0];
  const court = (w: number) => JOURS_FR[w].slice(0, 3);
  const debut = principal[0];
  const fin = principal[principal.length - 1];

  return {
    jours: principal.length === 1 ? JOURS_FR[debut.weekday] : `${court(debut.weekday)} – ${court(fin.weekday)}`,
    horaires: `${formatHeure(debut.open_time)} – ${formatHeure(debut.close_time)}`,
  };
}
