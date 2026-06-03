import { api } from "./api";
import type { ViagemDetalhada, Rota } from "../types";

export const viagensService = {
  getRotas: async (): Promise<Rota[]> => {
    const { data } = await api.get<Rota[]>("/rotas");
    return data;
  },

  getViagens: async (origem?: string, destino?: string, dataIda?: string): Promise<ViagemDetalhada[]> => {
    const params = new URLSearchParams();
    if (origem) params.append("rota.origem_like", origem);
    if (destino) params.append("rota.destino_like", destino);
    if (dataIda) params.append("dataPartida_like", dataIda);

    const { data } = await api.get<ViagemDetalhada[]>("/viagens?_expand=rota", { params });
    return data;
  },

  getViagemById: async (id: string): Promise<ViagemDetalhada> => {
    const { data } = await api.get<ViagemDetalhada>(`/viagens/${id}?_expand=rota`);
    return data;
  },
};
