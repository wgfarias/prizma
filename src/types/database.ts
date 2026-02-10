export type TenantRole = "office_admin" | "office_user" | "client";

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  settings: Record<string, unknown> | null;
  created_at: string;
}

export interface Profile {
  id: string;
  tenant_id: string;
  role: TenantRole;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  tenant_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  nibo_id: string | null;
  created_at: string;
}
