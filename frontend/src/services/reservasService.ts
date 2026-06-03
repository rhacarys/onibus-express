import { httpClient } from "@/lib/httpClient";
import type { CriarReservaDTO, Reserva } from "@/types";

export const reservasService = {
  criarReserva: async (dto: CriarReservaDTO): Promise<Reserva> => {
    return httpClient.post<Reserva>("/reservas", dto);
  },

  getReservaByCodigo: async (codigo: string): Promise<Reserva | null> => {
    const data = await httpClient.get<Reserva[]>(`/reservas?codigoReserva=${codigo}`);
    return data.length > 0 ? data[0] : null;
  },

  getReservasByViagemId: async (viagemId: string): Promise<Reserva[]> => {
    return httpClient.get<Reserva[]>(`/reservas?viagemId=${viagemId}&status=confirmada`);
  },

  cancelarReserva: async (id: string): Promise<Reserva> => {
    return httpClient.patch<Reserva>(`/reservas/${id}`, { status: "cancelada" });
  },
};
