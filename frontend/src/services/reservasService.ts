import { api } from "./api";
import type { Reserva, CriarReservaDTO } from "../types";

export const reservasService = {
  criarReserva: async (dto: CriarReservaDTO): Promise<Reserva> => {
    const payload = {
      ...dto,
      status: "confirmada",
      codigoReserva: `ONB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };
    const { data } = await api.post<Reserva>("/reservas", payload);
    return data;
  },

  getReservaByCodigo: async (codigo: string): Promise<Reserva | null> => {
    const { data } = await api.get<Reserva[]>(`/reservas?codigoReserva=${codigo}`);
    return data.length > 0 ? data[0] : null;
  },

  cancelarReserva: async (id: string): Promise<Reserva> => {
    const { data } = await api.patch<Reserva>(`/reservas/${id}`, { status: "cancelada" });
    return data;
  },
};
