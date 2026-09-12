-- Deux protections sur les réservations.
--
-- 1. Corbeille : supprimer ne doit plus effacer.
--    La base n'a pas de sauvegarde automatique (plan gratuit). Une suppression
--    définitive depuis l'espace patron serait donc irrattrapable.
--
-- 2. Anti-chevauchement au niveau de la base.
--    Le contrôle applicatif lit les réservations, calcule, puis insère. Entre
--    la lecture et l'insertion, deux requêtes simultanées peuvent passer toutes
--    les deux. Une contrainte d'exclusion rend le chevauchement impossible
--    quelle que soit la concurrence.

-- ---------- 1. Corbeille ----------

ALTER TABLE public.reservations
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- Les écrans et les calculs de disponibilité ne lisent que les lignes vivantes.
CREATE INDEX IF NOT EXISTS reservations_not_deleted_idx
  ON public.reservations (appointment_date)
  WHERE deleted_at IS NULL;

-- ---------- 2. Anti-chevauchement ----------

CREATE EXTENSION IF NOT EXISTS btree_gist;

-- appointment_time est stocké en texte ('HH:MM'). La fonction est déclarée
-- IMMUTABLE : la conversion texte -> time est déterministe pour ce format,
-- condition nécessaire pour l'employer dans une contrainte d'exclusion.
-- La durée nulle ou à zéro vaut 60 minutes, comme dans le code applicatif.
CREATE OR REPLACE FUNCTION public.reservation_period(
  d date, t text, dur integer
) RETURNS tsrange
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT tsrange(
    d + t::time,
    d + t::time + make_interval(
      mins => CASE WHEN dur IS NULL OR dur <= 0 THEN 60 ELSE dur END
    )
  );
$$;

-- Bornes [début, fin) : deux rendez-vous qui se touchent (10h-11h puis 11h-12h)
-- ne se chevauchent pas. Les annulées et les lignes en corbeille ne bloquent
-- aucun créneau.
--
-- Violation -> SQLSTATE 23P01, déjà capté par l'API publique, qui répond alors
-- « Ce créneau vient d'être réservé » en 409.
ALTER TABLE public.reservations
  ADD CONSTRAINT reservations_no_overlap
  EXCLUDE USING gist (
    public.reservation_period(appointment_date, appointment_time, duration_min) WITH &&
  )
  WHERE (status <> 'cancelled' AND deleted_at IS NULL);
