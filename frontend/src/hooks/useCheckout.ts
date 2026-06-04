import { queryClient } from "@/lib/queryClient";
import { reservasService } from "@/services/reservasService";
import { useReservaStore } from "@/store/useReservaStore";
import { useToastStore } from "@/store/useToastStore";
import type { CriarReservaDTO, Passageiro, Reserva } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useCheckout() {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const { viagemId, assentoSelecionado, reset: resetReserva } = useReservaStore();
  const [reservaConfirmada, setReservaConfirmada] = useState<Reserva | null>(null);

  const mutation = useMutation({
    mutationFn: (passageiro: Passageiro) => {
      if (!viagemId || !assentoSelecionado) {
        throw new Error("Dados de reserva incompletos");
      }

      const dto: CriarReservaDTO = {
        viagemId,
        assento: assentoSelecionado,
        passageiro,
      };
      return reservasService.criarReserva(dto);
    },
    onSuccess: (data) => {
      showToast("Reserva confirmada com sucesso!", "success");
      setReservaConfirmada(data);
      resetReserva();
      queryClient.invalidateQueries({ queryKey: ["reservas", viagemId] });
      queryClient.invalidateQueries({ queryKey: ["viagens"] });
    },
    onError: (_) => {
      showToast("Erro ao realizar a reserva.", "error");
    },
  });

  return {
    viagemId,
    assentoSelecionado,
    isPending: mutation.isPending,
    isError: mutation.isError,
    reservaConfirmada,
    submitReserva: mutation.mutate,
    handleVoltar: () => navigate(-1),
    handleNovaBusca: () => {
      navigate("/");
    },
  };
}
