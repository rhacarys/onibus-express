import { PassageiroForm } from "@/components/checkout/PassageiroForm";
import { SucessoReserva } from "@/components/checkout/SucessoReserva";
import { ViagemResumo } from "@/components/checkout/ViagemResumo";
import { useCheckout } from "@/hooks/useCheckout";
import { viagensService } from "@/services/viagensService";
import { ArrowBack } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, Grid, Paper, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { JSX } from "react";
import { useEffect } from "react";

export default function Checkout(): JSX.Element {
  const {
    viagemId,
    assentoSelecionado,
    isPending,
    isError,
    reservaConfirmada,
    submitReserva,
    handleVoltar,
    handleNovaBusca,
  } = useCheckout();

  useEffect(() => {
    if (!viagemId || !assentoSelecionado) {
      handleNovaBusca();
    }
  }, [viagemId, assentoSelecionado, handleNovaBusca]);

  const { data: viagem, isLoading: loadingViagem } = useQuery({
    queryKey: ["viagem", viagemId],
    queryFn: () => viagensService.getViagemById(viagemId!),
    enabled: !!viagemId && !reservaConfirmada,
  });

  if (!viagemId || !assentoSelecionado) return <Box />;

  if (loadingViagem) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (reservaConfirmada) {
    return <SucessoReserva reserva={reservaConfirmada} onNovaBusca={handleNovaBusca} />;
  }

  return (
    <Stack sx={{ gap: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={handleVoltar} sx={{ alignSelf: "flex-start" }}>
        Voltar para assentos
      </Button>

      {isError && (
        <Alert severity="error">Ocorreu um erro ao processar sua reserva. Verifique os dados e tente novamente.</Alert>
      )}

      <Grid container spacing={4} sx={{ flexDirection: { xs: "column-reverse", md: "row" } }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <PassageiroForm onSubmit={submitReserva} isPending={isPending} />
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          {viagem && (
            <Stack sx={{ gap: 3 }}>
              <ViagemResumo viagem={viagem} />
              <Paper variant="outlined" sx={{ p: 3, backgroundColor: "primary.main", color: "primary.contrastText" }}>
                <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                  Assento Selecionado
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  Poltrona {assentoSelecionado}
                </Typography>
              </Paper>
            </Stack>
          )}
        </Grid>
      </Grid>
    </Stack>
  );
}
