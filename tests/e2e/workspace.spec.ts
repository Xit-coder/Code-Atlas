import { test, expect } from "@playwright/test";
test("web talks to Worker and rejects disallowed origins", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /Conheça o código/ }),
  ).toBeVisible();
  await expect(page.getByText("Conectada", { exact: true })).toBeVisible();
  await page
    .getByLabel("URL do repositório")
    .fill("https://localhost/internal");
  await page.getByRole("button", { name: "Verificar repositório" }).click();
  await expect(page.getByRole("alert")).toContainText("Use https://github.com");
  await page.getByRole("button", { name: "Documentação" }).click();
  await expect(
    page.getByRole("heading", { name: "Uma base verificável." }),
  ).toBeVisible();
  expect((await request.get("/api/v1/no-such-endpoint")).status()).toBe(404);
});
test("mobile workspace fits viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Verificar repositório" }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
if (process.env.CODEATLAS_LIVE === "1") {
  test("inspects a real public repository and confirms database connectivity", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByText("Conectado", { exact: true })).toBeVisible({
      timeout: 20000,
    });
    await page
      .getByLabel("URL do repositório")
      .fill("https://github.com/octocat/Hello-World");
    await page.getByRole("button", { name: "Verificar repositório" }).click();
    await expect(
      page.getByText("Origem verificada", { exact: true }),
    ).toBeVisible({ timeout: 20000 });
    await expect(page.locator("dd.mono")).toHaveText(/^[a-f0-9]{40}$/);
    await page.screenshot({
      path: "docs/evidence/workspace.png",
      fullPage: true,
    });
  });
}
