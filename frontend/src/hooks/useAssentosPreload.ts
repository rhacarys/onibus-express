import { reservasService } from "@/services/reservasService";
import { viagensService } from "@/services/viagensService";
import { useBookingStore } from "@/store/useBookingStore";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

export function useAssentosPreload() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { assentoSelecionado, setAssento } = useBookingStore();

  const {
    data: viagem,
    isLoading: loadingViagem,
    error: errorViagem,
  } = useQuery({
    queryKey: ["viagem", id],
    queryFn: () => viagensService.getViagemById(id!),
    enabled: !!id,
  });

  const { data: reservas, isLoading: loadingReservas } = useQuery({
    queryKey: ["reservas", id],
    queryFn: () => reservasService.getReservasByViagemId(id!),
    enabled: !!id,
  });

  const assentosOcupados = reservas ? reservas.map((r) => r.assento) : [];

  const handleProsseguir = (): void => {
    if (assentoSelecionado) {
      navigate("/checkout");
    }
  };

  return {
    viagem,
    assentosOcupados,
    assentoSelecionado,
    isLoading: loadingViagem || loadingReservas,
    error: errorViagem,
    setAssento,
    handleProsseguir,
    handleVoltar: () => navigate("/"),
  };
}
