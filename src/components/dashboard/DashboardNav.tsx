"use client";

import Link from "next/link";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export default function DashboardNav() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} href="/dashboard" sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}>
          Prizma
        </Typography>
        <Button color="inherit" component={Link} href="/dashboard">
          Dashboard
        </Button>
        <Button color="inherit" component={Link} href="/dashboard/clientes">
          Clientes
        </Button>
        <Button color="inherit" component={Link} href="/dashboard/configuracoes">
          Configurações
        </Button>
        <Button color="inherit" component={Link} href="/dashboard/integracoes">
          Integrações
        </Button>
        <Box component="form" action="/api/auth/signout" method="post">
          <Button type="submit" color="inherit">
            Sair
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
