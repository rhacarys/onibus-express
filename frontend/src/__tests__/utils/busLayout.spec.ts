import { gerarFileirasOnibus } from "@/utils/busLayout";
import { describe, expect, it } from "vitest";

describe("Utilitário: busLayout", () => {
  it("deve gerar a quantidade correta de fileiras para um ônibus de 40 lugares", () => {
    const fileiras = gerarFileirasOnibus(40);
    expect(fileiras).toHaveLength(10);
  });

  it("deve gerar uma fileira extra para um ônibus com capacidade quebrada (ex: 42 lugares)", () => {
    const fileiras = gerarFileirasOnibus(42);
    expect(fileiras).toHaveLength(11);
  });

  it("deve respeitar a ordem da convenção: [Janela Esq, Corredor Esq, Corredor Dir, Janela Dir]", () => {
    const fileiras = gerarFileirasOnibus(40);
    expect(fileiras[0]).toEqual([1, 2, 4, 3]);
    expect(fileiras[1]).toEqual([5, 6, 8, 7]);
  });
});
