"use server";

import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createClientAction(formData: FormData) {
  const data = await getProfile();
  if (!data || !["office_admin", "office_user"].includes(data.role)) {
    return { error: "Não autorizado." };
  }
  const name = formData.get("name") as string;
  const email = (formData.get("email") as string) || null;
  const phone = (formData.get("phone") as string) || null;
  if (!name?.trim()) return { error: "Nome é obrigatório." };

  const supabase = await createClient();
  const { error } = await supabase.from("clients").insert({
    tenant_id: data.tenantId,
    name: name.trim(),
    email: email?.trim() || null,
    phone: phone?.trim() || null,
  });
  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/clientes");
  return { error: null };
}

export async function deleteClientAction(id: string) {
  const data = await getProfile();
  if (!data || !["office_admin", "office_user"].includes(data.role)) {
    return { error: "Não autorizado." };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id)
    .eq("tenant_id", data.tenantId);
  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/clientes");
  return { error: null };
}
