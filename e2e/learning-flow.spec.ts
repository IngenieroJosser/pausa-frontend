import { expect, test, type Page } from "@playwright/test";

async function completeOnboarding(page: Page, goal: "empleo" | "dinero" | "datos" = "empleo") {
  await page.goto("/");
  await page.getByRole("button", {name:/Comenzar práctica/i}).click();
  await expect(page.getByRole("heading", {name:/Qué quieres proteger hoy/i})).toBeVisible();
  const buttonLabel = goal === "empleo" ? /Continuar con Buscar empleo seguro/i : goal === "dinero" ? /Continuar con Proteger mi dinero/i : /Continuar con Cuidar mi identidad/i;
  await page.getByRole("button", {name:buttonLabel}).click();
  await page.getByRole("button", {name:/Continuar a situaciones de práctica/i}).click();
  for(let i=0;i<3;i++){
    await expect(page.getByText(`CASO`,{exact:true}).first()).toBeVisible();
    await page.getByRole("button",{name:/Detecto posibles riesgos/i}).click();
  }
  await page.getByRole("button",{name:/Ver mi plan personalizado/i}).click();
  await page.getByRole("button",{name:/Iniciar práctica interactiva/i}).click();
  await expect(page.getByText("Diagnóstico inicial",{exact:true})).toBeVisible({timeout:12_000});
}

async function chooseAndSubmit(page: Page, choiceIndex = 0) {
  await expect(page.getByRole("radio")).toHaveCount(3);
  await page.getByRole("radio").nth(choiceIndex).click();
  await page.getByRole("button",{name:/Confirmar y descubrir/i}).click();
  await expect(page.getByText(/Hiciste una pausa útil|Aquí convenía hacer una pausa/)).toBeVisible();
}

test("three personalized questions, feedback and persisted final score",async({page})=>{
  await completeOnboarding(page,"empleo");
  for(let i=0;i<3;i++){
    await chooseAndSubmit(page,i);
    await page.getByRole("button",{name:/Continuar mi entrenamiento/i}).click();
  }
  await expect(page.getByText(/Práctica completada · Informe de desempeño/)).toBeVisible();
  await expect(page.locator(".rex-score-badge strong")).toHaveText(/^[0-3] \/ 3$/);
  await page.reload();
  await expect(page.getByText(/Práctica completada · Informe de desempeño/)).toBeVisible();
  await expect(page.locator(".rex-score-badge strong")).toHaveText(/^[0-3] \/ 3$/);
});

test("other goals actually change the selected scenarios",async({page})=>{
  await completeOnboarding(page,"dinero");
  await expect(page.getByText("DINERO",{exact:true})).toBeVisible();
  await expect(page.getByRole("radio")).toHaveCount(3);
});

test("can retry after a connection failure without losing the decision",async({page})=>{
  await completeOnboarding(page);
  let interrupted=false;
  await page.route("**/api/v1/sessions/*/decisions",async(route)=>{
    if(!interrupted){interrupted=true;await route.abort("internetdisconnected");return;}
    await route.continue();
  });
  await page.getByRole("radio").first().click();
  await page.getByRole("button",{name:/Confirmar y descubrir/i}).click();
  await expect(page.getByRole("heading",{name:"Tu práctica está a salvo."})).toBeVisible();
  await page.getByRole("button",{name:/Intentar de nuevo/i}).click();
  await expect(page.getByText(/Hiciste una pausa útil|Aquí convenía hacer una pausa/)).toBeVisible();
});
