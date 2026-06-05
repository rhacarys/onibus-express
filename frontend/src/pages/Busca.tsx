import { BuscaForm } from "@/components/busca/BuscaForm";
import { ViagemCard } from "@/components/busca/ViagemCard";
import { useBuscaViagens } from "@/hooks/useBuscaViagens";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import type { JSX } from "react";

export default function Busca(): JSX.Element {
  usePageTitle("Buscar Passagens");
  const { viagens, isLoading, error, isFetched, setFilters, handleSelectViagem } = useBuscaViagens();

  return (
    <Stack sx={{ gap: 4 }}>
      <BuscaForm onSearch={setFilters} />

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error">Erro ao processar a busca de viagens na API. Verifique a conexão.</Alert>}

      {isFetched && !isLoading && viagens?.length === 0 && (
        <Alert severity="info">Nenhum horário disponível para a rota selecionada nesta data.</Alert>
      )}

      {viagens && viagens.length > 0 && (
        <Stack sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Horários disponíveis para esta data
          </Typography>
          {viagens.map((viagem) => (
            <ViagemCard key={viagem.id} viagem={viagem} onSelect={handleSelectViagem} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
