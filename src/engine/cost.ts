// Cost curve. The hard rule of the game: you can rewrite anything, but
// rewriting bigger things costs more. The engine enforces this so an agent
// cannot accidentally (or deliberately) trivialize a structural change.
//
// Scope         What costs                                   Rejected if violated
// ----------    ------------------------------------------   --------------------
// local         nothing                                      —
// region        diff must add ≥1 debt of severity ≥light      yes
// structural    diff must add ≥2 debts, ≥1 of severity        yes
//               medium; AND if the removed structural fact
//               crosses world-line tag (worldline_*), the
//               diff must include mark_worldline_fork
// root          diff must include consume_perma_token, AND
//               state.meta.perma_rewrite_token_remaining ≥ 1   yes

import type { Diff, DiffOp, Fact, State, NewDebt, DebtSeverity } from "../state/types.js";

export type CostError = {
  code: string;
  message: string;
};

const SEVERITY_RANK: Record<DebtSeverity, number> = {
  light: 1,
  medium: 2,
  heavy: 3,
};

function findFact(state: State, id: string): Fact | undefined {
  return state.facts.find((f) => f.id === id && f.active);
}

function newDebtsIn(diff: Diff): NewDebt[] {
  return diff.operations
    .filter((op): op is Extract<DiffOp, { op: "add_debt" }> => op.op === "add_debt")
    .map((op) => op.debt);
}

function hasOp<K extends DiffOp["op"]>(
  diff: Diff,
  kind: K
): boolean {
  return diff.operations.some((op) => op.op === kind);
}

export const TOP_FLOOR = 15;

function jumpDelta(diff: Diff, currentFloor: number): number {
  const op = diff.operations.find(
    (o): o is Extract<DiffOp, { op: "jump_floor" }> => o.op === "jump_floor"
  );
  if (!op) return 0;
  return op.to - currentFloor;
}

export function validateDiff(diff: Diff, state: State): CostError[] {
  const errors: CostError[] = [];

  if (state.meta.ended) {
    errors.push({
      code: "ENDED",
      message: "this run is already ended; no further diffs accepted",
    });
    return errors;
  }

  // Inspect each fact removal and assess scope cost.
  const removals = diff.operations.filter(
    (op): op is Extract<DiffOp, { op: "remove_fact" }> => op.op === "remove_fact"
  );
  const debts = newDebtsIn(diff);
  const debtCount = debts.length;
  const hasMedium = debts.some((d) => SEVERITY_RANK[d.severity] >= SEVERITY_RANK.medium);
  const hasLight = debts.some((d) => SEVERITY_RANK[d.severity] >= SEVERITY_RANK.light);

  let removedRoot = false;
  let removedStructural = false;
  let removedStructuralCrossesWorldline = false;
  let removedRegion = false;

  // A jump_floor with delta > 1 counts as a structural-cost action.
  const jump = jumpDelta(diff, state.meta.floor);
  if (jump < 0) {
    errors.push({
      code: "JUMP_BACKWARDS",
      message: "jump_floor.to must be greater than or equal to current floor",
    });
  }
  if (jump > 1) {
    // Treat large jumps as structural-cost. The agent stays free to also
    // include mark_worldline_fork on top, but it isn't auto-required.
    removedStructural = true;
  }

  for (const op of removals) {
    const fact = findFact(state, op.id);
    if (!fact) {
      errors.push({
        code: "FACT_NOT_FOUND",
        message: `cannot remove fact '${op.id}': not found or already inactive`,
      });
      continue;
    }
    switch (fact.scope) {
      case "root":
        removedRoot = true;
        break;
      case "structural":
        removedStructural = true;
        if (fact.tags.some((t) => t.startsWith("worldline_"))) {
          removedStructuralCrossesWorldline = true;
        }
        break;
      case "region":
        removedRegion = true;
        break;
      case "local":
        break;
    }
  }

  if (removedRoot) {
    if (!hasOp(diff, "consume_perma_token")) {
      errors.push({
        code: "ROOT_REQUIRES_TOKEN",
        message:
          "removing a root fact requires a consume_perma_token op in the same diff",
      });
    } else if (state.meta.perma_rewrite_token_remaining < 1) {
      errors.push({
        code: "NO_PERMA_TOKEN",
        message: "no perma_rewrite_token remaining for this run",
      });
    }
  }

  if (removedStructural) {
    if (debtCount < 2) {
      errors.push({
        code: "STRUCTURAL_NEEDS_TWO_DEBTS",
        message:
          "structural rewrites must add at least 2 debts in the same diff (got " +
          debtCount +
          ")",
      });
    }
    if (!hasMedium) {
      errors.push({
        code: "STRUCTURAL_NEEDS_MEDIUM",
        message:
          "structural rewrites require at least 1 medium-severity debt in the same diff",
      });
    }
    if (removedStructuralCrossesWorldline && !hasOp(diff, "mark_worldline_fork")) {
      errors.push({
        code: "WORLDLINE_FORK_MISSING",
        message:
          "removing a structural fact tagged worldline_* requires mark_worldline_fork in the same diff",
      });
    }
  }

  if (removedRegion && !removedStructural && !removedRoot) {
    if (!hasLight) {
      errors.push({
        code: "REGION_NEEDS_LIGHT_DEBT",
        message:
          "region rewrites must add at least 1 debt (severity ≥ light) in the same diff",
      });
    }
  }

  // mark_worldline_fork without an actual structural removal is suspicious.
  if (hasOp(diff, "mark_worldline_fork") && !removedStructural) {
    errors.push({
      code: "WORLDLINE_FORK_WITHOUT_STRUCTURAL",
      message:
        "mark_worldline_fork is only valid when the diff also removes a structural fact",
    });
  }

  // consume_perma_token without root removal is suspicious.
  if (hasOp(diff, "consume_perma_token") && !removedRoot) {
    errors.push({
      code: "TOKEN_WITHOUT_ROOT",
      message: "consume_perma_token is only valid when the diff also removes a root fact",
    });
  }

  return errors;
}

export function debtPressure(state: State): number {
  let pressure = 0;
  for (const d of state.debts) {
    if (d.settled) continue;
    pressure += { light: 10, medium: 25, heavy: 50 }[d.severity];
  }
  return Math.min(100, pressure);
}
