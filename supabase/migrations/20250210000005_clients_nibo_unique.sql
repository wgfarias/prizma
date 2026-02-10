-- Permitir upsert por tenant_id + nibo_id no sync Nibo (múltiplos nibo_id NULL permitidos)
ALTER TABLE public.clients
  ADD CONSTRAINT clients_tenant_nibo_id_key UNIQUE (tenant_id, nibo_id);
