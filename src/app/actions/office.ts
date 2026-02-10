"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createOfficeAndProfile(officeName: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return { error: "Usuário não autenticado." };
  }

  const slug = slugify(officeName);
  if (!slug) return { error: "Nome do escritório inválido." };

  const admin = createAdminClient();

  const { data: existingTenant } = await admin
    .from("tenants")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existingTenant) {
    return { error: "Já existe um escritório com um nome semelhante. Escolha outro." };
  }

  const { data: tenant, error: tenantError } = await admin
    .from("tenants")
    .insert({ name: officeName, slug })
    .select("id")
    .single();

  if (tenantError || !tenant) {
    return { error: tenantError?.message ?? "Erro ao criar escritório." };
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: user.id,
    tenant_id: tenant.id,
    role: "office_admin",
    email: user.email,
    display_name: user.user_metadata?.full_name ?? officeName,
    avatar_url: user.user_metadata?.avatar_url ?? null,
  });

  if (profileError) {
    await admin.from("tenants").delete().eq("id", tenant.id);
    return { error: profileError.message };
  }

  redirect("/dashboard");
}
