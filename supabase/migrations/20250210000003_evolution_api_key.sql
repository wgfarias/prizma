ALTER TABLE public.evolution_instances
  ADD COLUMN IF NOT EXISTS api_key TEXT;
