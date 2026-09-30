"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Columns3, Plus, X, Pencil, Check, GripVertical, LayoutDashboard } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { addCard, Card, Column, deleteCard, initialColumns, moveCard, renameColumn } from "./board-model";

function TaskCard({ card, onDelete, overlay = false }: { card: Card; onDelete?: () => void; overlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <article
      ref={overlay ? undefined : setNodeRef}
      style={style}
      className={`task-card${isDragging && !overlay ? " is-dragging" : ""}${overlay ? " is-overlay" : ""}`}
    >
      <div className="task-topline">
        <button className="drag-handle" aria-label={`Move ${card.title}`} {...(overlay ? {} : attributes)} {...(overlay ? {} : listeners)}>
          <GripVertical size={15} aria-hidden="true" />
        </button>
        {onDelete && (
          <button className="icon-button delete-card" aria-label={`Delete ${card.title}`} onClick={onDelete}>
            <X size={15} aria-hidden="true" />
          </button>
        )}
      </div>
      <h3>{card.title}</h3>
      {card.details && <p>{card.details}</p>}
    </article>
  );
}

function BoardColumn({
  column,
  onRename,
  onAdd,
  onDelete,
}: {
  column: Column;
  onRename: (title: string) => void;
  onAdd: (title: string, details: string) => void;
  onDelete: (cardId: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(column.title);
  const [adding, setAdding] = useState(false);
  const [cardTitle, setCardTitle] = useState("");
  const [details, setDetails] = useState("");
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  function saveTitle(event: FormEvent) {
    event.preventDefault();
    onRename(title);
    setEditing(false);
  }

  function createCard(event: FormEvent) {
    event.preventDefault();
    if (!cardTitle.trim()) return;
    onAdd(cardTitle.trim(), details.trim());
    setCardTitle("");
    setDetails("");
    setAdding(false);
  }

  return (
    <section ref={setNodeRef} className={`board-column${isOver ? " column-over" : ""}`} aria-label={column.title}>
      <header className="column-heading">
        <span className="column-dot" aria-hidden="true" />
        {editing ? (
          <form className="rename-form" onSubmit={saveTitle}>
            <input aria-label="Column name" value={title} onChange={(event) => setTitle(event.target.value)} autoFocus />
            <button className="icon-button" aria-label="Save column name"><Check size={15} /></button>
          </form>
        ) : (
          <>
            <h2>{column.title}</h2>
            <span className="column-count">{column.cards.length}</span>
            <button
              className="icon-button rename-button"
              aria-label={`Rename ${column.title}`}
              title="Rename column"
              onClick={() => { setTitle(column.title); setEditing(true); }}
            >
              <Pencil size={14} aria-hidden="true" />
            </button>
          </>
        )}
      </header>

      <SortableContext items={column.cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
        <div className="card-list" aria-label={`${column.title} cards`}>
          {column.cards.map((card) => (
            <TaskCard key={card.id} card={card} onDelete={() => onDelete(card.id)} />
          ))}
          {column.cards.length === 0 && !adding && <p className="empty-column">No cards yet</p>}
        </div>
      </SortableContext>

      {adding ? (
        <form className="new-card-form" onSubmit={createCard}>
          <input aria-label="Card title" placeholder="Card title" value={cardTitle} onChange={(event) => setCardTitle(event.target.value)} autoFocus />
          <textarea aria-label="Card details" placeholder="Details" rows={3} value={details} onChange={(event) => setDetails(event.target.value)} />
          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={!cardTitle.trim()}>Add card</button>
            <button className="icon-button" type="button" aria-label="Cancel adding card" onClick={() => setAdding(false)}><X size={16} /></button>
          </div>
        </form>
      ) : (
        <button className="add-card-button" onClick={() => setAdding(true)}>
          <Plus size={16} aria-hidden="true" /> <span>Add a card</span>
        </button>
      )}
    </section>
  );
}

export default function Home() {
  const [columns, setColumns] = useState(initialColumns);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const cardCount = useMemo(() => columns.reduce((total, column) => total + column.cards.length, 0), [columns]);

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveCard(null);
    if (!over) return;
    const source = columns.find((column) => column.cards.some((card) => card.id === active.id));
    const target = columns.find((column) => column.id === over.id || column.cards.some((card) => card.id === over.id));
    if (!source || !target) return;
    if (active.id === over.id && source.id === target.id) return;
    const beforeCardId = target.cards.some((card) => card.id === over.id) ? String(over.id) : undefined;
    if (source.id === target.id && beforeCardId) {
      const from = source.cards.findIndex((card) => card.id === active.id);
      const to = source.cards.findIndex((card) => card.id === over.id);
      setColumns(columns.map((column) => column.id === source.id
        ? { ...column, cards: arrayMove(column.cards, from, to) }
        : column));
    } else {
      setColumns(moveCard(columns, String(active.id), target.id, beforeCardId));
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Columns3 size={19} /></span><span>Northstar</span></div>
        <div className="workspace-label">WORKSPACE</div>
        <div className="workspace-switcher"><span className="workspace-avatar">N</span><span>Northstar Studio</span></div>
        <div className="nav-label">PROJECTS</div>
        <nav aria-label="Projects">
          <div className="nav-item active" aria-current="page"><LayoutDashboard size={17} /><span>Product launch</span></div>
        </nav>
      </aside>

      <main className="main-area">
        <div className="topbar">
          <div className="breadcrumb"><span>Projects</span><span className="breadcrumb-divider">/</span><strong>Product launch</strong></div>
          <div className="board-summary"><span className="summary-dot" />{cardCount} cards</div>
        </div>
        <section className="board-content" aria-labelledby="board-title">
          <div className="board-title-row">
            <div>
              <div className="eyebrow">NORTHSTAR STUDIO <span>·</span> PROJECT BOARD</div>
              <h1 id="board-title">Product launch</h1>
            </div>
            <div className="board-mark"><Columns3 size={19} /><span>5 stages</span></div>
          </div>
          <DndContext
            id="product-launch-board"
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={({ active }) => {
              const card = columns.flatMap((column) => column.cards).find((item) => item.id === active.id);
              setActiveCard(card ?? null);
            }}
            onDragCancel={() => setActiveCard(null)}
            onDragEnd={handleDragEnd}
          >
            <div className="board-scroll">
              <div className="board-grid">
                {columns.map((column) => (
                  <BoardColumn
                    key={column.id}
                    column={column}
                    onRename={(title) => setColumns((current) => renameColumn(current, column.id, title))}
                    onAdd={(title, details) => setColumns((current) => addCard(current, column.id, { id: crypto.randomUUID(), title, details }))}
                    onDelete={(cardId) => setColumns((current) => deleteCard(current, cardId))}
                  />
                ))}
              </div>
            </div>
            <DragOverlay>{activeCard ? <TaskCard card={activeCard} overlay /> : null}</DragOverlay>
          </DndContext>
        </section>
      </main>
    </div>
  );
}
