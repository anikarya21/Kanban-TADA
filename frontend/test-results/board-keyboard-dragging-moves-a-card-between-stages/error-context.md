# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: board.spec.ts >> keyboard dragging moves a card between stages
- Location: e2e\board.spec.ts:38:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('region', { name: 'Planned' }).getByText('Map customer onboarding')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" getByRole('region', { name: 'Planned' }).getByText('Map customer onboarding') with timeout 5000ms
  - waiting for getByRole('region', { name: 'Planned' }).getByText('Map customer onboarding')

```

```yaml
- complementary:
  - text: Northstar WORKSPACE N Northstar Studio PROJECTS
  - navigation "Projects": Product launch
- main:
  - text: Projects /
  - strong: Product launch
  - text: 14 cards
  - region "Product launch":
    - text: NORTHSTAR STUDIO · PROJECT BOARD
    - heading "Product launch" [level=1]
    - text: 5 stages
    - region "Backlog":
      - heading "Backlog" [level=2]
      - text: "3"
      - button "Rename Backlog"
      - article:
        - button "Move Map customer onboarding"
        - button "Delete Map customer onboarding"
        - heading "Map customer onboarding" [level=3]
        - paragraph: Outline the first session, key questions, and handoff points.
      - article:
        - button "Move Review analytics events"
        - button "Delete Review analytics events"
        - heading "Review analytics events" [level=3]
        - paragraph: Check naming and coverage for the launch dashboard.
      - article:
        - button "Move Collect beta feedback"
        - button "Delete Collect beta feedback"
        - heading "Collect beta feedback" [level=3]
        - paragraph: Bring the latest notes together for the product team.
      - button "Add a card"
    - region "Planned":
      - heading "Planned" [level=2]
      - text: "3"
      - button "Rename Planned"
      - article:
        - button "Move Prepare launch checklist"
        - button "Delete Prepare launch checklist"
        - heading "Prepare launch checklist" [level=3]
        - paragraph: Confirm owners, timing, and final sign-off.
      - article:
        - button "Move Draft release notes"
        - button "Delete Draft release notes"
        - heading "Draft release notes" [level=3]
        - paragraph: Keep the update focused on what changed for customers.
      - article:
        - button "Move QA mobile layouts"
        - button "Delete QA mobile layouts"
        - heading "QA mobile layouts" [level=3]
        - paragraph: Verify the key screens across common device sizes.
      - button "Add a card"
    - region "In progress":
      - heading "In progress" [level=2]
      - text: "4"
      - button "Rename In progress"
      - article:
        - button "Move Refine workspace setup"
        - button "Delete Refine workspace setup"
        - heading "Refine workspace setup" [level=3]
        - paragraph: Make the first project feel clear and welcoming.
      - article:
        - button "Move Build invite flow"
        - button "Delete Build invite flow"
        - heading "Build invite flow" [level=3]
        - paragraph: Help teams bring the right people into a workspace.
      - article:
        - button "Move Update product screens"
        - button "Delete Update product screens"
        - heading "Update product screens" [level=3]
        - paragraph: Apply the latest UI direction to core workflows.
      - article:
        - button "Move Review empty states"
        - button "Delete Review empty states"
        - heading "Review empty states" [level=3]
        - paragraph: Give new projects a useful starting point.
      - button "Add a card"
    - region "In review":
      - heading "In review" [level=2]
      - text: "2"
      - button "Rename In review"
      - article:
        - button "Move Landing page copy"
        - button "Delete Landing page copy"
        - heading "Landing page copy" [level=3]
        - paragraph: Final pass for clarity and consistency.
      - article:
        - button "Move Confirm email templates"
        - button "Delete Confirm email templates"
        - heading "Confirm email templates" [level=3]
        - paragraph: Check layout, links, and sender details.
      - button "Add a card"
    - region "Done":
      - heading "Done" [level=2]
      - text: "2"
      - button "Rename Done"
      - article:
        - button "Move Set up project workspace"
        - button "Delete Set up project workspace"
        - heading "Set up project workspace" [level=3]
        - paragraph: Core channels and shared resources are ready.
      - article:
        - button "Move Agree on launch goals"
        - button "Delete Agree on launch goals"
        - heading "Agree on launch goals" [level=3]
        - paragraph: The team is aligned on the measures that matter.
      - button "Add a card"
    - status: Draggable item c1 was dropped over droppable area c1
- alert
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | test("board supports column rename and card create/delete", async ({ page }) => {
  4  |   await page.setViewportSize({ width: 1440, height: 1000 });
  5  |   await page.goto("/");
  6  |   await expect(page.getByRole("heading", { name: "Product launch" })).toBeVisible();
  7  |   await expect(page.locator(".board-column")).toHaveCount(5);
  8  | 
  9  |   await page.getByRole("button", { name: "Rename Backlog" }).click();
  10 |   await page.getByRole("textbox", { name: "Column name" }).fill("Ideas");
  11 |   await page.getByRole("textbox", { name: "Column name" }).press("Enter");
  12 |   const ideas = page.getByRole("region", { name: "Ideas" });
  13 |   await ideas.getByRole("button", { name: "Add a card" }).click();
  14 |   await ideas.getByRole("textbox", { name: "Card title" }).fill("Prepare demo");
  15 |   await ideas.getByRole("textbox", { name: "Card details" }).fill("Share the latest build");
  16 |   await ideas.getByRole("button", { name: "Add card" }).click();
  17 |   await expect(ideas.getByText("Prepare demo")).toBeVisible();
  18 |   await ideas.getByRole("button", { name: "Delete Prepare demo", exact: true }).click();
  19 |   await expect(ideas.getByText("Prepare demo")).toHaveCount(0);
  20 | });
  21 | 
  22 | test("dragging a card moves it into another stage", async ({ page }) => {
  23 |   await page.setViewportSize({ width: 1440, height: 1000 });
  24 |   await page.goto("/");
  25 |   const card = page.getByRole("button", { name: "Move Map customer onboarding", exact: true });
  26 |   const target = page.getByRole("region", { name: "Planned" });
  27 |   const sourceBox = await card.boundingBox();
  28 |   const targetBox = await target.boundingBox();
  29 |   if (!sourceBox || !targetBox) throw new Error("Board cards must be visible before dragging");
  30 |   await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  31 |   await page.mouse.down();
  32 |   await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + 65, { steps: 12 });
  33 |   await page.mouse.up();
  34 |   await expect(target.getByText("Map customer onboarding")).toBeVisible();
  35 |   await expect(page.getByRole("region", { name: "Backlog" }).getByText("Map customer onboarding")).toHaveCount(0);
  36 | });
  37 | 
  38 | test("keyboard dragging moves a card between stages", async ({ page }) => {
  39 |   await page.setViewportSize({ width: 1440, height: 1000 });
  40 |   await page.goto("/");
  41 |   const handle = page.getByRole("button", { name: "Move Map customer onboarding", exact: true });
  42 |   await handle.focus();
  43 |   await handle.press("Space");
  44 |   await page.keyboard.press("ArrowRight");
  45 |   await page.keyboard.press("Space");
> 46 |   await expect(page.getByRole("region", { name: "Planned" }).getByText("Map customer onboarding")).toBeVisible();
     |                                                                                                    ^ Error: expect(locator).toBeVisible() failed
  47 | });
  48 | 
  49 | test("board remains usable on a narrow screen", async ({ page }) => {
  50 |   await page.setViewportSize({ width: 390, height: 844 });
  51 |   await page.goto("/");
  52 |   await expect(page.getByRole("heading", { name: "Product launch" })).toBeVisible();
  53 |   await expect(page.locator(".board-column")).toHaveCount(5);
  54 | });
  55 | 
```