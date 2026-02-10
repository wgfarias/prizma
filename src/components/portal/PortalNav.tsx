"use client";

import Link from "next/link";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export default function PortalNav() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          href="/portal/portal"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >
          Prizma - Portal
        </Typography>
        <Box component="form" action="/api/auth/signout" method="post">
          <Button type="submit" color="inherit" sx={{ textTransform: "none" }}>
            Sair
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
