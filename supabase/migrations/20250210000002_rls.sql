-- Funções auxiliares para RLS (tenant e role do usuário logado)
CREATE OR REPLACE FUNCTION public.get_my_tenant_id()
RETURNS UUID AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nibo_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evolution_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- tenants: usuário só acessa o tenant do seu perfil
CREATE POLICY "tenants_select_own"
  ON public.tenants FOR SELECT
  USING (id = public.get_my_tenant_id());

CREATE POLICY "tenants_update_own"
  ON public.tenants FOR UPDATE
  USING (id = public.get_my_tenant_id())
  WITH CHECK (id = public.get_my_tenant_id());

-- profiles: usuário vê perfis do mesmo tenant; apenas office_admin pode inserir/atualizar/deletar outros
CREATE POLICY "profiles_select_tenant"
  ON public.profiles FOR SELECT
  USING (tenant_id = public.get_my_tenant_id());

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (tenant_id = public.get_my_tenant_id());

CREATE POLICY "profiles_update"
  ON public.profiles FOR UPDATE
  USING (
    id = auth.uid()
    OR (tenant_id = public.get_my_tenant_id() AND public.get_my_role() IN ('office_admin', 'office_user'))
  )
  WITH CHECK (
    id = auth.uid()
    OR (tenant_id = public.get_my_tenant_id() AND public.get_my_role() IN ('office_admin', 'office_user'))
  );

CREATE POLICY "profiles_delete_tenant_admin"
  ON public.profiles FOR DELETE
  USING (
    tenant_id = public.get_my_tenant_id()
    AND public.get_my_role() IN ('office_admin', 'office_user')
  );

-- clients: escritório (office_*) vê/edita todos do tenant; cliente vê só o próprio registro (user_id = auth.uid())
CREATE POLICY "clients_select_office"
  ON public.clients FOR SELECT
  USING (
    tenant_id = public.get_my_tenant_id()
    AND (public.get_my_role() IN ('office_admin', 'office_user') OR user_id = auth.uid())
  );

CREATE POLICY "clients_insert_office"
  ON public.clients FOR INSERT
  WITH CHECK (
    tenant_id = public.get_my_tenant_id()
    AND public.get_my_role() IN ('office_admin', 'office_user')
  );

CREATE POLICY "clients_update_office"
  ON public.clients FOR UPDATE
  USING (
    tenant_id = public.get_my_tenant_id()
    AND public.get_my_role() IN ('office_admin', 'office_user')
  )
  WITH CHECK (tenant_id = public.get_my_tenant_id());

CREATE POLICY "clients_delete_office"
  ON public.clients FOR DELETE
  USING (
    tenant_id = public.get_my_tenant_id()
    AND public.get_my_role() IN ('office_admin', 'office_user')
  );

-- nibo_credentials: apenas escritório
CREATE POLICY "nibo_credentials_select_tenant"
  ON public.nibo_credentials FOR SELECT
  USING (tenant_id = public.get_my_tenant_id() AND public.get_my_role() IN ('office_admin', 'office_user'));

CREATE POLICY "nibo_credentials_all_tenant"
  ON public.nibo_credentials FOR ALL
  USING (tenant_id = public.get_my_tenant_id() AND public.get_my_role() IN ('office_admin', 'office_user'))
  WITH CHECK (tenant_id = public.get_my_tenant_id());

-- evolution_instances: apenas escritório
CREATE POLICY "evolution_instances_select_tenant"
  ON public.evolution_instances FOR SELECT
  USING (tenant_id = public.get_my_tenant_id() AND public.get_my_role() IN ('office_admin', 'office_user'));

CREATE POLICY "evolution_instances_all_tenant"
  ON public.evolution_instances FOR ALL
  USING (tenant_id = public.get_my_tenant_id() AND public.get_my_role() IN ('office_admin', 'office_user'))
  WITH CHECK (tenant_id = public.get_my_tenant_id());

-- audit_log: escritório lê; inserção via service role ou trigger
CREATE POLICY "audit_log_select_tenant"
  ON public.audit_log FOR SELECT
  USING (tenant_id = public.get_my_tenant_id() AND public.get_my_role() IN ('office_admin', 'office_user'));

CREATE POLICY "audit_log_insert_tenant"
  ON public.audit_log FOR INSERT
  WITH CHECK (tenant_id = public.get_my_tenant_id());
