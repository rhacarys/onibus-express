import { expect, test } from "./fixtures";

test.describe("Fluxo Principal de Reserva de Passagens", () => {
  test("deve realizar uma busca, selecionar assento e completar a reserva com sucesso", async ({ page }) => {
    // 1. Acessa a página inicial
    await page.goto("/");
    await expect(page).toHaveTitle(/OniBus Express/i);

    // 2. Preenche o formulário de busca de viagens
    await page.getByLabel(/origem/i).click();
    await page.getByRole("option", { name: "Barueri" }).click();
    await page.getByLabel(/destino/i).click();
    await page.getByRole("option", { name: "Campinas" }).click();

    const inputData = page.getByLabel(/data de ida/i).first();
    await inputData.click();
    await inputData.pressSequentially("15062026");

    await page.getByRole("button", { name: /buscar/i }).click();

    // 3. Tela de Resultados: Aguarda e seleciona o card da viagem 105
    const cardViagem = page.locator('[data-testid="viagem-card-105"]');
    await expect(cardViagem).toBeVisible();
    await expect(cardViagem).toHaveText(/42 vagas/i);
    await expect(cardViagem).toHaveText(/53,00/i);
    await cardViagem.getByRole("button", { name: /selecionar/i }).click();

    // 4. Mapa de Assentos: Verifica se a URL mudou e seleciona a poltrona livre 12
    await expect(page).toHaveURL(/\/viagem\/105\/assentos/);
    const poltrona12 = page.getByRole("button", { name: /poltrona 12/i });
    await expect(poltrona12).not.toBeDisabled();
    await poltrona12.click();
    await page.getByRole("button", { name: /continuar/i }).click();

    // 5. Formulário de Passageiro (Checkout)
    await expect(page).toHaveURL(/\/checkout/);
    await page.getByLabel(/nome completo/i).fill("Nathaniel Abrante");
    await page.getByLabel(/e-mail/i).fill("nathaniel@exemplo.com");
    await page.getByLabel(/cpf/i).fill("60617720096");

    const inputDataNasc = page.getByLabel(/data de nascimento/i).first();
    await inputDataNasc.click();
    await inputDataNasc.pressSequentially("01101992");

    await page.getByRole("button", { name: /confirmar reserva/i }).click();

    // 6. Tela de Sucesso: Valida se o voucher e as informações batem
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.getByText(/reserva confirmada/i)).toBeVisible();
    await expect(page.getByText("Nathaniel Abrante")).toBeVisible();
    await expect(page.getByText(/poltrona 12/i)).toBeVisible();
    await expect(page.getByText(/ONB-[A-Z0-9]{6}/)).toBeVisible();
  });

  test("Caminho Triste: deve desabilitar assentos que já foram reservados", async ({ page }) => {
    await page.goto("/viagem/105/assentos");

    // 1. Seleciona a poltrona 12 e finaliza a compra dela
    await page.getByRole("button", { name: /poltrona 12/i }).click();
    await page.getByRole("button", { name: /continuar/i }).click();
    await page.getByLabel(/nome completo/i).fill("Usuário Um");
    await page.getByLabel(/e-mail/i).fill("um@email.com");
    await page.getByLabel(/cpf/i).fill("60617720096");
    const inputDataNasc = page.getByLabel(/data de nascimento/i).first();
    await inputDataNasc.click();
    await inputDataNasc.pressSequentially("01101992");
    await page.getByRole("button", { name: /confirmar reserva/i }).click();
    await expect(page.getByText(/reserva confirmada/i)).toBeVisible();

    // 2. Clica no botão para iniciar nova compra e navega novamente para o mapa de assentos da mesma viagem
    await page.getByRole("button", { name: /comprar nova passagem/i }).click();
    await page.getByLabel(/origem/i).click();
    await page.getByRole("option", { name: "Barueri" }).click();
    await page.getByLabel(/destino/i).click();
    await page.getByRole("option", { name: "Campinas" }).click();
    const inputData = page.getByLabel(/data de ida/i).first();
    await inputData.click();
    await inputData.pressSequentially("15062026");

    await page.getByRole("button", { name: /buscar/i }).click();
    const cardViagem = page.locator('[data-testid="viagem-card-105"]');
    await cardViagem.getByRole("button", { name: /selecionar/i }).click();
    await expect(page).toHaveURL(/\/viagem\/105\/assentos/);

    // 3. Verifica se a poltrona 12 está desabilitada
    const poltrona12 = page.getByRole("button", { name: /poltrona 12/i });
    await expect(poltrona12).toBeDisabled();
  });
});
