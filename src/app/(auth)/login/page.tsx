import { Suspense } from "react";
import { CircularProgress, Box } from "@mui/material";
import LoginForm from "./LoginForm";

function LoginFallback() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
      <CircularProgress />
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
