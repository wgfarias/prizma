import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import { Typography, Box, Button, Card, CardContent } from "@mui/material";

export default async function DashboardPage() {
  const data = await getProfile();
  if (!data) return null;
  const supabase = await createClient();
  const { count } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("tenant_id", data.tenantId);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Área do escritório
      </Typography>
      <Card sx={{ maxWidth: 320 }}>
        <CardContent>
          <Typography color="text.secondary" gutterBottom>
            Clientes
          </Typography>
          <Typography variant="h4">{count ?? 0}</Typography>
          <Link href="/dashboard/clientes" style={{ textDecoration: "none" }}>
          <Button sx={{ mt: 1 }}>Ver clientes</Button>
        </Link>
        </CardContent>
      </Card>
    </Box>
  );
}
