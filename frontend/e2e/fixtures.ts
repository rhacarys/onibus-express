import { test as base, expect } from "@playwright/test";
import { handlers } from "../src/__mocks__/handlers";

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route("**/api/v1/**", async (route, request) => {
      const url = new URL(request.url());
      const metodo = request.method();
      let parametrosExtraidos: Record<string, string> = {};

      const handlerCorrespondente = handlers.find((handler: any) => {
        const info = handler.info;
        if (info.method !== metodo) return false;

        const path = info.path;
        if (path instanceof RegExp) return path.test(url.pathname);

        const regexDaRota = new RegExp("^" + path.replace(/:[^\s/]+/g, "([^/]+)") + "$");
        const match = url.pathname.match(regexDaRota);

        if (match) {
          const chaves = path.match(/:[^\s/]+/g) || [];
          chaves.forEach((chave: string, index: number) => {
            parametrosExtraidos[chave.substring(1)] = match[index + 1];
          });
          return true;
        }

        return false;
      });

      if (handlerCorrespondente) {
        const mockRequest = new Request(request.url(), {
          method: request.method(),
          headers: request.headers(),
          body: request.postData(),
        });

        const respostaMockada = await (handlerCorrespondente as any).resolver({
          request: mockRequest,
          params: parametrosExtraidos,
          cookies: {},
        });

        if (respostaMockada) {
          const corpo = await respostaMockada.text();
          await route.fulfill({
            status: respostaMockada.status,
            headers: Object.fromEntries(respostaMockada.headers.entries()),
            contentType: "application/json",
            body: corpo,
          });
          return;
        }
      }

      await route.continue();
    });

    await use(page);
  },
});

export { expect };
