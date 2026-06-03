import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { JSX } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { BuscaForm } from "../components/BuscaForm";
import { ViagemCard } from "../components/ViagemCard";
import { viagensService } from "../services/viagensService";
import { useBookingStore } from "../store/useBookingStore";
import type { BuscaFormInput } from "../types/search";

export default function Busca(): JSX.Element {
  const navigate = useNavigate();
  const setViagemId = useBookingStore((state) => state.setViagemId);
  const [filters, setFilters] = useState<BuscaFormInput | null>(null);

  const {
    data: viagens,
    isLoading,
    error,
    isFetched,
  } = useQuery({
    queryKey: ["viagens", filters],
    queryFn: () => viagensService.getViagens(filters?.origem, filters?.destino, filters?.dataIda),
    enabled: !!filters,
  });

  const handleSelectViagem = (viagemId: string): void => {
    setViagemId(viagemId);
    navigate(`/viagem/${viagemId}/assentos`);
  };

  return (
    <Stack sx={{ gap: 4 }}>
      <BuscaForm onSearch={setFilters} />

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">Erro ao buscar as viagens. Tente novamente.</Alert>}

      {isFetched && !isLoading && viagens?.length === 0 && (
        <Alert severity="info">Nenhuma viagem encontrada para os critérios selecionados.</Alert>
      )}

      {viagens && viagens.length > 0 && (
        <Stack sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Horários Disponíveis
          </Typography>
          {viagens.map((viagem) => (
            <ViagemCard key={viagem.id} viagem={viagem} onSelect={handleSelectViagem} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
