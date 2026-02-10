"use server";

import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { fetchNiboStakeholders } from "@/lib/nibo/client";
import { revalidatePath } from "next/cache";

export async function saveNiboToken(formData: FormData) {
  const data = await getProfile();
  if (!data || !["office_admin", "office_user"].includes(data.role)) {
    return { error: "Não autorizado." };
  }
  const apiToken = (formData.get("api_token") as string)?.trim();
  const supabase = await createClient();
  if (!apiToken) {
    const { data: existing } = await supabase
      .from("nibo_credentials")
      .select("tenant_id")
      .eq("tenant_id", data.tenantId)
      .single();
    if (existing) {
      revalidatePath("/dashboard/configuracoes");
      revalidatePath("/dashboard/integracoes");
      return { error: null };
    }
    return { error: "Token da API Nibo é obrigatório." };
  }

  const { error } = await supabase.from("nibo_credentials").upsert(
    {
      tenant_id: data.tenantId,
      access_token: apiToken,
      refresh_token: null,
      expires_at: null,
    },
    { onConflict: "tenant_id" }
  );
  if (error) return { error: error.message };
  revalidatePath("/dashboard/configuracoes");
  revalidatePath("/dashboard/integracoes");
  return { error: null };
}

export async function syncNiboClients() {
  const data = await getProfile();
  if (!data || !["office_admin", "office_user"].includes(data.role)) {
    return { error: "Não autorizado." };
  }
  const supabase = await createClient();
  const { data: cred } = await supabase
    .from("nibo_credentials")
    .select("access_token")
    .eq("tenant_id", data.tenantId)
    .single();
  if (!cred?.access_token) {
    return { error: "Conecte o Nibo nas integrações primeiro." };
  }

  let total = 0;
  let skip = 0;
  const top = 500;
  const seen = new Set<string>();

  try {
    while (true) {
      const { data: stakeholders, count } = await fetchNiboStakeholders(
        cred.access_token,
        { orderBy: "id", top, skip }
      );
      for (const s of stakeholders) {
        const niboId = String(s.id);
        if (seen.has(niboId)) continue;
        seen.add(niboId);
        const name = String(s.name ?? "").trim();
        if (!name) continue;
        const email = typeof s.email === "string" ? s.email.trim() || null : null;
        const phone = typeof s.phone === "string" ? s.phone.trim() || null : null;
        await supabase.from("clients").upsert(
          {
            tenant_id: data.tenantId,
            nibo_id: niboId,
            name,
            email,
            phone,
          },
          { onConflict: "tenant_id,nibo_id", ignoreDuplicates: false }
        );
        total++;
      }
      if (stakeholders.length < top) break;
      skip += top;
      if (skip >= count) break;
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro ao sincronizar com Nibo.";
    return { error: message };
  }
  revalidatePath("/dashboard/clientes");
  revalidatePath("/dashboard/integracoes");
  return { error: null, synced: total };
}
