import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("project board", () => {
  it("renders the five stages with sample cards", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1, name: "Product launch" })).toBeInTheDocument();
    expect(document.querySelectorAll(".board-column")).toHaveLength(5);
    expect(screen.getByText("Map customer onboarding")).toBeInTheDocument();
  });

  it("renames a column and adds then deletes a card", async () => {
    const user = userEvent.setup();
    render(<Home />);
    await user.click(screen.getByRole("button", { name: "Rename Backlog" }));
    const nameInput = screen.getByRole("textbox", { name: "Column name" });
    await user.clear(nameInput);
    await user.type(nameInput, "Ideas");
    await user.keyboard("{Enter}");
    expect(screen.getByRole("region", { name: "Ideas" })).toBeInTheDocument();

    const ideas = screen.getByRole("region", { name: "Ideas" });
    await user.click(within(ideas).getByRole("button", { name: "Add a card" }));
    await user.type(within(ideas).getByRole("textbox", { name: "Card title" }), "Prepare demo");
    await user.type(within(ideas).getByRole("textbox", { name: "Card details" }), "Share the latest build");
    await user.click(within(ideas).getByRole("button", { name: "Add card" }));
    expect(within(ideas).getByText("Prepare demo")).toBeInTheDocument();

    await user.click(within(ideas).getByRole("button", { name: "Delete Prepare demo" }));
    expect(within(ideas).queryByText("Prepare demo")).not.toBeInTheDocument();
  });
});
