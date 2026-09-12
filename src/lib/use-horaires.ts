import { getRouteApi } from '@tanstack/react-router';
import type { JourOuverture } from './opening-hours';

const racine = getRouteApi('__root__');

/**
 * Horaires chargés une seule fois par la route racine.
 *
 * Rend un tableau vide si la lecture a échoué : l'appelant affiche alors son
 * texte de repli plutôt que de faire tomber la page.
 */
export function useHoraires(): JourOuverture[] {
  const data = racine.useLoaderData() as { hours?: JourOuverture[] } | undefined;
  return data?.hours ?? [];
}
