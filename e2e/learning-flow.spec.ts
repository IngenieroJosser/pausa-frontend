import { expect, test, type Page } from "@playwright/test";

async function completeOnboarding(page: Page) {
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") console.log(`browser:${message.type()}: ${message.text()}`);
  });
  page.on("pageerror", (error) => console.log(`browser:pageerror: ${error.message}`));
  page.on("requestfailed", (request) => console.log(`browser:requestfailed: ${request.url()} ${request.failure()?.errorText}`));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: /Comenzar práctica/i }).click();
  await expect(page.getByRole("heading", { name: "¿Qué quieres proteger hoy?" })).toBeVisible();
  await page.getByRole("button", { name: /Continuar con Buscar empleo seguro/i }).click();
  await page.getByRole("button", { name: /Continuar a situaciones de práctica/i }).click();

  for (let index = 0; index < 3; index += 1) {
    await page.getByRole("button", { name: /Sí me preocupa/i }).click();
  }

  await page.getByRole("button", { name: /Ver mi plan personalizado/i }).click();
  await page.getByRole("button", { name: /Iniciar práctica interactiva/i }).click();
  await expect(page.getByText("Diagnóstico inicial", { exact: true })).toBeVisible({ timeout: 10_000 });
}

async function answer(page: Page, option: RegExp) {
  await page.getByRole("radio", { name: option }).click();
  await page.getByRole("button", { name: /Confirmar decisión/i }).click();
  await expect(page.getByText(/Hiciste una pausa útil|Aquí convenía hacer una pausa/)).toBeVisible();
}

test("completa diagnóstico, adaptación, transferencia y restaura el informe", async ({ page }) => {
  await completeOnboarding(page);

  await page.getByRole("button", { name: /Pago anticipado/i }).click();
  await expect(page.getByText(/Te piden dinero antes/i)).toBeVisible();
  await page.getByRole("button", { name: /Gráfica: Ciclo del Ataque/i }).click();
  await expect(page.getByRole("heading", { name: /Cómo desarmar este tipo de fraude/i })).toBeVisible();
  await page.getByRole("button", { name: /Volver a la decisión del caso/i }).click();

  await answer(page, /Pagar para no perder el cupo/i);
  await page.getByRole("button", { name: /Practicar siguiente caso adaptativo/i }).click();
  await expect(page.getByText(/Práctica adaptada · pagos/i)).toBeVisible();

  await answer(page, /No pagar y confirmar la vacante/i);
  await page.getByRole("button", { name: /Practicar siguiente caso adaptativo/i }).click();
  await expect(page.getByText("Prueba de transferencia", { exact: true })).toBeVisible();

  await answer(page, /Abrir la app oficial del banco/i);
  await page.getByRole("button", { name: /Practicar siguiente caso adaptativo/i }).click();

  await expect(page.getByText("Práctica completada · Informe de desempeño")).toBeVisible();
  await expect(page.getByText("2 / 3")).toBeVisible();

  await page.reload();
  await expect(page.getByText("Práctica completada · Informe de desempeño")).toBeVisible();
  await expect(page.getByText("2 / 3")).toBeVisible();
});

test("recupera una decisión tras una desconexión sin duplicarla", async ({ page }) => {
  await completeOnboarding(page);
  let interrupted = false;
  await page.route("**/api/v1/sessions/*/decisions", async (route) => {
    if (!interrupted) {
      interrupted = true;
      await route.abort("internetdisconnected");
      return;
    }
    await route.continue();
  });

  await page.getByRole("radio", { name: /Pagar para no perder el cupo/i }).click();
  await page.getByRole("button", { name: /Confirmar decisión/i }).click();
  await expect(page.getByRole("heading", { name: "Tu práctica está a salvo." })).toBeVisible();
  await page.getByRole("button", { name: /Intentar de nuevo/i }).click();
  await expect(page.getByText("Aquí convenía hacer una pausa.")).toBeVisible();
});
