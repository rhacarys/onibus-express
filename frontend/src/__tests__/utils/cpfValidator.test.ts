import { validarCPF } from "@/utils/cpfValidator";
import { describe, expect, it } from "vitest";

// CPFs gerados com o Gerador de CPF para teste
export const cpfValido = "60617720096";
export const cpfValidoComMascara = "606.177.200-96";
export const cpfInvalido = "12345678900";
export const cpfInvalidoComMascara = "123.456.789-00";

describe("Utilitário: cpfValidator", () => {
  it("deve retornar true para CPFs matematicamente válidos (com e sem máscara)", () => {
    expect(validarCPF(cpfValido)).toBe(true);
    expect(validarCPF(cpfValidoComMascara)).toBe(true);
  });

  it("deve retornar false para CPFs com dígitos verificadores incorretos", () => {
    expect(validarCPF(cpfInvalido)).toBe(false);
    expect(validarCPF(cpfInvalidoComMascara)).toBe(false);
  });

  it("deve retornar false para CPFs com todos os números repetidos", () => {
    expect(validarCPF("00000000000")).toBe(false);
    expect(validarCPF("111.111.111-11")).toBe(false);
    expect(validarCPF("99999999999")).toBe(false);
  });

  it("deve retornar false para strings com tamanho incorreto", () => {
    expect(validarCPF("123")).toBe(false); // Curto
    expect(validarCPF("529982240180")).toBe(false); // Longo
    expect(validarCPF("")).toBe(false); // Vazio
  });

  it("deve lidar corretamente com letras misturadas nos números", () => {
    expect(validarCPF(cpfValido.replace("1", "A"))).toBe(false);
    expect(validarCPF(cpfValido.replace("1", "1A"))).toBe(true); // O número ainda é válido, a letra é ignorada
  });
});
