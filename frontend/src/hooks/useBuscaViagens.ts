import { viagensService } from "@/services/viagensService";
import { useBookingStore } from "@/store/useBookingStore";
import type { BuscaFormInput } from "@/types/search";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useBuscaViagens() {
  const navigate = useNavigate();
  const setViagemId = useBookingStore((state) => state.setViagemId);
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
