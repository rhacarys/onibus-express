import { cidadesService } from "@/services/cidadesService";
import { useToastStore } from "@/store/useToastStore";
import type { BuscaFormInput } from "@/types/search";
import { BuscaFormSchema } from "@/types/search";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, type JSX } from "react";
import { Controller, useForm } from "react-hook-form";

interface BuscaFormProps {
  onSearch: (data: BuscaFormInput) => void;
}

export function BuscaForm({ onSearch }: BuscaFormProps): JSX.Element {
  const showToast = useToastStore((state) => state.showToast);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BuscaFormInput>({
    resolver: zodResolver(BuscaFormSchema),
  });
  const {
    data: cidades,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cidades"],
    queryFn: cidadesService.getAvailableCidades,
  });

  useEffect(() => {
    if (isError) {
      showToast("Erro ao carregar opções de cidades.", "error");
    }
  }, [isError]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" color="primary" sx={{ fontWeight: "bold", mb: 2 }}>
          Encontre sua próxima viagem
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSearch)} noValidate>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, sm: 3 }}>
              <Controller
                name="origem"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    options={cidades?.origens || []}
                    value={value || null}
                    onChange={(_, newValue) => onChange(newValue || "")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Origem"
                        error={!!errors.origem}
                        helperText={errors.origem?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Controller
                name="destino"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    options={cidades?.destinos || []}
                    value={value || null}
                    onChange={(_, newValue) => onChange(newValue || "")}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Destino"
                        error={!!errors.destino}
                        helperText={errors.destino?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 3 }}>
              <Controller
                name="dataIda"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <DatePicker
                    label="Data de Ida"
                    value={value ? dayjs(value) : null}
                    onChange={(date) => onChange(date ? date.format("YYYY-MM-DD") : "")}
                    format="DD/MM/YYYY"
                    disablePast
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.dataIda,
                        helperText: errors.dataIda?.message,
                      },
                    }}
                  />
                )}
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
