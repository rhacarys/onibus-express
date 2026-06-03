import { create } from "zustand";
import type { Passageiro } from "../types";

interface BookingState {
  viagemId: string | null;
  assentoSelecionado: number | null;
  passageiro: Passageiro | null;
  setViagemId: (id: string | null) => void;
  setAssento: (assento: number | null) => void;
  setPassageiro: (passageiro: Passageiro | null) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  viagemId: null,
  assentoSelecionado: null,
  passageiro: null,
  setViagemId: (id) => set({ viagemId: id }),
  setAssento: (assento) => set({ assentoSelecionado: assento }),
  setPassageiro: (passageiro) => set({ passageiro }),
  resetBooking: () => set({ viagemId: null, assentoSelecionado: null, passageiro: null }),
}));
