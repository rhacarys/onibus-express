import { cpfValido, cpfValidoComMascara } from "@/__tests__/utils/cpfValidator.test";
import { PassageiroForm } from "@/components/checkout/PassageiroForm";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "dayjs/locale/pt-br";
import { describe, expect, it, vi } from "vitest";

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
      {ui}
    </LocalizationProvider>,
  );
};

describe("Componente de Integração: PassengerForm", () => {
  it("Caminho Triste: deve exibir mensagens de erro e bloquear o submit se os dados forem inválidos", async () => {
    const mockOnSubmit = vi.fn();
    const user = userEvent.setup();

    renderWithProvider(<PassageiroForm onSubmit={mockOnSubmit} isPending={false} isError={false} />);

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

    renderWithProvider(<PassageiroForm onSubmit={mockOnSubmit} isPending={false} isError={false} />);

    await user.type(screen.getByLabelText(/nome completo/i), "Maria da Silva");
    await user.type(screen.getByLabelText(/e-mail/i), "maria@exemplo.com");
    await user.type(screen.getByLabelText(/cpf/i), cpfValidoComMascara); // O usuário digita com máscara

    const dataInput = screen.getAllByLabelText(/data de nascimento/i, { selector: "input" })[0] as HTMLInputElement;
    fireEvent.change(dataInput, { target: { value: "25/10/1985" } });

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
    renderWithProvider(<PassageiroForm onSubmit={vi.fn()} isPending={true} isError={false} />);

    const submitButton = screen.getByRole("button", { name: /processando/i });
    expect(submitButton).toBeDisabled();
  });
});
