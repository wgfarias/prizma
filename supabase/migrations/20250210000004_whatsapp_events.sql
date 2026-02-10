-- Eventos recebidos do webhook Evolution (para exibir no dashboard)
CREATE TABLE public.whatsapp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  instance_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_whatsapp_events_tenant_id ON public.whatsapp_events(tenant_id);
CREATE INDEX idx_whatsapp_events_created_at ON public.whatsapp_events(created_at DESC);

-- RLS: escritório vê apenas seus eventos
ALTER TABLE public.whatsapp_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "whatsapp_events_select_tenant"
  ON public.whatsapp_events FOR SELECT
  USING (
    tenant_id = public.get_my_tenant_id()
    AND public.get_my_role() IN ('office_admin', 'office_user')
  );

-- Inserção apenas via service role (webhook usa createAdminClient e bypassa RLS)
