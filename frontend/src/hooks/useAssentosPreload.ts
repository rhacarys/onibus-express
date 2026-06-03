import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { reservasService } from "../services/reservasService";
import { viagensService } from "../services/viagensService";
import { useBookingStore } from "../store/useBookingStore";

export function useAssentosPreload(viagemId: string | undefined) {
  const navigate = useNavigate();
  const { assentoSelecionado, setAssento } = useBookingStore();

  const {
    data: viagem,
    isLoading: loadingViagem,
    error: errorViagem,
  } = useQuery({
    queryKey: ["viagem", viagemId],
    queryFn: () => viagensService.getViagemById(viagemId!),
    enabled: !!viagemId,
  });

  const {
    data: reservas,
    isLoading: loadingReservas,
    error: errorReservas,
  } = useQuery({
    queryKey: ["reservas-ocupadas", viagemId],
    queryFn: () => reservasService.getReservasByViagemId(viagemId!),
    enabled: !!viagemId,
  });

  const assentosOcupados = reservas ? reservas.map((r) => r.assento) : [];
  const isLoading = loadingViagem || loadingReservas;
  const hasError = errorViagem || errorReservas || !viagemId;

  const handleProsseguir = (): void => {
    if (assentoSelecionado) {
      navigate("/checkout");
    }
  };

  return {
    viagem,
    assentosOcupados,
    assentoSelecionado,
    setAssento,
    isLoading,
    hasError,
    handleProsseguir,
    handleVoltar: () => navigate("/"),
  };
}
