import { useBuscaViagens } from "@/hooks/useBuscaViagens";
import { useReservaStore } from "@/store/useReservaStore";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { wrapper } from "../utils/test-utils";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("Hook: useBuscaViagens", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    useReservaStore.setState({ viagemId: null, assentoSelecionado: null });
  });

  it("deve atualizar o estado do filtro quando setFilters for chamado", () => {
    const { result } = renderHook(() => useBuscaViagens(), { wrapper });

    act(() => {
      result.current.setFilters({ origem: "Barueri", destino: "Campinas", dataIda: "2026-06-15" });
    });

    expect(result.current.isLoading).toBe(true);
  });

  it("deve salvar a viagem no Zustand e navegar ao selecionar uma viagem", () => {
    const { result } = renderHook(() => useBuscaViagens(), { wrapper });

    act(() => {
      result.current.handleSelectViagem("105");
    });

    expect(useReservaStore.getState().viagemId).toBe("105");
    expect(mockNavigate).toHaveBeenCalledWith("/viagem/105/assentos");
  });
});
