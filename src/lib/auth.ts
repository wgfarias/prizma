import { createClient } from "@/lib/supabase/server";
import type { Profile, TenantRole } from "@/types/database";

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(): Promise<{ profile: Profile; tenantId: string; role: TenantRole } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (!profile) return null;
  return {
    profile: profile as Profile,
    tenantId: profile.tenant_id,
    role: profile.role as TenantRole,
  };
}
