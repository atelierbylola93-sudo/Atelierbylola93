-- Catalogue des prestations en base.
--
-- Les tarifs vivaient dans le code, à deux endroits : les modifier imposait une
-- intervention technique et un redéploiement. Ils passent en base pour que
-- l'institut puisse les gérer seul depuis l'espace patron.
--
-- Les réservations conservent déjà une photographie de la prestation au moment
-- où elles sont prises : changer un prix ici n'altère aucun historique ni
-- aucune statistique passée.

CREATE TABLE public.services (
  id             text PRIMARY KEY,
  name           text NOT NULL,
  category       text NOT NULL,
  description    text NOT NULL DEFAULT '',
  price          numeric(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  duration_min   int NOT NULL DEFAULT 60 CHECK (duration_min > 0 AND duration_min <= 1440),
  duration_label text NOT NULL DEFAULT '',
  price_on_quote boolean NOT NULL DEFAULT false,
  price_note     text,
  active         boolean NOT NULL DEFAULT true,
  sort_order     int NOT NULL DEFAULT 0,

  -- Promotion. Les trois colonnes vont ensemble : une promotion sans date de
  -- fin finit oubliée et vendue à perte pendant des mois.
  promo_price    numeric(10,2),
  promo_start    date,
  promo_end      date,

  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT services_promo_check CHECK (
    (promo_price IS NULL AND promo_start IS NULL AND promo_end IS NULL)
    OR (
      promo_price IS NOT NULL AND promo_start IS NOT NULL AND promo_end IS NOT NULL
      AND promo_end >= promo_start
      AND promo_price >= 0
      AND promo_price < price
    )
  )
);

CREATE INDEX services_actives_idx ON public.services (category, sort_order) WHERE active;

CREATE TABLE public.service_upsells (
  id          text PRIMARY KEY,
  service_id  text NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  name        text NOT NULL,
  price       numeric(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  description text NOT NULL DEFAULT '',
  active      boolean NOT NULL DEFAULT true,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX service_upsells_service_idx ON public.service_upsells (service_id, sort_order);

-- Les tarifs sont affichés publiquement sur le site : leur lecture est ouverte.
-- Seul l'administrateur les modifie.
GRANT SELECT ON public.services, public.service_upsells TO anon, authenticated;
GRANT ALL ON public.services, public.service_upsells TO service_role;

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_upsells ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Catalogue lisible par tous" ON public.services
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins gerent le catalogue" ON public.services
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

CREATE POLICY "Finitions lisibles par tous" ON public.service_upsells
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins gerent les finitions" ON public.service_upsells
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

CREATE TRIGGER services_set_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_reservations_updated_at();
