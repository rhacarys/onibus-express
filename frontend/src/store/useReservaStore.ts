import type { Passageiro } from "@/types";
import { create } from "zustand";

interface ReservaState {
  viagemId: string | null;
  assentoSelecionado: number | null;
  passageiro: Passageiro | null;
  setViagemId: (id: string | null) => void;
  setAssento: (assento: number | null) => void;
  setPassageiro: (passageiro: Passageiro | null) => void;
  reset: () => void;
}

export const useReservaStore = create<ReservaState>((set) => ({
  viagemId: null,
  assentoSelecionado: null,
  passageiro: null,
  setViagemId: (id) => set({ viagemId: id }),
  setAssento: (assento) => set({ assentoSelecionado: assento }),
  setPassageiro: (passageiro) => set({ passageiro }),
  reset: () => set({ viagemId: null, assentoSelecionado: null, passageiro: null }),
}));
