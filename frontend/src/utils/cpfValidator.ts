export function validarCPF(cpf: string): boolean {
  const limpo = cpf.replace(/\D/g, "");

  if (limpo.length !== 11 || /^(\d)\1{10}$/.test(limpo)) {
    return false;
  }

  for (let t = 9; t < 11; t++) {
    let d = 0;
    for (let c = 0; c < t; c++) {
      d += parseInt(limpo[c], 10) * (t + 1 - c);
    }
    d = ((10 * d) % 11) % 10;
    if (parseInt(limpo[t], 10) !== d) {
      return false;
    }
  }

  return true;
}
