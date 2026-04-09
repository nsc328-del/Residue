// Apply a validated diff to a State, returning the new State.
//
// This file does NOT regenerate the room — that's the generator's job in
// Phase 3. apply-diff is purely "fact set / debts / world-line / metadata".
// Persistence and history append are also handled by callers (commands/apply.ts),
// so this stays a pure function.

import type {
  Diff,
  DiffOp,
  Fact,
  Debt,
  State,
} from "../state/types.js";
import { validateDiff, debtPressure, TOP_FLOOR, type CostError } from "./cost.js";
import { nextDebtId, nextFactId } from "../utils/id.js";

export type ApplyResult =
  | { ok: true; state: State }
  | { ok: false; errors: CostError[] };

export function applyDiff(state: State, diff: Diff): ApplyResult {
  const errors = validateDiff(diff, state);
  if (errors.length > 0) {
    return { ok: false, errors };
  }

  // Work on a deep-ish clone. Facts and debts are arrays of plain objects.
  const next: State = {
    meta: { ...state.meta },
    world_line: {
      current: state.world_line.current,
      forks: [...state.world_line.forks],
    },
    facts: state.facts.map((f) => ({ ...f, tags: [...f.tags] })),
    debts: state.debts.map((d) => ({ ...d, triggers: [...d.triggers] })),
    current_room: state.current_room,
    partner_state: { ...state.partner_state },
  };

  next.meta.turn = state.meta.turn + 1;
  const turn = next.meta.turn;

  // Apply ops in declared order so the agent can sequence them meaningfully.
  for (const op of diff.operations) {
    applyOp(next, op, turn);
  }

  // Floor advancement. If the diff included jump_floor, that op already set
  // the floor. Otherwise auto-advance by 1 — every diff is one beat.
  const hadJump = diff.operations.some((o) => o.op === "jump_floor");
  if (!hadJump) {
    next.meta.floor = Math.min(TOP_FLOOR, state.meta.floor + 1);
  }

  // Auto-deactivate floor-bound facts when floor changes. Facts tagged
  // "floor_bound" are tied to the floor they were created on — they become
  // stale as soon as the player advances (e.g. "你们在第 1 层").
  if (next.meta.floor !== state.meta.floor) {
    for (const f of next.facts) {
      if (f.active && f.tags.includes("floor_bound")) {
        f.active = false;
      }
    }
  }

  // Win condition: reaching the top floor ends the run on the next end-check.
  // We don't end here automatically because the top room still needs to be
  // generated and narrated. The end-check command flips meta.ended.

  next.partner_state.debt_pressure = debtPressure(next);
  next.partner_state.last_diff_summary = summarize(diff);

  return { ok: true, state: next };
}

function applyOp(state: State, op: DiffOp, turn: number): void {
  switch (op.op) {
    case "add_fact": {
      const fact: Fact = {
        id: op.fact.id ?? nextFactId(),
        scope: op.fact.scope,
        text: op.fact.text,
        tags: [...op.fact.tags],
        active: true,
        created_at_turn: turn,
      };
      state.facts.push(fact);
      return;
    }
    case "remove_fact": {
      const target = state.facts.find((f) => f.id === op.id && f.active);
      if (target) {
        target.active = false;
      }
      return;
    }
    case "add_debt": {
      const debt: Debt = {
        id: op.debt.id ?? nextDebtId(),
        severity: op.debt.severity,
        text: op.debt.text,
        source_turn: turn,
        settled: false,
        triggers: [...op.debt.triggers],
      };
      state.debts.push(debt);
      return;
    }
    case "settle_debt": {
      const target = state.debts.find((d) => d.id === op.id && !d.settled);
      if (target) {
        target.settled = true;
      }
      return;
    }
    case "consume_perma_token": {
      state.meta.perma_rewrite_token_remaining = Math.max(
        0,
        state.meta.perma_rewrite_token_remaining - 1
      );
      return;
    }
    case "mark_worldline_fork": {
      state.world_line.forks.push({
        from: state.world_line.current,
        to: op.to,
        at_turn: turn,
        cause: op.cause,
      });
      state.world_line.current = op.to;
      return;
    }
    case "jump_floor": {
      const target = op.to;
      if (typeof target !== "number" || !Number.isFinite(target) || target < 1) {
        // Defensive: if agent passed a bad value (e.g. delta instead of
        // absolute floor), refuse silently rather than corrupting state.
        return;
      }
      state.meta.floor = Math.min(TOP_FLOOR, target);
      return;
    }
  }
}

function summarize(diff: Diff): string {
  const counts: Record<string, number> = {};
  for (const op of diff.operations) {
    counts[op.op] = (counts[op.op] ?? 0) + 1;
  }
  const parts = Object.entries(counts).map(([k, v]) => `${k}×${v}`);
  return `[${diff.player_sentence}] ${parts.join(" ")}`;
}
