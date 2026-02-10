import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NiboConfigForm from "@/components/dashboard/NiboConfigForm";
import { Typography, Box } from "@mui/material";

export default async function IntegracoesPage() {
  const data = await getProfile();
  if (!data || !["office_admin", "office_user"].includes(data.role)) redirect("/dashboard");
  const supabase = await createClient();
  const { data: niboCred } = await supabase
    .from("nibo_credentials")
    .select("access_token")
    .eq("tenant_id", data.tenantId)
    .single();
  const hasToken = Boolean(niboCred?.access_token);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Integrações
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Conecte o Nibo para sincronizar clientes (plano Premium do Nibo).
      </Typography>
      <NiboConfigForm hasToken={hasToken} />
    </Box>
  );
}
