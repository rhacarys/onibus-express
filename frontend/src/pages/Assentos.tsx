import { MapaAssentos } from "@/components/MapaAssentos";
import { ViagemResumo } from "@/components/ViagemResumo";
import { useAssentosPreload } from "@/hooks/useAssentosPreload";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import type { JSX } from "react";
import { useParams } from "react-router-dom";

export default function Assentos(): JSX.Element {
  const { id } = useParams<{ id: string }>();

  const {
    viagem,
    assentosOcupados,
    assentoSelecionado,
    setAssento,
    isLoading,
    hasError,
    handleProsseguir,
    handleVoltar,
  } = useAssentosPreload(id);

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  if (hasError || !viagem) return <Alert severity="error">Erro ao carregar os dados dos assentos.</Alert>;

  return (
    <Stack sx={{ gap: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={handleVoltar} sx={{ alignSelf: "flex-start" }}>
        Voltar para busca
      </Button>

      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Selecione sua Poltrona
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ViagemResumo viagem={viagem} />
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            size="large"
            endIcon={<ArrowForward />}
            disabled={!assentoSelecionado}
            onClick={handleProsseguir}
            sx={{ mt: 3 }}
          >
            Prosseguir para Identificação
          </Button>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <MapaAssentos
            capacidade={viagem.capacidade}
            assentosOcupados={assentosOcupados}
            assentoSelecionado={assentoSelecionado}
            onSelectAssento={setAssento}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
