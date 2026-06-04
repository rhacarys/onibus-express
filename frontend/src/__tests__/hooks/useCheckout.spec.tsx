import { useCheckout } from "@/hooks/useCheckout";
import { useReservaStore } from "@/store/useReservaStore";
import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { wrapper } from "../utils/test-utils";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("Hook: useCheckout", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    useReservaStore.setState({ viagemId: "105", assentoSelecionado: 42 });
  });

  it("deve expor corretamente os dados do Zustand", () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    expect(result.current.viagemId).toBe("105");
    expect(result.current.assentoSelecionado).toBe(42);
  });

  it("handleVoltar deve navegar para a tela anterior utilizando o histórico do navegador", () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    act(() => {
      result.current.handleVoltar();
    });

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it("handleNovaBusca deve navegar para a home", () => {
    const { result } = renderHook(() => useCheckout(), { wrapper });

    act(() => {
      result.current.handleNovaBusca();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
