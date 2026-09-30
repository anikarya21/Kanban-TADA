import { describe, expect, it } from "vitest";
import { addCard, deleteCard, initialColumns, moveCard, renameColumn } from "./board-model";

describe("board operations", () => {
  it("starts with five columns and populated cards", () => {
    expect(initialColumns).toHaveLength(5);
    expect(initialColumns.every((column) => column.cards.length > 0)).toBe(true);
  });

  it("renames a column and ignores a blank name", () => {
    expect(renameColumn(initialColumns, "backlog", "Ideas")[0].title).toBe("Ideas");
    expect(renameColumn(initialColumns, "backlog", "  ")[0].title).toBe("Backlog");
  });

  it("adds and deletes a card without changing other columns", () => {
    const card = { id: "new", title: "New task", details: "A short note" };
    const withCard = addCard(initialColumns, "backlog", card);
    expect(withCard[0].cards.at(-1)).toEqual(card);
    expect(deleteCard(withCard, "new")[0].cards).toHaveLength(initialColumns[0].cards.length);
    expect(withCard[1]).toBe(initialColumns[1]);
  });

  it("moves a card between columns and places it before the target card", () => {
    const moved = moveCard(initialColumns, "c1", "planned", "c5");
    expect(moved[0].cards.some((card) => card.id === "c1")).toBe(false);
    expect(moved[1].cards.map((card) => card.id)).toEqual(["c4", "c1", "c5", "c6"]);
  });

  it("moves a card within its column", () => {
    const moved = moveCard(initialColumns, "c1", "backlog", "c3");
    expect(moved[0].cards.map((card) => card.id)).toEqual(["c2", "c1", "c3"]);
  });
});
