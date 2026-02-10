import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/auth";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ClientesToolbar from "@/components/dashboard/ClientesToolbar";
import ClientesTableRow from "@/components/dashboard/ClientesTableRow";

export default async function ClientesPage() {
  const data = await getProfile();
  if (!data) return null;
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name, email, phone, created_at")
    .eq("tenant_id", data.tenantId)
    .order("created_at", { ascending: false });

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Clientes
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Listagem e cadastro de clientes do escritório
      </Typography>
      <ClientesToolbar />
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(clients ?? []).map((client) => (
              <ClientesTableRow key={client.id} client={client} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {(!clients || clients.length === 0) && (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
          Nenhum cliente cadastrado. Use o botão acima para adicionar.
        </Typography>
      )}
    </Box>
  );
}
