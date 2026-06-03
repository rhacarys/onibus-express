import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircleOutlined } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from "@mui/material";
import type { JSX } from "react";
import { useForm } from "react-hook-form";

import type { Passageiro } from "@/types";
import { PassageiroSchema } from "@/types";

interface PassengerFormProps {
  onSubmit: (data: Passageiro) => void;
  isPending: boolean;
}

export function PassengerForm({ onSubmit, isPending }: PassengerFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Passageiro>({
    resolver: zodResolver(PassageiroSchema),
    mode: "onBlur",
  });

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" color="primary" sx={{ fontWeight: "bold", mb: 3 }}>
          Dados do Passageiro
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Nome Completo"
                error={!!errors.nome}
                helperText={errors.nome?.message}
                {...register("nome")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="CPF (Apenas números)"
                inputMode="numeric"
                error={!!errors.cpf}
                helperText={errors.cpf?.message}
                {...register("cpf")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                type="date"
                label="Data de Nascimento"
                slotProps={{ inputLabel: { shrink: true } }}
                error={!!errors.dataNascimento}
                helperText={errors.dataNascimento?.message}
                {...register("dataNascimento")}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                type="email"
                label="E-mail"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register("email")}
              />
            </Grid>
            <Grid size={{ xs: 12 }} sx={{ mt: 2 }}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="secondary"
                size="large"
                disabled={isPending}
                startIcon={<CheckCircleOutlined />}
                sx={{ height: 56, fontWeight: "bold" }}
              >
                {isPending ? "Processando..." : "Confirmar Reserva"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
