import { ReservaDetalhes } from "@/components/reserva/ReservaDetalhes";
import { useConsultaReserva } from "@/hooks/useConsultaReserva";
import { Search } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CircularProgress, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function Consulta() {
  const [codigoInput, setCodigoInput] = useState("");
  const { reserva, isLoading, isError, codigoBusca, isCancelando, buscarReserva, cancelarReserva } =
    useConsultaReserva();

  const handleAction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    buscarReserva(codigoInput);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h4" color="primary" sx={{ fontWeight: "bold", mb: 3 }}>
        Consultar Reserva
      </Typography>

      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={handleAction} sx={{ display: "flex", gap: 2 }}>
            <TextField
              fullWidth
              label="Código da Reserva"
              variant="outlined"
              value={codigoInput}
              onChange={(e) => setCodigoInput(e.target.value)}
              placeholder="Ex: ABC123XYZ"
            />
            <Button type="submit" variant="contained" size="large" startIcon={<Search />} disabled={isLoading}>
              Buscar
            </Button>
          </Box>
        </CardContent>
      </Card>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {isError && (
        <Typography color="error" align="center">
          Erro ao buscar a reserva. Tente novamente.
        </Typography>
      )}

      {!isLoading && codigoBusca && reserva === null && (
        <Typography color="text.secondary" align="center">
          Nenhuma reserva encontrada com o código informado.
        </Typography>
      )}

      {reserva && <ReservaDetalhes reserva={reserva} isCancelando={isCancelando} onCancelar={cancelarReserva} />}
    </Box>
  );
}
