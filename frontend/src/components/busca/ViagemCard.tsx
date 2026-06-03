import type { ViagemDetalhada } from "@/types";
import { Event, EventSeat } from "@mui/icons-material";
import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import type { JSX } from "react";

interface ViagemCardProps {
  viagem: ViagemDetalhada;
  onSelect: (viagemId: string) => void;
}

export function ViagemCard({ viagem, onSelect }: ViagemCardProps): JSX.Element {
  return (
    <Card variant="outlined" sx={{ "&:hover": { boxShadow: 2 } }}>
      <CardContent>
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
              {viagem.rota.origem} → {viagem.rota.destino}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Event fontSize="small" />
              {new Date(viagem.dataPartida).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Duração estimada
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
              {viagem.rota.duracaoEstimada}h
            </Typography>
          </Grid>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <EventSeat fontSize="small" /> Assentos livres
            </Typography>
            <Typography
              variant="body1"
              color={viagem.assentosDisponiveis > 5 ? "success.main" : "error.main"}
              sx={{ fontWeight: "medium" }}
            >
              {viagem.assentosDisponiveis} vagas
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }} sx={{ textAlign: { sm: "right" } }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: "bold", mb: 1 }}>
              {viagem.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </Typography>
            <Button variant="contained" color="secondary" fullWidth onClick={() => onSelect(viagem.id)}>
              Selecionar
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
