import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Typography, Box, Card, CardContent } from "@mui/material";

export default async function PortalPage() {
  const data = await getProfile();
  if (!data || data.role !== "client") redirect("/login");
  const supabase = await createClient();
  const { data: client } = await supabase
    .from("clients")
    .select("id, name, email, phone")
    .eq("tenant_id", data.tenantId)
    .eq("user_id", data.profile.id)
    .single();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Portal do cliente
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Sua área restrita. Dados e documentos do seu escritório.
      </Typography>
      {client ? (
        <Card sx={{ maxWidth: 480 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Seus dados
            </Typography>
            <Typography><strong>Nome:</strong> {client.name}</Typography>
            {client.email && (
              <Typography><strong>E-mail:</strong> {client.email}</Typography>
            )}
            {client.phone && (
              <Typography><strong>Telefone:</strong> {client.phone}</Typography>
            )}
          </CardContent>
        </Card>
      ) : (
        <Typography color="text.secondary">
          Seu perfil ainda não foi vinculado a um cliente pelo escritório. Entre em contato com seu contador.
        </Typography>
      )}
    </Box>
  );
}
