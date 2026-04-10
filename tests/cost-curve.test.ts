import { describe, it, expect } from "vitest";
import { validateDiff } from "../src/engine/cost.js";
import type { State, Diff, Fact } from "../src/state/types.js";

function mkFact(partial: Partial<Fact> & Pick<Fact, "id" | "scope">): Fact {
  return {
    text: "test fact",
    tags: [],
    active: true,
    created_at_turn: 0,
    ...partial,
  };
}

function mkState(facts: Fact[]): State {
  return {
    meta: {
      run_id: "test",
      seed: 1,
      floor: 1,
      turn: 0,
      started_at: "2026-01-01T00:00:00Z",
      ended: false,
      perma_rewrite_token_remaining: 1,
      low_pressure_turns: 0,
    },
    world_line: { current: "original", forks: [] },
    facts,
    costs: [],
    current_room: {
      id: "r0",
      template_id: "tpl0",
      theme: "original",
      floor: 1,
      anchors: [],
      obstacle: "",
      exits: [],
      active_fact_ids: [],
      generated_from: [],
    },
    partner_state: { cost_pressure: 0, end_readiness: 0, last_diff_summary: null },
  };
}

function mkDiff(ops: Diff["operations"]): Diff {
  return {
    player_sentence: "test sentence",
    rationale: "test rationale",
    operations: ops,
  };
}

describe("cost curve", () => {
  describe("local scope", () => {
    it("allows free local removal", () => {
      const state = mkState([mkFact({ id: "f1", scope: "local" })]);
      const diff = mkDiff([{ op: "remove_fact", id: "f1" }]);
      expect(validateDiff(diff, state)).toEqual([]);
    });

    it("allows free local addition", () => {
      const state = mkState([]);
      const diff = mkDiff([
        { op: "add_fact", fact: { scope: "local", text: "new", tags: [] } },
      ]);
      expect(validateDiff(diff, state)).toEqual([]);
    });
  });

  describe("region scope", () => {
    it("rejects region removal without a cost", () => {
      const state = mkState([mkFact({ id: "f1", scope: "region" })]);
      const diff = mkDiff([{ op: "remove_fact", id: "f1" }]);
      const errors = validateDiff(diff, state);
      expect(errors.map((e) => e.code)).toContain("REGION_NEEDS_LIGHT_COST");
    });

    it("accepts region removal with a light cost", () => {
      const state = mkState([mkFact({ id: "f1", scope: "region" })]);
      const diff = mkDiff([
        { op: "remove_fact", id: "f1" },
        {
          op: "add_cost",
          cost: { severity: "light", text: "x", triggers: [] },
        },
      ]);
      expect(validateDiff(diff, state)).toEqual([]);
    });
  });

  describe("structural scope", () => {
    it("rejects structural removal without 2 costs", () => {
      const state = mkState([mkFact({ id: "f1", scope: "structural" })]);
      const diff = mkDiff([
        { op: "remove_fact", id: "f1" },
        {
          op: "add_cost",
          cost: { severity: "medium", text: "x", triggers: [] },
        },
      ]);
      const errors = validateDiff(diff, state);
      expect(errors.map((e) => e.code)).toContain("STRUCTURAL_NEEDS_TWO_COSTS");
    });

    it("rejects structural removal without a medium cost", () => {
      const state = mkState([mkFact({ id: "f1", scope: "structural" })]);
      const diff = mkDiff([
        { op: "remove_fact", id: "f1" },
        { op: "add_cost", cost: { severity: "light", text: "x", triggers: [] } },
        { op: "add_cost", cost: { severity: "light", text: "y", triggers: [] } },
      ]);
      const errors = validateDiff(diff, state);
      expect(errors.map((e) => e.code)).toContain("STRUCTURAL_NEEDS_MEDIUM");
    });

    it("accepts structural removal with 2 costs including a medium", () => {
      const state = mkState([mkFact({ id: "f1", scope: "structural" })]);
      const diff = mkDiff([
        { op: "remove_fact", id: "f1" },
        { op: "add_cost", cost: { severity: "medium", text: "x", triggers: [] } },
        { op: "add_cost", cost: { severity: "light", text: "y", triggers: [] } },
      ]);
      expect(validateDiff(diff, state)).toEqual([]);
    });

    it("requires worldline fork op when structural fact has worldline_ tag", () => {
      const state = mkState([
        mkFact({ id: "f1", scope: "structural", tags: ["worldline_original"] }),
      ]);
      const diff = mkDiff([
        { op: "remove_fact", id: "f1" },
        { op: "add_cost", cost: { severity: "medium", text: "x", triggers: [] } },
        { op: "add_cost", cost: { severity: "light", text: "y", triggers: [] } },
      ]);
      const errors = validateDiff(diff, state);
      expect(errors.map((e) => e.code)).toContain("WORLDLINE_FORK_MISSING");
    });

    it("accepts a full worldline fork diff", () => {
      const state = mkState([
        mkFact({ id: "f1", scope: "structural", tags: ["worldline_original"] }),
      ]);
      const diff = mkDiff([
        { op: "remove_fact", id: "f1" },
        { op: "add_cost", cost: { severity: "medium", text: "x", triggers: [] } },
        { op: "add_cost", cost: { severity: "light", text: "y", triggers: [] } },
        { op: "mark_worldline_fork", to: "unowned_region", cause: "skip" },
      ]);
      expect(validateDiff(diff, state)).toEqual([]);
    });
  });

  describe("root scope", () => {
    it("rejects root removal without a perma token op", () => {
      const state = mkState([mkFact({ id: "f1", scope: "root" })]);
      const diff = mkDiff([{ op: "remove_fact", id: "f1" }]);
      const errors = validateDiff(diff, state);
      expect(errors.map((e) => e.code)).toContain("ROOT_REQUIRES_TOKEN");
    });

    it("accepts root removal when token is present and available", () => {
      const state = mkState([mkFact({ id: "f1", scope: "root" })]);
      const diff = mkDiff([
        { op: "remove_fact", id: "f1" },
        { op: "consume_perma_token" },
      ]);
      expect(validateDiff(diff, state)).toEqual([]);
    });

    it("rejects root removal when token already spent", () => {
      const state = mkState([mkFact({ id: "f1", scope: "root" })]);
      state.meta.perma_rewrite_token_remaining = 0;
      const diff = mkDiff([
        { op: "remove_fact", id: "f1" },
        { op: "consume_perma_token" },
      ]);
      const errors = validateDiff(diff, state);
      expect(errors.map((e) => e.code)).toContain("NO_PERMA_TOKEN");
    });
  });

  describe("misc", () => {
    it("rejects diffs after the run has ended", () => {
      const state = mkState([mkFact({ id: "f1", scope: "local" })]);
      state.meta.ended = { reason: "top", floor: 15 };
      const diff = mkDiff([{ op: "remove_fact", id: "f1" }]);
      const errors = validateDiff(diff, state);
      expect(errors.map((e) => e.code)).toContain("ENDED");
    });

    it("rejects mark_worldline_fork without a structural removal", () => {
      const state = mkState([mkFact({ id: "f1", scope: "local" })]);
      const diff = mkDiff([
        { op: "remove_fact", id: "f1" },
        { op: "mark_worldline_fork", to: "x", cause: "no" },
      ]);
      const errors = validateDiff(diff, state);
      expect(errors.map((e) => e.code)).toContain("WORLDLINE_FORK_WITHOUT_STRUCTURAL");
    });

    it("rejects consume_perma_token without a root removal", () => {
      const state = mkState([mkFact({ id: "f1", scope: "local" })]);
      const diff = mkDiff([
        { op: "remove_fact", id: "f1" },
        { op: "consume_perma_token" },
      ]);
      const errors = validateDiff(diff, state);
      expect(errors.map((e) => e.code)).toContain("TOKEN_WITHOUT_ROOT");
    });

    it("rejects removing a non-existent fact", () => {
      const state = mkState([]);
      const diff = mkDiff([{ op: "remove_fact", id: "f_ghost" }]);
      const errors = validateDiff(diff, state);
      expect(errors.map((e) => e.code)).toContain("FACT_NOT_FOUND");
    });

    it("floor_skip tag bypasses structural cost for +2 jump", () => {
      const state = mkState([
        mkFact({ id: "f_skip", scope: "local", tags: ["floor_skip"] }),
      ]);
      state.meta.floor = 5;
      // Jump from 5 to 7 (+2) with floor_skip — should NOT need structural costs
      const diff = mkDiff([{ op: "jump_floor", to: 7 }]);
      const errors = validateDiff(diff, state);
      expect(errors.length).toBe(0);
    });

    it("floor_skip tag does NOT bypass structural cost for +3 jump", () => {
      const state = mkState([
        mkFact({ id: "f_skip", scope: "local", tags: ["floor_skip"] }),
      ]);
      state.meta.floor = 5;
      // Jump from 5 to 8 (+3) — floor_skip only works for +2
      const diff = mkDiff([{ op: "jump_floor", to: 8 }]);
      const errors = validateDiff(diff, state);
      expect(errors.map((e) => e.code)).toContain("STRUCTURAL_NEEDS_TWO_COSTS");
    });
  });
});

// ── pressure_mod + endReadiness tests ──

import { costPressure, endReadiness } from "../src/engine/cost.js";

describe("costPressure with pressure_mod tags", () => {
  it("pressure_mod_minus reduces effective pressure", () => {
    const state = mkState([
      mkFact({ id: "f_mod", scope: "local", tags: ["pressure_mod_minus10"] }),
    ]);
    state.costs.push({
      id: "c1",
      severity: "medium",
      text: "test",
      source_turn: 0,
      settled: false,
      triggers: [],
    });
    // medium = 25 base, -10 from mod = 15
    expect(costPressure(state)).toBe(15);
  });

  it("pressure_mod_plus increases effective pressure", () => {
    const state = mkState([
      mkFact({ id: "f_mod", scope: "local", tags: ["pressure_mod_plus15"] }),
    ]);
    // No costs, but +15 from mod
    expect(costPressure(state)).toBe(15);
  });

  it("pressure is clamped to 0-100", () => {
    const state = mkState([
      mkFact({ id: "f_mod", scope: "local", tags: ["pressure_mod_minus50"] }),
    ]);
    // No costs, -50 from mod — should clamp to 0
    expect(costPressure(state)).toBe(0);
  });
});

describe("endReadiness", () => {
  it("returns low value at floor 1 with no history", () => {
    const state = mkState();
    state.meta.floor = 1;
    expect(endReadiness(state)).toBeLessThan(10);
  });

  it("rises with floor progression", () => {
    const state = mkState();
    state.meta.floor = 15;
    const r15 = endReadiness(state);
    state.meta.floor = 30;
    const r30 = endReadiness(state);
    expect(r15).toBeGreaterThan(0);
    expect(r30).toBeGreaterThan(r15);
  });

  it("rises with cost resolution", () => {
    const state = mkState();
    state.meta.floor = 15;
    state.costs = [
      { id: "c1", severity: "light", text: "x", source_turn: 1, settled: false, triggers: [] },
      { id: "c2", severity: "light", text: "y", source_turn: 2, settled: true, triggers: [] },
    ];
    const withPartial = endReadiness(state);
    state.costs[0]!.settled = true;
    const withAll = endReadiness(state);
    expect(withAll).toBeGreaterThan(withPartial);
  });

  it("rises with low_pressure_turns stagnation", () => {
    const state = mkState();
    state.meta.floor = 10;
    state.meta.low_pressure_turns = 0;
    const base = endReadiness(state);
    state.meta.low_pressure_turns = 5;
    const stagnant = endReadiness(state);
    expect(stagnant).toBeGreaterThan(base);
  });
});
