
-- business_hours
CREATE TABLE public.business_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weekday smallint NOT NULL UNIQUE CHECK (weekday BETWEEN 0 AND 6),
  is_open boolean NOT NULL DEFAULT true,
  open_time time NOT NULL DEFAULT '09:00',
  close_time time NOT NULL DEFAULT '20:00',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (close_time > open_time)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.business_hours TO authenticated;
GRANT ALL ON public.business_hours TO service_role;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage business_hours"
  ON public.business_hours FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- closed_dates
CREATE TABLE public.closed_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.closed_dates TO authenticated;
GRANT ALL ON public.closed_dates TO service_role;
ALTER TABLE public.closed_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage closed_dates"
  ON public.closed_dates FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- blocked_slots
CREATE TABLE public.blocked_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_time > start_time)
);
CREATE INDEX blocked_slots_date_idx ON public.blocked_slots(date);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blocked_slots TO authenticated;
GRANT ALL ON public.blocked_slots TO service_role;
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage blocked_slots"
  ON public.blocked_slots FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

-- Seed business hours : ouvert 7j/7, 9h-20h
INSERT INTO public.business_hours (weekday, is_open, open_time, close_time)
SELECT gs, true, '09:00'::time, '20:00'::time FROM generate_series(0, 6) gs;

-- Reservations : source + paiement
ALTER TABLE public.reservations
  ADD COLUMN source text NOT NULL DEFAULT 'site',
  ADD COLUMN payment_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN payment_method text;

ALTER TABLE public.reservations
  ADD CONSTRAINT reservations_source_check
    CHECK (source IN ('site','telephone','instagram','autre'));
ALTER TABLE public.reservations
  ADD CONSTRAINT reservations_payment_status_check
    CHECK (payment_status IN ('unpaid','paid'));
ALTER TABLE public.reservations
  ADD CONSTRAINT reservations_payment_method_check
    CHECK (payment_method IS NULL OR payment_method IN ('cb','especes','planity','autre'));

CREATE INDEX IF NOT EXISTS reservations_appointment_date_idx
  ON public.reservations(appointment_date);

-- updated_at trigger for business_hours
CREATE TRIGGER update_business_hours_updated_at
  BEFORE UPDATE ON public.business_hours
  FOR EACH ROW EXECUTE FUNCTION public.update_reservations_updated_at();
