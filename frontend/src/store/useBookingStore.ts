import { create } from "zustand";

interface Passenger {
  nome: string;
  cpf: string;
  email: string;
}

interface BookingState {
  viagemId: string | null;
  assentoSelecionado: number | null;
  passenger: Passenger | null;
  setViagemId: (id: string | null) => void;
  setAssento: (assento: number | null) => void;
  setPassenger: (passenger: Passenger | null) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  viagemId: null,
  assentoSelecionado: null,
  passenger: null,
  setViagemId: (id) => set({ viagemId: id }),
  setAssento: (assento) => set({ assentoSelecionado: assento }),
  setPassenger: (passenger) => set({ passenger }),
  resetBooking: () => set({ viagemId: null, assentoSelecionado: null, passenger: null }),
}));
