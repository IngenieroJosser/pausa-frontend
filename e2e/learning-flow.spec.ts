import { expect, test, type Page } from "@playwright/test";

async function completeOnboarding(page: Page, goal: "empleo" | "dinero" | "datos" = "empleo") {
  await page.goto("/");
  await page.getByRole("button", { name: /Comenzar práctica/i }).click();
  await expect(page.getByRole("heading", { name: /Qué quieres proteger hoy/i })).toBeVisible();
  const goalLabel = goal === "empleo" ? /Continuar con Buscar empleo seguro/i :
    goal === "dinero" ? /Continuar con Proteger mi dinero/i : /Continuar con Cuidar mi identidad/i;
  // Elegir tema diferente al predeterminado cuando corresponda.
  if (goal !== "empleo") {
    const name = goal === "dinero" ? /Proteger mi dinero/i : /Cuidar mi identidad y datos/i;
    await page.locator(".goal-deck-card").filter({ hasText: name }).click();
  }
  await page.getByRole("button", { name: goalLabel }).click();
  await page.getByRole("button", { name: /Continuar a situaciones de práctica/i }).click();
  await page.getByRole("button", { name: /Seguir personalizando/i }).click();
  await page.getByRole("button", { name: /Ver casos rápidos/i }).click();
  for (let i = 0; i < 4; i++) {
    await expect(page.getByText("CASO", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: /Detecto posibles riesgos/i }).click();
  }
  await page.getByRole("button", { name: /Ver mi plan personalizado/i }).click();
  await page.getByRole("button", { name: /Iniciar práctica interactiva/i }).click();
  await expect(page.getByRole("radio")).toHaveCount(3, { timeout: 15_000 });
}

async function chooseAndSubmit(page: Page, choiceIndex = 0) {
  await expect(page.getByRole("radio")).toHaveCount(3);
  await page.getByRole("radio").nth(choiceIndex).click();
  await page.getByRole("button", { name: /Confirmar decisión/i }).click();
  await expect(page.getByText(/Hiciste una pausa útil|Aquí convenía hacer una pausa/)).toBeVisible();
}

test("completar una sesión, obtener resultado persistido y recargar", async ({ page }) => {
  await completeOnboarding(page, "empleo");
  for (let i = 0; i < 3; i++) {
    await chooseAndSubmit(page, i);
    await page.getByRole("button", { name: /Continuar mi entrenamiento/i }).click();
  }
  await expect(page.getByText(/Práctica completada · Informe de desempeño/)).toBeVisible();
  await expect(page.locator(".rex-score-badge strong")).toHaveText(/^[0-3] \/ 3$/);
  await page.reload();
  await expect(page.getByText(/Práctica completada · Informe de desempeño/)).toBeVisible();
});

test("la elección de dinero llega al backend y condiciona el escenario", async ({ page }) => {
  const responsePromise = page.waitForResponse((response) => response.url().endsWith("/api/v1/sessions") && response.request().method() === "POST");
  await completeOnboarding(page, "dinero");
  const response = await responsePromise;
  const session = await response.json();
  expect(session.nextScenario.id).toMatch(/^dinero-/);
});

test("recupera la práctica activa tras una recarga", async ({ page }) => {
  await completeOnboarding(page);
  await chooseAndSubmit(page, 0);
  await page.getByRole("button", { name: /Continuar mi entrenamiento/i }).click();
  await expect(page.getByRole("radio")).toHaveCount(3);
  await page.reload();
  await expect(page.getByRole("radio")).toHaveCount(3, { timeout: 12_000 });
  await expect(page.getByText("2/3")).toBeVisible();
});

test("reintentar después de una caída no duplica una decisión", async ({ page }) => {
  await completeOnboarding(page);
  let interrupted = false;
  await page.route("**/api/v1/sessions/*/decisions", async (route) => {
    if (!interrupted) { interrupted = true; await route.abort("internetdisconnected"); return; }
    await route.continue();
  });
  await page.getByRole("radio").first().click();
  await page.getByRole("button", { name: /Confirmar decisión/i }).click();
  await expect(page.getByRole("heading", { name: /Tu práctica está a salvo/i })).toBeVisible();
  await page.getByRole("button", { name: /Intentar de nuevo/i }).click();
  await expect(page.getByText(/Hiciste una pausa útil|Aquí convenía hacer una pausa/)).toBeVisible();
});
