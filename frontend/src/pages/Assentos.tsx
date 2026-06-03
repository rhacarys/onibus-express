import { MapaAssentos } from "@/components/assentos/MapaAssentos";
import { ViagemResumo } from "@/components/checkout/ViagemResumo";
import { useAssentosPreload } from "@/hooks/useAssentosPreload";
import { ArrowBack, ChevronRight } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import type { JSX } from "react";

export default function Assentos(): JSX.Element {
  const { viagem, assentosOcupados, assentoSelecionado, isLoading, error, setAssento, handleProsseguir, handleVoltar } =
    useAssentosPreload();

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !viagem) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" onClick={handleVoltar}>
            Voltar
          </Button>
        }
      >
        Não foi possível carregar o mapa de assentos desta viagem.
      </Alert>
    );
  }

  return (
    <Stack sx={{ gap: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={handleVoltar} sx={{ alignSelf: "flex-start" }}>
        Voltar para busca
      </Button>

      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Selecione sua Poltrona
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <MapaAssentos
            capacidade={viagem.capacidade}
            assentosOcupados={assentosOcupados}
            assentoSelecionado={assentoSelecionado}
            onSelectAssento={setAssento}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Stack sx={{ gap: 3 }}>
            <ViagemResumo viagem={viagem} />

            <Button
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              disabled={!assentoSelecionado}
              onClick={handleProsseguir}
              endIcon={<ChevronRight />}
              sx={{ height: 56, fontWeight: "bold" }}
            >
              Continuar
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
