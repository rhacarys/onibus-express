import type { ViagemDetalhada } from "@/types";
import { ConfirmationNumber, Event } from "@mui/icons-material";
import { Box, Card, CardContent, Typography } from "@mui/material";
import type { JSX } from "react";

interface ViagemResumoProps {
  viagem: ViagemDetalhada;
}

export function ViagemResumo({ viagem }: ViagemResumoProps): JSX.Element {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" color="primary" sx={{ fontWeight: "bold", mb: 2 }}>
          Resumo da Viagem
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
          {viagem.rota?.origem} → {viagem.rota?.destino}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1.5, color: "text.secondary" }}>
          <Event fontSize="small" />
          <Typography variant="body2">
            {new Date(viagem.data).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1, color: "text.secondary" }}>
          <ConfirmationNumber fontSize="small" />
          <Typography variant="body2">
            Preço por assento: {viagem.preco?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
