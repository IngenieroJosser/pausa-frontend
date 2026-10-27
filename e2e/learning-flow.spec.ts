import { expect, test, type Page } from "@playwright/test";

// Si hay un 500, fallo de hidratación o una página ajena, fallamos con un
// diagnóstico útil en lugar de esperar 70 segundos por un botón inexistente.
async function openWelcome(page: Page) {
  const javascriptErrors: string[] = [];
  page.on("pageerror", (error) => javascriptErrors.push(error.message));
  const response = await page.goto("/", { waitUntil: "domcontentloaded" });
  const start = page.getByRole("button", { name: /Comenzar práctica/i });
  try {
    expect(response?.status(), "La ruta / debe responder HTTP 200").toBe(200);
    await expect(start).toBeVisible({ timeout: 15_000 });
  } catch (error) {
    const text = await page.locator("body").innerText().catch(() => "[sin cuerpo legible]");
    throw new Error(
      `La bienvenida no está disponible. URL: ${page.url()}; HTTP: ${response?.status() ?? "sin respuesta"}; ` +
      `DOM: ${text.slice(0, 900)}; errores JS: ${javascriptErrors.join(" | ") || "ninguno"}; ` +
      `error original: ${String(error)}`
    );
  }
  return start;
}

async function completeOnboarding(page: Page, goal: "empleo" | "dinero" | "datos" = "empleo") {
  const start = await openWelcome(page);
  await start.click();
  await expect(page.getByRole("heading", { name: /Qué quieres proteger hoy/i })).toBeVisible();
  const goalLabel = goal === "empleo" ? /Continuar con Buscar empleo seguro/i :
    goal === "dinero" ? /Continuar con Proteger mi dinero/i : /Continuar con Cuidar mi identidad/i;
  // Elegir tema diferente al predeterminado cuando corresponda.
  if (goal !== "empleo") {
    const name = goal === "dinero" ? /Proteger mi dinero/i : /Cuidar mi identidad y datos/i;
    await page.locator(".goal-deck-card").filter({ hasText: name }).click();
  }
  await expect(page.getByRole("progressbar", { name: /Progreso de personalización/i })).toHaveAttribute("aria-valuenow", "1");
  await page.getByRole("button", { name: goalLabel }).click();
  await page.getByRole("button", { name: /Continuar a situaciones de práctica/i }).click();
  await page.getByRole("button", { name: /Seguir personalizando/i }).click();
  await page.getByRole("button", { name: /Ver casos rápidos/i }).click();
  for (let i = 0; i < 4; i++) {
    await expect(page.getByText("CASO", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: /Detecto posibles riesgos/i }).click();
  }
  await page.getByRole("button", { name: /Ver mi plan personalizado/i }).click();
  const createPromise = page.waitForResponse((response) =>
    response.url().endsWith("/api/v1/sessions") && response.request().method() === "POST"
  );
  await page.getByRole("button", { name: /Iniciar práctica interactiva/i }).click();
  expect((await createPromise).ok()).toBeTruthy();
  await expect(page.getByRole("radio")).toHaveCount(3, { timeout: 15_000 });
}

// La interfaz muestra «Confirmar y descubrir el resultado» (no «Confirmar decisión»).
// Centralizamos el selector para evitar desajustes al editar el copy.
function confirmDecisionButton(page: Page) {
  return page.getByRole("button", { name: /Confirmar y descubrir el resultado/i });
}

async function chooseAndSubmit(page: Page, choiceIndex = 0) {
  await expect(page.getByRole("radio")).toHaveCount(3);
  const choice = page.getByRole("radio").nth(choiceIndex);
  await choice.click();
  await expect(choice).toHaveAttribute("aria-checked", "true");
  const confirm = confirmDecisionButton(page);
  await expect(confirm).toBeEnabled();
  await confirm.click();
  await expect(page.getByRole("heading", { name: /Hiciste una pausa útil|Aquí convenía hacer una pausa/ })).toBeVisible();
}

test("completar una sesión, obtener resultado persistido y recargar", async ({ page }) => {
  await completeOnboarding(page, "empleo");
  for (let i = 0; i < 3; i++) {
    await chooseAndSubmit(page, i);
    await page.getByRole("button", { name: /Continuar mi entrenamiento/i }).click();
  }
  await expect(page.getByText(/Práctica completada · Informe de desempeño/)).toBeVisible();
  await expect(page.locator(".rex-score-badge strong")).toHaveText(/^[0-3] \/ 3$/);
  await page.reload({ waitUntil: "domcontentloaded" });
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
  await page.reload({ waitUntil: "domcontentloaded" });
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
  const firstChoice = page.getByRole("radio").first();
  await firstChoice.click();
  await expect(firstChoice).toHaveAttribute("aria-checked", "true");
  const confirm = confirmDecisionButton(page);
  await expect(confirm).toBeEnabled();
  await confirm.click();
  await expect(page.getByRole("heading", { name: /Tu práctica está a salvo/i })).toBeVisible();
  await page.getByRole("button", { name: /Intentar de nuevo/i }).click();
  await expect(page.getByText(/Hiciste una pausa útil|Aquí convenía hacer una pausa/)).toBeVisible();
});


test("onboarding conserva objetivo y calibración al retroceder", async ({ page }) => {
  const start = await openWelcome(page);
  await start.click();
  await page.locator(".goal-deck-card").filter({ hasText: /Proteger mi dinero/i }).click();
  await page.getByRole("button", { name: /Continuar con Proteger mi dinero/i }).click();
  await page.getByRole("button", { name: /^Atrás$/i }).click();
  await expect(page.locator(".goal-deck-card").filter({ hasText: /Proteger mi dinero/i })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /Continuar con Proteger mi dinero/i }).click();
  await page.getByRole("button", { name: /Continuar a situaciones de práctica/i }).click();
  await page.getByRole("button", { name: /Seguir personalizando/i }).click();
  await page.getByRole("button", { name: /Ver casos rápidos/i }).click();
  await page.getByRole("button", { name: /Detecto posibles riesgos/i }).click();
  await expect(page.getByText("CASO", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /Corregir la respuesta anterior/i }).click();
  await page.getByRole("button", { name: /No encuentro señales críticas/i }).click();
  await page.getByRole("button", { name: /^Atrás$/i }).click();
  await page.getByRole("button", { name: /Ver casos rápidos/i }).click();
  await expect(page.locator(".calibration-count strong")).toHaveText("02");
});
