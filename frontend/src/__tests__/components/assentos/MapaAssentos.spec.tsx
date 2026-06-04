import { MapaAssentos } from "@/components/assentos/MapaAssentos";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("Componente de Integração: MapaAssentos", () => {
  it("deve renderizar a quantidade exata de poltronas com base na capacidade da viagem", () => {
    // Arrange: Capacidade de 10 poltronas
    render(<MapaAssentos capacidade={10} assentosOcupados={[]} assentoSelecionado={null} onSelectAssento={vi.fn()} />);

    // Assert: O usuário deve ver exatamente 10 botões de poltrona
    const poltronas = screen.getAllByRole("button", { name: /poltrona \d+/i });
    expect(poltronas).toHaveLength(10);
  });

  it("deve desabilitar as poltronas que constam na lista de assentos ocupados", () => {
    // Arrange: Poltronas 2 e 5 já foram vendidas
    render(
      <MapaAssentos capacidade={10} assentosOcupados={[2, 5]} assentoSelecionado={null} onSelectAssento={vi.fn()} />,
    );

    // Assert: Tenta encontrar os botões específicos e verifica o atributo "disabled"
    const poltrona2 = screen.getByRole("button", { name: /poltrona 2/i });
    const poltrona5 = screen.getByRole("button", { name: /poltrona 5/i });
    const poltrona3 = screen.getByRole("button", { name: /poltrona 3/i }); // Livre

    expect(poltrona2).toBeDisabled();
    expect(poltrona5).toBeDisabled();
    expect(poltrona3).not.toBeDisabled();
  });

  it("deve disparar o callback com o número correto ao clicar em uma poltrona livre", async () => {
    const mockOnSelect = vi.fn();
    const user = userEvent.setup();

    render(
      <MapaAssentos capacidade={46} assentosOcupados={[1]} assentoSelecionado={null} onSelectAssento={mockOnSelect} />,
    );

    // Act: Usuário clica na poltrona 42
    const poltrona42 = screen.getByRole("button", { name: /poltrona 42/i });
    await user.click(poltrona42);

    // Assert: O componente pai deve receber o número 42
    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect).toHaveBeenCalledWith(42);
  });
});
