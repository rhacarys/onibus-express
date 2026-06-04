import type { Reserva } from "@/types/reserva";
import { CancelOutlined } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { CancelarReservaDialog } from "./CancelarReservaDialog";

interface ReservaDetalhesProps {
  reserva: Reserva;
  isCancelando: boolean;
  onCancelar: (id: string) => void;
}

export function ReservaDetalhes({ reserva, isCancelando, onCancelar }: ReservaDetalhesProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const handleConfirmar = () => {
    onCancelar(reserva.id);
    setOpenDialog(false);
  };

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">Detalhes da Passagem</Typography>
            <Chip
              label={reserva.status.toUpperCase()}
              color={reserva.status === "confirmada" ? "success" : "error"}
              variant="filled"
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2">Passageiro</Typography>
              <Typography variant="body1">{reserva.passageiro.nome}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2">CPF</Typography>
              <Typography variant="body1">{reserva.passageiro.cpf}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2">ID da Viagem</Typography>
              <Typography variant="body1">{reserva.viagemId}</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2">Assento</Typography>
              <Typography variant="body1">Nº {reserva.assento}</Typography>
            </Grid>
          </Grid>

          {reserva.status === "confirmada" && (
            <Box sx={{ mt: 4 }}>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<CancelOutlined />}
                onClick={() => setOpenDialog(true)}
                disabled={isCancelando}
              >
                {isCancelando ? "Cancelando..." : "Cancelar Reserva"}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <CancelarReservaDialog open={openDialog} onClose={() => setOpenDialog(false)} onConfirm={handleConfirmar} />
    </>
  );
}
