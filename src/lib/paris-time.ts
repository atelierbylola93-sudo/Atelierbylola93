/**
 * Date et heure à Paris.
 *
 * Extrait de booking-validation pour que le catalogue puisse s'en servir sans
 * créer de dépendance circulaire : le catalogue a besoin de la date du jour
 * pour savoir si une promotion court, et la validation de réservation a besoin
 * du catalogue pour calculer un prix.
 *
 * L'heure serveur n'est pas utilisable telle quelle : Vercel exécute en UTC,
 * et une réservation à 00h30 heure de Paris tomberait la veille.
 */
export function parisNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(now);
  const value = (type: string) => parts.find((p) => p.type === type)!.value;
  return {
    date: `${value('year')}-${value('month')}-${value('day')}`,
    time: `${value('hour')}:${value('minute')}`,
  };
}
