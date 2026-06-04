import { PassageiroSchema } from "@/types/reserva";
import { describe, expect, it } from "vitest";
import { cpfInvalido, cpfValido, cpfValidoComMascara } from "../utils/cpfValidator.test";

describe("Schema: PassageiroSchema", () => {
  const payloadValido = {
    nome: "João da Silva",
    cpf: cpfValido,
    email: "joao@email.com",
    dataNascimento: "1990-05-15",
  };

  it("deve aprovar um objeto de passageiro perfeitamente preenchido", () => {
    const result = PassageiroSchema.safeParse(payloadValido);
    expect(result.success).toBe(true);
  });

  it("deve rejeitar nomes com menos de 3 caracteres", () => {
    const result = PassageiroSchema.safeParse({ ...payloadValido, nome: "Zé" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Nome deve ter no mínimo 3 caracteres");
    }
  });

  it("deve rejeitar e-mails fora do padrão", () => {
    const result = PassageiroSchema.safeParse({ ...payloadValido, email: "joao.com" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("E-mail inválido");
    }
  });

  it("deve rejeitar CPFs inválidos chamando o validator interno", () => {
    const result = PassageiroSchema.safeParse({ ...payloadValido, cpf: cpfInvalido });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("CPF inválido");
    }
  });

  it("deve limpar a máscara do CPF durante o parse bem-sucedido", () => {
    const payloadComMascara = { ...payloadValido, cpf: cpfValidoComMascara };
    const result = PassageiroSchema.safeParse(payloadComMascara);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.cpf).toBe(cpfValido);
    }
  });

  it("deve rejeitar datas de nascimento inválidas", () => {
    const result = PassageiroSchema.safeParse({ ...payloadValido, dataNascimento: "fevereiro-30" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Data de nascimento inválida");
    }
  });
});
