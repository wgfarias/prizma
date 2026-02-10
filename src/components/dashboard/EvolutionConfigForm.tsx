"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { saveEvolutionConfig } from "@/app/actions/evolution";

type Props = {
  initialInstanceName: string;
  initialApiKey: string;
};

export default function EvolutionConfigForm({
  initialInstanceName,
  initialApiKey,
}: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await saveEvolutionConfig(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 480 }}>
      <form onSubmit={handleSubmit}>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <TextField
          fullWidth
          name="instance_name"
          label="Nome da instância"
          defaultValue={initialInstanceName}
          required
          margin="normal"
          helperText="Nome da instância WhatsApp na Evolution API."
        />
        <TextField
          fullWidth
          name="api_key"
          label="API Key (Evolution)"
          type="password"
          defaultValue={initialApiKey}
          margin="normal"
          helperText="Deixe em branco para usar a chave global do servidor."
        />
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
