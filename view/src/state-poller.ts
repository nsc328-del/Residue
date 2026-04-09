import type { State } from "./types.js";

export type StateChangeEvent = {
  prev: State | null;
  next: State;
  changes: Set<ChangeKind>;
};

export type ChangeKind =
  | "floor"
  | "pressure"
  | "cost_added"
  | "cost_settled"
  | "world_line"
  | "room"
  | "ended"
  | "perma_token"
  | "turn";

export type StateListener = (event: StateChangeEvent) => void;

/**
 * Migrate old debt-based state to cost-based, same as the engine's load.ts.
 */
function migrateState(raw: Record<string, unknown>): State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = raw as any;
  if (s.debts !== undefined && s.costs === undefined) {
    s.costs = s.debts;
    delete s.debts;
  }
  if (s.partner_state) {
    if (
      s.partner_state.debt_pressure !== undefined &&
      s.partner_state.cost_pressure === undefined
    ) {
      s.partner_state.cost_pressure = s.partner_state.debt_pressure;
      delete s.partner_state.debt_pressure;
    }
  }
  return s as State;
}

function detectChanges(prev: State | null, next: State): Set<ChangeKind> {
  const changes = new Set<ChangeKind>();
  if (!prev) {
    // First load — everything changed.
    changes.add("floor");
    changes.add("pressure");
    changes.add("world_line");
    changes.add("room");
    changes.add("turn");
    if (next.costs.length > 0) changes.add("cost_added");
    if (next.meta.ended) changes.add("ended");
    return changes;
  }

  if (prev.meta.floor !== next.meta.floor) changes.add("floor");
  if (prev.meta.turn !== next.meta.turn) changes.add("turn");
  if (prev.partner_state.cost_pressure !== next.partner_state.cost_pressure)
    changes.add("pressure");
  if (prev.world_line.current !== next.world_line.current)
    changes.add("world_line");
  if (prev.current_room.id !== next.current_room.id) changes.add("room");
  if (!prev.meta.ended && next.meta.ended) changes.add("ended");
  if (
    prev.meta.perma_rewrite_token_remaining !==
    next.meta.perma_rewrite_token_remaining
  )
    changes.add("perma_token");

  // Cost changes
  const prevOpenIds = new Set(
    prev.costs.filter((c) => !c.settled).map((c) => c.id)
  );
  const nextOpenIds = new Set(
    next.costs.filter((c) => !c.settled).map((c) => c.id)
  );
  for (const id of nextOpenIds) {
    if (!prevOpenIds.has(id)) changes.add("cost_added");
  }
  for (const id of prevOpenIds) {
    if (!nextOpenIds.has(id)) changes.add("cost_settled");
  }

  return changes;
}

export class StatePoller {
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private current: State | null = null;
  private serialized = "";
  private listeners: StateListener[] = [];

  constructor(
    private url = "/run/state.json",
    private intervalMs = 500
  ) {}

  onStateChange(listener: StateListener): void {
    this.listeners.push(listener);
  }

  getCurrent(): State | null {
    return this.current;
  }

  start(): void {
    // Fetch immediately, then start polling.
    void this.poll();
    this.intervalId = setInterval(() => void this.poll(), this.intervalMs);
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async poll(): Promise<void> {
    try {
      const res = await fetch(this.url);
      if (!res.ok) return;
      const text = await res.text();
      if (text === this.serialized) return; // no change
      this.serialized = text;

      const raw = JSON.parse(text) as Record<string, unknown>;
      const next = migrateState(raw);
      const prev = this.current;
      const changes = detectChanges(prev, next);
      this.current = next;

      if (changes.size > 0) {
        const event: StateChangeEvent = { prev, next, changes };
        for (const listener of this.listeners) {
          listener(event);
        }
      }
    } catch {
      // state.json not available yet — silently ignore.
    }
  }
}
