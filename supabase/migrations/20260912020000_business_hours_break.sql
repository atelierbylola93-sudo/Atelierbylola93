-- Pause recurrente dans la journee (dejeuner).
--
-- Sans elle, bloquer midi imposait de creer un creneau bloque a la main chaque
-- jour. La pause est desormais portee par l'horaire hebdomadaire : une seule
-- saisie par jour de la semaine, valable indefiniment.
--
-- Elle est traitee comme un creneau occupe partout ou les disponibilites sont
-- calculees : liste publique des creneaux, API de reservation, creation
-- manuelle depuis l'espace patron.
ALTER TABLE public.business_hours
  ADD COLUMN IF NOT EXISTS break_start time,
  ADD COLUMN IF NOT EXISTS break_end time;

-- Soit aucune pause, soit une pause coherente et contenue dans la journee.
ALTER TABLE public.business_hours
  ADD CONSTRAINT business_hours_break_check CHECK (
    (break_start IS NULL AND break_end IS NULL)
    OR (
      break_start IS NOT NULL AND break_end IS NOT NULL
      AND break_end > break_start
      AND break_start >= open_time
      AND break_end <= close_time
    )
  );
