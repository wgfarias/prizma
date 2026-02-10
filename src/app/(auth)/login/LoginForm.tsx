"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  Divider,
} from "@mui/material";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.push(next);
    router.refresh();
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (signInError) setError(signInError.message);
  };

  return (
    <Paper elevation={2} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
      <Typography variant="h5" gutterBottom>
        Entrar
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Acesse o Prizma com sua conta
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
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
          autoComplete="current-password"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
      <Divider sx={{ my: 2 }}>ou</Divider>
      <Button
        fullWidth
        variant="outlined"
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        Entrar com Google
      </Button>
      <Button
        fullWidth
        variant="outlined"
        component={Link}
        href="/"
        sx={{ mt: 2 }}
      >
        Voltar
      </Button>
    </Paper>
  );
}
