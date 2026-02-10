import Link from "next/link";
import { Button, Box, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Typography variant="h3" component="h1">
        Prizma
      </Typography>
      <Typography color="text.secondary">
        BPO e Contabilidade
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button component={Link} href="/login" variant="contained">
          Entrar
        </Button>
        <Button component={Link} href="/cadastro" variant="outlined">
          Cadastrar escritório
        </Button>
      </Box>
    </Box>
  );
}
