import type { Reserva } from "@/types";
import { CheckCircleOutlined, ConfirmationNumber } from "@mui/icons-material";
import { Button, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import type { JSX } from "react";

interface SucessoReservaProps {
  reserva: Reserva;
  onNovaBusca: () => void;
}

export function SucessoReserva({ reserva, onNovaBusca }: SucessoReservaProps): JSX.Element {
  return (
    <Stack sx={{ gap: 4, alignItems: "center", py: 6 }}>
      <CheckCircleOutlined color="success" sx={{ fontSize: 80 }} />
      <Typography variant="h4" sx={{ fontWeight: "bold", textAlign: "center" }}>
        Reserva Confirmada!
      </Typography>

      <Paper
        variant="outlined"
        sx={{ p: 4, width: "100%", maxWidth: 500, backgroundColor: (theme) => theme.palette.background.paper }}
      >
        <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 1 }}>
          Código Localizador
        </Typography>
        <Typography variant="h3" color="primary" sx={{ fontWeight: "bold", mb: 3 }}>
          {reserva.codigoReserva}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Passageiro
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
              {reserva.passageiro.nome}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Typography variant="body2" color="text.secondary">
              Assento
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
              Poltrona {reserva.assento}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Button variant="outlined" onClick={onNovaBusca} startIcon={<ConfirmationNumber />}>
        Comprar Nova Passagem
      </Button>
    </Stack>
  );
}
