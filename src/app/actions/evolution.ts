"use server";

import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { sendEvolutionText } from "@/lib/evolution/client";
import { revalidatePath } from "next/cache";

export async function saveEvolutionConfig(formData: FormData) {
  const data = await getProfile();
  if (!data || !["office_admin", "office_user"].includes(data.role)) {
    return { error: "Não autorizado." };
  }
  const instanceName = (formData.get("instance_name") as string)?.trim();
  const apiKey = (formData.get("api_key") as string)?.trim() || null;

  if (!instanceName) return { error: "Nome da instância é obrigatório." };

  const supabase = await createClient();
  const { error } = await supabase.from("evolution_instances").upsert(
    {
      tenant_id: data.tenantId,
      instance_name: instanceName,
      api_key: apiKey,
      status: "pending",
    },
    { onConflict: "tenant_id" }
  );
  if (error) return { error: error.message };
  revalidatePath("/dashboard/configuracoes");
  return { error: null };
}

export async function sendTestMessage(clientId: string, message: string) {
  const data = await getProfile();
  if (!data || !["office_admin", "office_user"].includes(data.role)) {
    return { error: "Não autorizado." };
  }
  const supabase = await createClient();
  const { data: client } = await supabase
    .from("clients")
    .select("phone")
    .eq("id", clientId)
    .eq("tenant_id", data.tenantId)
    .single();
  if (!client?.phone) return { error: "Cliente sem telefone cadastrado." };

  const { data: evInstance } = await supabase
    .from("evolution_instances")
    .select("instance_name, api_key")
    .eq("tenant_id", data.tenantId)
    .single();
  if (!evInstance) return { error: "Configure a Evolution API nas configurações." };

  const baseUrl = process.env.EVOLUTION_API_URL;
  if (!baseUrl) return { error: "EVOLUTION_API_URL não configurada." };
  const apiKey = evInstance.api_key || process.env.EVOLUTION_API_KEY;
  if (!apiKey) return { error: "API key da Evolution não configurada." };

  const result = await sendEvolutionText(
    baseUrl,
    apiKey,
    evInstance.instance_name,
    { number: client.phone, text: message }
  );
  if (!result.ok) return { error: result.error ?? "Falha ao enviar mensagem." };
  return { error: null };
}
