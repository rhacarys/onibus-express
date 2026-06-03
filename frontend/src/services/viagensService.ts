import { api } from "@/services/api";
import type { ViagemDetalhada } from "@/types";

export const viagensService = {
  getViagens: async (origem?: string, destino?: string, dataIda?: string): Promise<ViagemDetalhada[]> => {
    const params = new URLSearchParams();
    if (origem) params.append("origem", origem);
    if (destino) params.append("destino", destino);
    if (dataIda) params.append("dataPartida", dataIda);

    const { data } = await api.get<ViagemDetalhada[]>("/viagens", { params });
    return data;
  },

  getViagemById: async (id: string): Promise<ViagemDetalhada> => {
    const { data } = await api.get<ViagemDetalhada>(`/viagens/${id}`);
    return data;
  },
};
