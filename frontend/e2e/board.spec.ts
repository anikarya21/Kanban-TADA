import { expect, test } from "@playwright/test";

test("board supports column rename and card create/delete", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Product launch" })).toBeVisible();
  await expect(page.locator(".board-column")).toHaveCount(5);

  await page.getByRole("button", { name: "Rename Backlog" }).click();
  await page.getByRole("textbox", { name: "Column name" }).fill("Ideas");
  await page.getByRole("textbox", { name: "Column name" }).press("Enter");
  const ideas = page.getByRole("region", { name: "Ideas" });
  await ideas.getByRole("button", { name: "Add a card" }).click();
  await ideas.getByRole("textbox", { name: "Card title" }).fill("Prepare demo");
  await ideas.getByRole("textbox", { name: "Card details" }).fill("Share the latest build");
  await ideas.getByRole("button", { name: "Add card" }).click();
  await expect(ideas.getByText("Prepare demo")).toBeVisible();
  await ideas.getByRole("button", { name: "Delete Prepare demo", exact: true }).click();
  await expect(ideas.getByText("Prepare demo")).toHaveCount(0);
});

test("dragging a card moves it into another stage", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const card = page.getByRole("button", { name: "Move Map customer onboarding", exact: true });
  const target = page.getByRole("region", { name: "Planned" });
  const sourceBox = await card.boundingBox();
  const targetBox = await target.boundingBox();
  if (!sourceBox || !targetBox) throw new Error("Board cards must be visible before dragging");
  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + 65, { steps: 12 });
  await page.mouse.up();
  await expect(target.getByText("Map customer onboarding")).toBeVisible();
  await expect(page.getByRole("region", { name: "Backlog" }).getByText("Map customer onboarding")).toHaveCount(0);
});

test("keyboard dragging moves a card between stages", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const handle = page.getByRole("button", { name: "Move Map customer onboarding", exact: true });
  await handle.focus();
  await handle.press("Space");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Space");
  await expect(page.getByRole("region", { name: "Planned" }).getByText("Map customer onboarding")).toBeVisible();
});

test("board remains usable on a narrow screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Product launch" })).toBeVisible();
  await expect(page.locator(".board-column")).toHaveCount(5);
});
