/**
 * Transforma a capacidade total do ônibus em uma matriz de fileiras,
 * mantendo a ordem de assentos ímpares (janelas) e pares (corredor) para cada fileira.
 */
export function gerarFileirasOnibus(capacidade: number): number[][] {
  const totalFileiras = Math.ceil(capacidade / 4);

  return Array.from({ length: totalFileiras }, (_, index) => {
    const base = index * 4;
    return [base + 1, base + 2, base + 4, base + 3];
  });
}
