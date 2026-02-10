"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TableRow,
  TableCell,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { deleteClientAction } from "@/app/actions/clients";
import { sendTestMessage } from "@/app/actions/evolution";

type ClientRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
};

export default function ClientesTableRow({ client }: { client: ClientRow }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [whatsappMessage, setWhatsappMessage] = useState("Olá! Mensagem enviada pelo Prizma.");
  const [whatsappError, setWhatsappError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleDelete() {
    if (!confirm("Excluir este cliente?")) return;
    setDeleting(true);
    await deleteClientAction(client.id);
    setDeleting(false);
    router.refresh();
  }

  async function handleSendWhatsApp() {
    setWhatsappError(null);
    setSending(true);
    const result = await sendTestMessage(client.id, whatsappMessage);
    setSending(false);
    if (result?.error) {
      setWhatsappError(result.error);
      return;
    }
    setWhatsappOpen(false);
    router.refresh();
  }

  return (
    <TableRow>
      <TableCell>{client.name}</TableCell>
      <TableCell>{client.email ?? "—"}</TableCell>
      <TableCell>{client.phone ?? "—"}</TableCell>
      <TableCell align="right">
        <IconButton
          size="small"
          onClick={() => setWhatsappOpen(true)}
          disabled={!client.phone}
          color="primary"
          aria-label="Enviar WhatsApp"
          title={client.phone ? "Enviar WhatsApp" : "Cadastre um telefone"}
        >
          <WhatsAppIcon />
        </IconButton>
        <IconButton
          size="small"
          onClick={handleDelete}
          disabled={deleting}
          color="error"
          aria-label="Excluir"
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
      <Dialog open={whatsappOpen} onClose={() => setWhatsappOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Enviar WhatsApp</DialogTitle>
        <DialogContent>
          {whatsappError && (
            <Typography color="error" sx={{ mb: 1 }}>
              {whatsappError}
            </Typography>
          )}
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Mensagem"
            value={whatsappMessage}
            onChange={(e) => setWhatsappMessage(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWhatsappOpen(false)}>Cancelar</Button>
          <Button onClick={handleSendWhatsApp} variant="contained" disabled={sending}>
            {sending ? "Enviando..." : "Enviar"}
          </Button>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
}
