import { httpClient } from "@/lib/httpClient";
import type { ViagemDetalhada } from "@/types";

export const viagensService = {
  getViagens: async (origem?: string, destino?: string, dataIda?: string): Promise<ViagemDetalhada[]> => {
    const params = new URLSearchParams();
    if (origem) params.append("origem", origem);
    if (destino) params.append("destino", destino);
    if (dataIda) params.append("dataPartida", dataIda);

    return httpClient.get<ViagemDetalhada[]>("/viagens", { params });
  },

  getViagemById: async (id: string): Promise<ViagemDetalhada> => {
    return httpClient.get<ViagemDetalhada>(`/viagens/${id}`);
  },
};
