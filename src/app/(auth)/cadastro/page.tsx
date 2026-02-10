"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Divider,
} from "@mui/material";
import { createClient } from "@/lib/supabase/client";
import { createOfficeAndProfile } from "@/app/actions/office";

export default function CadastroPage() {
  const router = useRouter();
  const [officeName, setOfficeName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/dashboard` },
    });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    const result = await createOfficeAndProfile(officeName);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    router.refresh();
    router.push("/dashboard");
    setLoading(false);
  };

  return (
    <Paper elevation={2} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
      <Typography variant="h5" gutterBottom>
        Cadastrar escritório
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Crie sua conta e comece a usar o Prizma
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Nome do escritório"
          value={officeName}
          onChange={(e) => setOfficeName(e.target.value)}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          margin="normal"
          autoComplete="email"
        />
        <TextField
          fullWidth
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          margin="normal"
          autoComplete="new-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>
      <Divider sx={{ my: 2 }} />
      <Button fullWidth variant="outlined" component={Link} href="/" sx={{ mt: 1 }}>
        Voltar
      </Button>
    </Paper>
  );
}
