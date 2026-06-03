import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { JSX, ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAssentosPreload } from "@/hooks/useAssentosPreload";
import { reservasService } from "@/services/reservasService";
import { viagensService } from "@/services/viagensService";
import { useBookingStore } from "@/store/useBookingStore";

vi.mock("@/services/viagensService");
vi.mock("@/services/reservasService");

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("useAssentosPreload Hook", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    useBookingStore.getState().resetBooking();

    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  const wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );

  it("deve retornar estado de loading inicialmente", () => {
    // Simulando promises pendentes
    vi.mocked(viagensService.getViagemById).mockImplementation(() => new Promise(() => {}));
    vi.mocked(reservasService.getReservasByViagemId).mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useAssentosPreload("viagem-123"), { wrapper });

    expect(result.current.isLoading).toBe(true);
  });

  it("deve extrair os números dos assentos ocupados a partir das reservas", async () => {
    vi.mocked(viagensService.getViagemById).mockResolvedValue({
      id: "viagem-123",
      rotaId: "1",
      preco: 100,
      assentosDisponiveis: 38,
      capacidade: 40,
      dataPartida: "",
      rota: { id: "1", origem: "A", destino: "B", duracaoEstimada: "2" },
    });

    vi.mocked(reservasService.getReservasByViagemId).mockResolvedValue([
      {
        id: "res-1",
        assento: 12,
        viagemId: "viagem-123",
        status: "confirmada",
        codigoReserva: "A",
        passageiro: { nome: "", cpf: "", email: "", dataNascimento: "" },
      },
      {
        id: "res-2",
        assento: 15,
        viagemId: "viagem-123",
        status: "confirmada",
        codigoReserva: "B",
        passageiro: { nome: "", cpf: "", email: "", dataNascimento: "" },
      },
    ]);

    const { result } = renderHook(() => useAssentosPreload("viagem-123"), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.assentosOcupados).toEqual([12, 15]);
  });

  it("deve navegar para checkout se tentar prosseguir com assento selecionado", async () => {
    vi.mocked(viagensService.getViagemById).mockResolvedValue({
      id: "viagem-123",
      rotaId: "1",
      preco: 100,
      assentosDisponiveis: 38,
      capacidade: 40,
      dataPartida: "",
      rota: { id: "1", origem: "A", destino: "B", duracaoEstimada: "2" },
    });
    vi.mocked(reservasService.getReservasByViagemId).mockResolvedValue([]);

    const { result } = renderHook(() => useAssentosPreload("viagem-123"), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setAssento(4);
    });

    act(() => {
      result.current.handleProsseguir();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/checkout");
  });

  it("NÃO deve navegar para checkout se nenhum assento estiver selecionado", () => {
    const { result } = renderHook(() => useAssentosPreload("viagem-123"), { wrapper });

    // Estado inicial nulo
    result.current.handleProsseguir();

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
