import { api } from "@/services/api";

interface CidadesResponse {
  origens: string[];
  destinos: string[];
}

export const cidadesService = {
  getAvailableCidades: async (): Promise<CidadesResponse> => {
    const { data } = await api.get<CidadesResponse>("/cidades");
    return data;
  },
};
