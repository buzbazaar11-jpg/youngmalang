ALTER TABLE public.pos_tables ADD COLUMN IF NOT EXISTS code text;
UPDATE public.pos_tables SET code = 'T' || table_no || '-' || upper(substr(md5(random()::text),1,5)) WHERE code IS NULL;
ALTER TABLE public.pos_tables ALTER COLUMN code SET DEFAULT upper(substr(md5(random()::text),1,8));
CREATE UNIQUE INDEX IF NOT EXISTS pos_tables_code_key ON public.pos_tables(code);

CREATE TABLE public.dine_in_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id uuid REFERENCES public.pos_tables(id) ON DELETE SET NULL,
  table_no integer NOT NULL,
  table_name text NOT NULL DEFAULT '',
  customer_name text NOT NULL,
  customer_phone text,
  notes text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  placed_by text NOT NULL DEFAULT 'customer',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.dine_in_orders TO authenticated;
GRANT ALL ON public.dine_in_orders TO service_role;
ALTER TABLE public.dine_in_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage dine in orders" ON public.dine_in_orders FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER dine_in_orders_updated BEFORE UPDATE ON public.dine_in_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
ALTER PUBLICATION supabase_realtime ADD TABLE public.dine_in_orders;

CREATE OR REPLACE FUNCTION public.get_table_by_code(_code text)
RETURNS TABLE(id uuid, table_no integer, name text, seats integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id, table_no, name, seats FROM public.pos_tables WHERE upper(code) = upper(_code) AND active LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.place_dine_in_order(_code text, _name text, _phone text, _notes text, _items jsonb)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE t record; it jsonb; lines jsonb := '[]'::jsonb; tot numeric := 0; p numeric; ttl text; q int; new_id uuid;
BEGIN
  SELECT * INTO t FROM public.pos_tables WHERE upper(code) = upper(_code) AND active;
  IF t IS NULL THEN RAISE EXCEPTION 'Invalid table'; END IF;
  IF coalesce(trim(_name),'') = '' THEN RAISE EXCEPTION 'Name required'; END IF;
  FOR it IN SELECT * FROM jsonb_array_elements(_items) LOOP
    q := greatest(1, least(50, coalesce((it->>'quantity')::int,1)));
    p := NULL;
    SELECT price, title INTO p, ttl FROM public.foods WHERE id::text = it->>'id' AND active;
    IF p IS NULL THEN SELECT price, title INTO p, ttl FROM public.deals WHERE id::text = it->>'id' AND active; END IF;
    IF p IS NOT NULL THEN
      lines := lines || jsonb_build_object('id', it->>'id', 'title', ttl, 'price', p, 'quantity', q);
      tot := tot + p * q;
    END IF;
  END LOOP;
  IF jsonb_array_length(lines) = 0 THEN RAISE EXCEPTION 'No valid items'; END IF;
  INSERT INTO public.dine_in_orders(table_id, table_no, table_name, customer_name, customer_phone, notes, items, total)
  VALUES (t.id, t.table_no, t.name, left(trim(_name),80), left(_phone,20), left(_notes,300), lines, tot)
  RETURNING id INTO new_id;
  RETURN new_id;
END $$;

CREATE OR REPLACE FUNCTION public.get_dine_in_order(_id uuid)
RETURNS TABLE(id uuid, table_no integer, table_name text, customer_name text, items jsonb, total numeric, status text, created_at timestamptz, updated_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id, table_no, table_name, customer_name, items, total, status, created_at, updated_at FROM public.dine_in_orders WHERE id = _id
$$;

GRANT EXECUTE ON FUNCTION public.get_table_by_code(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.place_dine_in_order(text,text,text,text,jsonb) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_dine_in_order(uuid) TO anon, authenticated;