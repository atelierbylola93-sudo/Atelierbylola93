import { getRouteApi } from '@tanstack/react-router';
import { CATALOGUE_DE_REPLI } from './booking-validation';
import { pourAffichage, categoriesDe, type PrestationBase, type PrestationAffichee } from './catalogue';

const racine = getRouteApi('__root__');

/**
 * Catalogue vivant, chargé une seule fois par la route racine.
 *
 * Retombe sur le catalogue figé dans le code si la base n'a pas répondu :
 * mieux vaut afficher les tarifs de référence qu'une page vide.
 *
 * Les prix rendus sont ceux du jour, promotions comprises.
 */
export function useCatalogue(): PrestationAffichee[] {
  const data = racine.useLoaderData() as { catalogue?: PrestationBase[] } | undefined;
  const brut = data?.catalogue && data.catalogue.length > 0 ? data.catalogue : CATALOGUE_DE_REPLI;
  return brut.map((p) => pourAffichage(p));
}

/** Catégories du catalogue, dans l'ordre d'affichage, précédées de « Tous ». */
export function useCategoriesCatalogue(): string[] {
  const data = racine.useLoaderData() as { catalogue?: PrestationBase[] } | undefined;
  const brut = data?.catalogue && data.catalogue.length > 0 ? data.catalogue : CATALOGUE_DE_REPLI;
  return ['Tous', ...categoriesDe(brut)];
}
