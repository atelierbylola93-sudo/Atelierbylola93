-- Accès patron + temps réel de l'espace admin.
--
-- 1. L'accès admin était accordé à une adresse héritée de Lovable. Il passe à
--    l'adresse de l'institut.
-- 2. La table reservations est publiée pour Supabase Realtime afin que l'espace
--    patron reçoive les nouvelles réservations sans rechargement.

-- ---------- 1. Adresse administratrice ----------

CREATE OR REPLACE FUNCTION public.grant_admin_for_patron_email()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL
     AND lower(NEW.email) = 'atelierbylola93@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

REVOKE EXECUTE ON FUNCTION public.grant_admin_for_patron_email()
  FROM PUBLIC, anon, authenticated;

-- Rattrape un compte déjà créé et confirmé avant cette migration.
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE lower(email) = 'atelierbylola93@gmail.com'
  AND email_confirmed_at IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- ---------- 2. Temps réel sur les réservations ----------

-- REPLICA IDENTITY FULL : sans cela, les évènements UPDATE et DELETE ne
-- transportent que la clé primaire, ce qui empêche le filtrage RLS côté
-- Realtime et prive l'admin de l'ancienne version de la ligne.
ALTER TABLE public.reservations REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'reservations'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
  END IF;
END $$;
