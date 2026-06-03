import type { BuscaFormInput } from "@/types/search";
import { BuscaFormSchema } from "@/types/search";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from "@mui/material";
import type { JSX } from "react";
import { useForm } from "react-hook-form";

interface BuscaFormProps {
  onSearch: (data: BuscaFormInput) => void;
}

export function BuscaForm({ onSearch }: BuscaFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuscaFormInput>({
    resolver: zodResolver(BuscaFormSchema),
  });

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" color="primary" sx={{ fontWeight: "bold", mb: 2 }}>
          Encontre sua próxima viagem
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSearch)} noValidate>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                label="Origem"
                error={!!errors.origem}
                helperText={errors.origem?.message}
                {...register("origem")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                label="Destino"
                error={!!errors.destino}
                helperText={errors.destino?.message}
                {...register("destino")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <TextField
                fullWidth
                type="date"
                label="Data de Ida"
                slotProps={{ inputLabel: { shrink: true } }}
                error={!!errors.dataIda}
                helperText={errors.dataIda?.message}
                {...register("dataIda")}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                startIcon={<Search />}
                sx={{ height: "56px" }}
              >
                Buscar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
