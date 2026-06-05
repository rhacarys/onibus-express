import { gerarFileirasOnibus } from "@/utils/busLayout";
import { Box, Paper, Typography } from "@mui/material";
import type { JSX } from "react";
import { Fragment, useCallback } from "react";
import { AssentoItem } from "./AssentoItem";

interface MapaAssentosProps {
  capacidade: number;
  assentosOcupados: number[];
  assentoSelecionado: number | null;
  onSelectAssento: (assento: number) => void;
}

export function MapaAssentos({
  capacidade,
  assentosOcupados,
  assentoSelecionado,
  onSelectAssento,
}: MapaAssentosProps): JSX.Element {
  const fileiras = gerarFileirasOnibus(capacidade);

  const handleSelectAssento = useCallback(
    (numero: number) => {
      onSelectAssento(numero);
    },
    [onSelectAssento],
  );

  return (
    <Paper variant="outlined" sx={{ p: 3, backgroundColor: (theme) => theme.palette.background.paper }}>
      <Typography variant="subtitle1" sx={{ mb: 3, textAlign: "center", color: "text.secondary" }}>
        Frente do Ônibus (Motorista)
      </Typography>

      {/* Grid com 5 colunas: Poltrona | Poltrona | Corredor | Poltrona | Poltrona */}
      <Box
        role="group"
        aria-label="Mapa de assentos do ônibus"
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 45px) 32px repeat(2, 45px)",
          gap: 1.5,
          justifyContent: "center",
        }}
      >
        {fileiras.map((fileira, fIdx) => (
          <Box key={fIdx} sx={{ display: "contents" }}>
            {fileira.map((numero, cIdx) => {
              const existeAssento = numero <= capacidade;

              if (!existeAssento) {
                return (
                  <Fragment key={numero}>
                    {cIdx === 2 && <Box aria-hidden="true" />}
                    <Box aria-hidden="true" />
                  </Fragment>
                );
              }

              const isOcupado = assentosOcupados.includes(numero);
              const isSelecionado = assentoSelecionado === numero;

              return (
                <Fragment key={numero}>
                  {cIdx === 2 && <Box aria-hidden="true" />}
                  <AssentoItem
                    numero={numero}
                    isOcupado={isOcupado}
                    isSelecionado={isSelecionado}
                    onSelect={handleSelectAssento}
                  />
                </Fragment>
              );
            })}
          </Box>
        ))}
      </Box>

      {/* Legendas (aria-hidden) */}
      <Box aria-hidden="true" sx={{ display: "flex", justifyContent: "center", gap: 3, mt: 4, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 16, height: 16, border: "1px solid", borderColor: "success.main", borderRadius: "4px" }} />
          <Typography variant="caption" color="text.secondary">
            Livre ({capacidade - assentosOcupados.length})
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 16, height: 16, backgroundColor: "primary.main", borderRadius: "4px" }} />
          <Typography variant="caption" color="text.secondary">
            Selecionado
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              backgroundColor: (theme) => theme.palette.action.disabledBackground,
              borderRadius: "4px",
            }}
          />
          <Typography variant="caption" color="text.secondary">
            Ocupado ({assentosOcupados.length})
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
