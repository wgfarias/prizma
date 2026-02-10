"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { saveNiboToken, syncNiboClients } from "@/app/actions/nibo";

export default function NiboConfigForm({ hasToken }: { hasToken: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await saveNiboToken(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setSuccess("Token salvo. Agora você pode sincronizar os clientes.");
    router.refresh();
  }

  async function handleSync() {
    setError(null);
    setSuccess(null);
    setSyncing(true);
    const result = await syncNiboClients();
    setSyncing(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setSuccess(
      result?.synced != null
        ? `Sincronizados ${result.synced} cliente(s) do Nibo.`
        : "Sincronização concluída."
    );
    router.refresh();
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <Paper sx={{ p: 3, maxWidth: 480 }}>
        <Typography variant="h6" gutterBottom>
          Nibo
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Obtenha o token em: Empresa &gt; Mais opções &gt; Configurações &gt; API
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="api_token"
            label="Token da API Nibo"
            type="password"
            margin="normal"
            placeholder={hasToken ? "••••••••" : ""}
            helperText={hasToken ? "Deixe em branco para manter o token atual." : ""}
          />
          <Button type="submit" variant="contained" disabled={loading} sx={{ mt: 2 }}>
            {loading ? "Salvando..." : hasToken ? "Atualizar token" : "Conectar Nibo"}
          </Button>
        </form>
      </Paper>
      {hasToken && (
        <Paper sx={{ p: 3, maxWidth: 480 }}>
          <Typography variant="h6" gutterBottom>
            Sincronizar clientes
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Importa clientes/fornecedores do Nibo para a lista do escritório.
          </Typography>
          <Button
            variant="outlined"
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? "Sincronizando..." : "Sincronizar agora"}
          </Button>
        </Paper>
      )}
    </Box>
  );
}
