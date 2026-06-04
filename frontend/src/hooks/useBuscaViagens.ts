import { viagensService } from "@/services/viagensService";
import { useReservaStore } from "@/store/useReservaStore";
import { useToastStore } from "@/store/useToastStore";
import type { BuscaFormInput } from "@/types/search";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function useBuscaViagens() {
  const navigate = useNavigate();
  const showToast = useToastStore((state) => state.showToast);
  const setViagemId = useReservaStore((state) => state.setViagemId);
  const [filters, setFilters] = useState<BuscaFormInput | null>(null);

  const {
    data: viagens,
    isLoading,
    error,
    isFetched,
  } = useQuery({
    queryKey: ["viagens", filters],
    queryFn: () => {
      if (!filters) return [];
      return viagensService.getViagens(filters.origem, filters.destino, filters.dataIda);
    },
    enabled: !!filters,
  });

  useEffect(() => {
    if (error) {
      showToast("Não foi possível buscar as viagens disponíveis.", "error");
    }
  }, [error]);

  const handleSelectViagem = (viagemId: string): void => {
    setViagemId(viagemId);
    navigate(`/viagem/${viagemId}/assentos`);
  };

  return {
    viagens,
    isLoading,
    error,
    isFetched,
    setFilters,
    handleSelectViagem,
  };
}
