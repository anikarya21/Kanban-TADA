export type Card = {
  id: string;
  title: string;
  details: string;
};

export type Column = {
  id: string;
  title: string;
  cards: Card[];
};

export const initialColumns: Column[] = [
  {
    id: "backlog",
    title: "Backlog",
    cards: [
      { id: "c1", title: "Map customer onboarding", details: "Outline the first session, key questions, and handoff points." },
      { id: "c2", title: "Review analytics events", details: "Check naming and coverage for the launch dashboard." },
      { id: "c3", title: "Collect beta feedback", details: "Bring the latest notes together for the product team." },
    ],
  },
  {
    id: "planned",
    title: "Planned",
    cards: [
      { id: "c4", title: "Prepare launch checklist", details: "Confirm owners, timing, and final sign-off." },
      { id: "c5", title: "Draft release notes", details: "Keep the update focused on what changed for customers." },
      { id: "c6", title: "QA mobile layouts", details: "Verify the key screens across common device sizes." },
    ],
  },
  {
    id: "in-progress",
    title: "In progress",
    cards: [
      { id: "c7", title: "Refine workspace setup", details: "Make the first project feel clear and welcoming." },
      { id: "c8", title: "Build invite flow", details: "Help teams bring the right people into a workspace." },
      { id: "c9", title: "Update product screens", details: "Apply the latest UI direction to core workflows." },
      { id: "c10", title: "Review empty states", details: "Give new projects a useful starting point." },
    ],
  },
  {
    id: "review",
    title: "In review",
    cards: [
      { id: "c11", title: "Landing page copy", details: "Final pass for clarity and consistency." },
      { id: "c12", title: "Confirm email templates", details: "Check layout, links, and sender details." },
    ],
  },
  {
    id: "done",
    title: "Done",
    cards: [
      { id: "c13", title: "Set up project workspace", details: "Core channels and shared resources are ready." },
      { id: "c14", title: "Agree on launch goals", details: "The team is aligned on the measures that matter." },
    ],
  },
];

export function renameColumn(columns: Column[], columnId: string, title: string) {
  return columns.map((column) =>
    column.id === columnId ? { ...column, title: title.trim() || column.title } : column,
  );
}

export function addCard(columns: Column[], columnId: string, card: Card) {
  return columns.map((column) =>
    column.id === columnId ? { ...column, cards: [...column.cards, card] } : column,
  );
}

export function deleteCard(columns: Column[], cardId: string) {
  return columns.map((column) => ({
    ...column,
    cards: column.cards.filter((card) => card.id !== cardId),
  }));
}

export function moveCard(columns: Column[], cardId: string, targetColumnId: string, beforeCardId?: string) {
  const source = columns.find((column) => column.cards.some((card) => card.id === cardId));
  const target = columns.find((column) => column.id === targetColumnId);
  if (!source || !target) return columns;

  const card = source.cards.find((item) => item.id === cardId)!;
  const sourceCards = source.cards.filter((item) => item.id !== cardId);
  const targetCards = source.id === target.id ? sourceCards : [...target.cards];
  const insertAt = beforeCardId
    ? targetCards.findIndex((item) => item.id === beforeCardId)
    : targetCards.length;
  targetCards.splice(insertAt < 0 ? targetCards.length : insertAt, 0, card);

  return columns.map((column) => {
    if (column.id === source.id && column.id === target.id) return { ...column, cards: targetCards };
    if (column.id === source.id) return { ...column, cards: sourceCards };
    if (column.id === target.id) return { ...column, cards: targetCards };
    return column;
  });
}
