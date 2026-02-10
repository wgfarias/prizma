import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Typography, Box } from "@mui/material";
import EvolutionConfigForm from "@/components/dashboard/EvolutionConfigForm";

export default async function ConfiguracoesPage() {
  const data = await getProfile();
  if (!data || !["office_admin", "office_user"].includes(data.role)) redirect("/dashboard");
  const supabase = await createClient();
  const { data: evInstance } = await supabase
    .from("evolution_instances")
    .select("instance_name, api_key, status")
    .eq("tenant_id", data.tenantId)
    .single();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Configurações
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Integração com WhatsApp (Evolution API)
      </Typography>
      <EvolutionConfigForm
        initialInstanceName={evInstance?.instance_name ?? ""}
        initialApiKey={evInstance?.api_key ?? ""}
      />
    </Box>
  );
}
