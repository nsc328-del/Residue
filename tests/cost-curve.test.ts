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
    partner_state: { cost_pressure: 0, last_diff_summary: null },
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
  });
});
