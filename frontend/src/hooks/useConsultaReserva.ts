import { reservasService } from "@/services/reservasService";
import { useToastStore } from "@/store/useToastStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useConsultaReserva() {
  const [codigoBusca, setCodigoBusca] = useState("");
  const showToast = useToastStore((state) => state.showToast);
  const queryClient = useQueryClient();

  const {
    data: reserva,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["reserva", codigoBusca],
    queryFn: () => reservasService.getReservaByCodigo(codigoBusca),
    enabled: !!codigoBusca,
  });

  const cancelarMutation = useMutation({
    mutationFn: (id: string) => reservasService.cancelarReserva(id),
    onSuccess: () => {
      showToast("Reserva cancelada com sucesso!", "success");
      queryClient.invalidateQueries({ queryKey: ["reserva", codigoBusca] });
    },
    onError: () => {
      showToast("Não foi possível cancelar a reserva.", "error");
    },
  });

  const buscarReserva = (codigo: string) => {
    if (!codigo.trim()) {
      showToast("Digite um código válido.", "warning");
      return;
    }
    setCodigoBusca(codigo.trim());
  };

  const cancelarReserva = (id: string) => {
    cancelarMutation.mutate(id);
  };

  return {
    reserva,
    isLoading,
    isError,
    codigoBusca,
    isCancelando: cancelarMutation.isPending,
    buscarReserva,
    cancelarReserva,
  };
}
