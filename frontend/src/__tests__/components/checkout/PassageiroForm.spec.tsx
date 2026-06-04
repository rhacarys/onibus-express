import { cpfValido, cpfValidoComMascara } from "@/__tests__/utils/cpfValidator.test";
import { PassageiroForm } from "@/components/checkout/PassageiroForm";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

describe("Componente de Integração: PassengerForm", () => {
  it("Caminho Triste: deve exibir mensagens de erro e bloquear o submit se os dados forem inválidos", async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    render(<PassageiroForm onSubmit={mockOnSubmit} isPending={false} />);

    const submitButton = screen.getByRole("button", { name: /confirmar reserva/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Nome deve ter no mínimo 3 caracteres")).toBeInTheDocument();
      expect(screen.getByText("E-mail inválido")).toBeInTheDocument();
      expect(screen.getByText("CPF deve conter 11 dígitos")).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("Caminho Feliz: deve chamar o submit com o payload higienizado quando tudo estiver correto", async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    render(<PassageiroForm onSubmit={mockOnSubmit} isPending={false} />);

    await user.type(screen.getByLabelText(/nome completo/i), "Maria da Silva");
    await user.type(screen.getByLabelText(/e-mail/i), "maria@exemplo.com");
    await user.type(screen.getByLabelText(/cpf/i), cpfValidoComMascara); // O usuário digita com máscara

    const dataInput = screen.getByLabelText(/data de nascimento/i);
    await user.type(dataInput, "1985-10-25");

    const submitButton = screen.getByRole("button", { name: /confirmar reserva/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith(
      {
        nome: "Maria da Silva",
        email: "maria@exemplo.com",
        cpf: cpfValido,
        dataNascimento: "1985-10-25",
      },
      expect.any(Object),
    );
  });

  it("Estado de Mutação: deve exibir loading no botão e desabilitá-lo enquanto isPending for true", () => {
    render(<PassageiroForm onSubmit={vi.fn()} isPending={true} />);

    const submitButton = screen.getByRole("button");
    expect(submitButton).toBeDisabled();
  });
});
