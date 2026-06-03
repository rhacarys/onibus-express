import { httpClient } from "@/lib/httpClient";

interface CidadesResponse {
  origens: string[];
  destinos: string[];
}

export const cidadesService = {
  getAvailableCidades: async (): Promise<CidadesResponse> => {
    return httpClient.get<CidadesResponse>("/cidades");
  },
};
