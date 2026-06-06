import { expect, test } from "./fixtures";

test.describe("Cenários de Exceção e Borda", () => {
  test("Estado Vazio: deve exibir mensagem quando não houver viagens na busca", async ({ page }) => {
    // Intercepta a requisição e força o retorno de um array vazio
    await page.route(/\/api\/v1\/viagens/, async (route) => {
      await route.fulfill({ status: 200, json: [] });
    });

    await page.goto("/");

    await page.getByLabel(/origem/i).click();
    await page.getByRole("option", { name: "Barueri" }).click();
    await page.getByLabel(/destino/i).click();
    await page.getByRole("option", { name: "Campinas" }).click();

    const inputData = page.getByLabel(/data de ida/i).first();
    await inputData.click();
    await inputData.pressSequentially("15062026");

    await page.getByRole("button", { name: /buscar/i }).click();

    // Verifica a renderização do Alert de estado vazio mapeado no seu Busca.tsx
    await expect(page.getByText(/Nenhum horário disponível para a rota selecionada/i)).toBeVisible();
  });

  test("Proteção de Rota: deve redirecionar para a Home ao acessar o checkout sem dados na store", async ({ page }) => {
    await page.goto("/checkout");

    // Sem viagem e assento, o redirecionamento deve acontecer imediatamente
    await expect(page).toHaveURL("http://localhost:5173/");
  });

  test("Validação de Formulário: deve bloquear e exibir mensagens de erro ao submeter campos vazios", async ({
    page,
  }) => {
    // 1. Atalho: navega direto para uma viagem específica e avança
    await page.goto("/viagem/105/assentos");
    await page.getByRole("button", { name: /poltrona 12/i }).click();
    await page.getByRole("button", { name: /continuar/i }).click();

    await expect(page).toHaveURL(/\/checkout/);

    // 2. Tenta confirmar a reserva imediatamente sem preencher nada
    await page.getByRole("button", { name: /confirmar reserva/i }).click();

    // 3. Verifica se as mensagens de erro estão na tela
    await expect(
      page.getByText(/nome deve ter no mínimo 3 caracteres/i).or(page.getByText(/obrigatório/i)),
    ).toBeVisible();
    await expect(page.getByText(/cpf deve conter 11 dígitos/i).or(page.getByText(/obrigatório/i))).toBeVisible();
    await expect(page.getByText(/e-mail inválido/i).or(page.getByText(/obrigatório/i))).toBeVisible();
    await expect(page.getByText(/data de nascimento inválida/i).or(page.getByText(/obrigatório/i))).toBeVisible();
  });
});
