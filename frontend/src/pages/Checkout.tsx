import { PassengerForm } from "@/components/PassengerForm";
import { ViagemResumo } from "@/components/ViagemResumo";
import { useCheckout } from "@/hooks/useCheckout";
import { viagensService } from "@/services/viagensService";
import { ArrowBack, CheckCircleOutlined, ConfirmationNumber } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
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

  // Se o usuário acessar a rota diretamente sem ter passado pelas telas anteriores
  useEffect(() => {
    if (!viagemId || !assentoSelecionado) {
      handleNovaBusca();
    }
  }, [viagemId, assentoSelecionado, handleNovaBusca]);

  const { data: viagem, isLoading: loadingViagem } = useQuery({
    queryKey: ["viagem", viagemId],
    queryFn: () => viagensService.getViagemById(viagemId!),
    enabled: !!viagemId && !reservaConfirmada, // Só busca se não tiver concluído
  });

  if (!viagemId || !assentoSelecionado) return <Box />;

  if (loadingViagem) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // --- TELA DE SUCESSO ---
  if (reservaConfirmada) {
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
            {reservaConfirmada.codigoReserva}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Passageiro
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                {reservaConfirmada.passageiro.nome}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Assento
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                Poltrona {reservaConfirmada.assento}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Button variant="outlined" onClick={handleNovaBusca} startIcon={<ConfirmationNumber />}>
          Comprar Nova Passagem
        </Button>
      </Stack>
    );
  }

  // --- TELA DE CHECKOUT (Padrão) ---
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
          <PassengerForm onSubmit={submitReserva} isPending={isPending} />
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
