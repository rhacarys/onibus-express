import { useAssentosPreload } from "@/hooks/useAssentosPreload";
import { useReservaStore } from "@/store/useReservaStore";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { wrapper } from "../utils/test-utils";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: "105" }),
}));

describe("Hook: useAssentosPreload", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    useReservaStore.setState({ viagemId: "105", assentoSelecionado: null });
  });

  it("deve retornar a estrutura inicial de carregamento das queries", () => {
    const { result } = renderHook(() => useAssentosPreload(), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.assentosOcupados).toEqual([]);
  });

  it("deve atualizar o estado global do Zustand ao selecionar uma poltrona", () => {
    const { result } = renderHook(() => useAssentosPreload(), { wrapper });

    act(() => {
      result.current.setAssento(12);
    });

    expect(useReservaStore.getState().assentoSelecionado).toBe(12);
    expect(result.current.assentoSelecionado).toBe(12);
  });

  it("handleProsseguir não deve navegar se nenhum assento estiver selecionado", () => {
    const { result } = renderHook(() => useAssentosPreload(), { wrapper });

    act(() => {
      result.current.handleProsseguir();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("handleProsseguir deve redirecionar para o checkout se houver um assento selecionado", () => {
    const { result } = renderHook(() => useAssentosPreload(), { wrapper });

    act(() => {
      result.current.setAssento(24);
    });

    act(() => {
      result.current.handleProsseguir();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/checkout");
  });
});
