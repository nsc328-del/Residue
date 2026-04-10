import { describe, it, expect } from "vitest";
import { applyDiff } from "../src/engine/apply-diff.js";
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

function mkState(facts: Fact[] = []): State {
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
    player_sentence: "撕开维护井",
    rationale: "玩家想直接从井道上行",
    operations: ops,
  };
}

describe("applyDiff", () => {
  it("returns errors when validation fails", () => {
    const state = mkState([mkFact({ id: "f1", scope: "region" })]);
    const diff = mkDiff([{ op: "remove_fact", id: "f1" }]); // missing cost
    const result = applyDiff(state, diff);
    expect(result.ok).toBe(false);
  });

  it("marks removed facts inactive but keeps them in array", () => {
    const state = mkState([mkFact({ id: "f1", scope: "local", text: "old" })]);
    const diff = mkDiff([{ op: "remove_fact", id: "f1" }]);
    const result = applyDiff(state, diff);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.facts.length).toBe(1);
    expect(result.state.facts[0]!.active).toBe(false);
  });

  it("adds new facts as active with current turn", () => {
    const state = mkState();
    const diff = mkDiff([
      { op: "add_fact", fact: { scope: "local", text: "new", tags: ["x"] } },
    ]);
    const result = applyDiff(state, diff);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.facts).toHaveLength(1);
    expect(result.state.facts[0]!.active).toBe(true);
    expect(result.state.facts[0]!.created_at_turn).toBe(1);
  });

  it("adds costs and updates pressure", () => {
    const state = mkState([mkFact({ id: "f1", scope: "region" })]);
    const diff = mkDiff([
      { op: "remove_fact", id: "f1" },
      { op: "add_cost", cost: { severity: "light", text: "x", triggers: [] } },
    ]);
    const result = applyDiff(state, diff);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.costs).toHaveLength(1);
    expect(result.state.partner_state.cost_pressure).toBe(10);
  });

  it("settles a cost and recalculates pressure", () => {
    const state = mkState();
    state.costs = [
      {
        id: "c1",
        severity: "heavy",
        text: "追兵倒灌",
        source_turn: 0,
        settled: false,
        triggers: ["backflow"],
      },
    ];
    const diff = mkDiff([{ op: "settle_cost", id: "c1" }]);
    const result = applyDiff(state, diff);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.costs[0]!.settled).toBe(true);
    expect(result.state.partner_state.cost_pressure).toBe(0);
  });

  it("forks worldline and decrements perma token correctly", () => {
    const state = mkState([
      mkFact({ id: "f1", scope: "structural", tags: ["worldline_original"] }),
    ]);
    const diff = mkDiff([
      { op: "remove_fact", id: "f1" },
      { op: "add_cost", cost: { severity: "medium", text: "x", triggers: [] } },
      { op: "add_cost", cost: { severity: "light", text: "y", triggers: [] } },
      { op: "mark_worldline_fork", to: "unowned_region", cause: "skipped layers" },
    ]);
    const result = applyDiff(state, diff);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.world_line.current).toBe("unowned_region");
    expect(result.state.world_line.forks).toHaveLength(1);
    expect(result.state.world_line.forks[0]!.from).toBe("original");
  });

  it("consumes perma token on root removal", () => {
    const state = mkState([mkFact({ id: "f1", scope: "root" })]);
    const diff = mkDiff([
      { op: "remove_fact", id: "f1" },
      { op: "consume_perma_token" },
    ]);
    const result = applyDiff(state, diff);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.meta.perma_rewrite_token_remaining).toBe(0);
  });

  it("does not mutate the input state", () => {
    const state = mkState([mkFact({ id: "f1", scope: "local" })]);
    const before = JSON.stringify(state);
    const diff = mkDiff([{ op: "remove_fact", id: "f1" }]);
    applyDiff(state, diff);
    expect(JSON.stringify(state)).toBe(before);
  });

  it("increments turn", () => {
    const state = mkState();
    const diff = mkDiff([
      { op: "add_fact", fact: { scope: "local", text: "x", tags: [] } },
    ]);
    const result = applyDiff(state, diff);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.meta.turn).toBe(1);
  });

  it("jump_floor with invalid to value does not corrupt state", () => {
    const state = mkState([
      mkFact({ id: "f1", scope: "structural", tags: [] }),
    ]);
    state.meta.floor = 13;
    // Simulate agent passing delta instead of absolute floor
    const diff = mkDiff([
      { op: "remove_fact", id: "f1" },
      { op: "add_cost", cost: { severity: "medium", text: "x", triggers: [] } },
      { op: "add_cost", cost: { severity: "light", text: "y", triggers: [] } },
      { op: "jump_floor", to: undefined as unknown as number },
    ]);
    const result = applyDiff(state, diff);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // jump_floor should be silently ignored; auto-advance still applies
    expect(typeof result.state.meta.floor).toBe("number");
    expect(Number.isFinite(result.state.meta.floor)).toBe(true);
  });

  it("auto-deactivates floor_bound facts on floor change", () => {
    const state = mkState([
      mkFact({ id: "f_pos", scope: "local", tags: ["position", "floor_bound"] }),
      mkFact({ id: "f_perm", scope: "structural", tags: ["order"] }),
    ]);
    const diff = mkDiff([
      { op: "add_fact", fact: { scope: "local", text: "x", tags: [] } },
    ]);
    const result = applyDiff(state, diff);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // floor_bound fact should be deactivated after floor advance
    expect(result.state.facts.find((f) => f.id === "f_pos")!.active).toBe(false);
    // non-floor_bound fact should remain active
    expect(result.state.facts.find((f) => f.id === "f_perm")!.active).toBe(true);
  });

  it("cost_shield auto-settles matching cost and deactivates shield fact", () => {
    const state = mkState([
      mkFact({
        id: "f_shield",
        scope: "local",
        tags: ["cost_shield_light"],
      }),
    ]);
    const diff = mkDiff([
      {
        op: "add_cost",
        cost: { severity: "light", text: "a light cost", triggers: [] },
      },
    ]);
    const result = applyDiff(state, diff);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // The cost should be auto-settled
    const cost = result.state.costs[0]!;
    expect(cost.settled).toBe(true);
    // The shield fact should be deactivated
    expect(result.state.facts.find((f) => f.id === "f_shield")!.active).toBe(false);
  });

  it("cost_shield does not trigger for mismatched severity", () => {
    const state = mkState([
      mkFact({
        id: "f_shield",
        scope: "local",
        tags: ["cost_shield_medium"],
      }),
    ]);
    const diff = mkDiff([
      {
        op: "add_cost",
        cost: { severity: "light", text: "a light cost", triggers: [] },
      },
    ]);
    const result = applyDiff(state, diff);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // Cost should NOT be settled (shield is medium, cost is light)
    expect(result.state.costs[0]!.settled).toBe(false);
    // Shield fact should remain active
    expect(result.state.facts.find((f) => f.id === "f_shield")!.active).toBe(true);
  });

  it("tracks low_pressure_turns and computes end_readiness", () => {
    const state = mkState();
    state.meta.floor = 14;
    // No costs = pressure 0 = low pressure
    const diff = mkDiff([
      { op: "add_fact", fact: { scope: "local", text: "x", tags: [] } },
    ]);
    const r1 = applyDiff(state, diff);
    expect(r1.ok).toBe(true);
    if (!r1.ok) return;
    expect(r1.state.meta.low_pressure_turns).toBe(1);
    expect(r1.state.partner_state.end_readiness).toBeGreaterThan(0);

    // Second turn — low pressure streak continues
    const r2 = applyDiff(r1.state, diff);
    expect(r2.ok).toBe(true);
    if (!r2.ok) return;
    expect(r2.state.meta.low_pressure_turns).toBe(2);
  });

  it("resets low_pressure_turns when pressure rises above 20", () => {
    const state = mkState();
    state.meta.low_pressure_turns = 5;
    // Add a medium cost to push pressure to 25
    const diff = mkDiff([
      {
        op: "add_cost",
        cost: { severity: "medium", text: "heavy stuff", triggers: [] },
      },
    ]);
    const result = applyDiff(state, diff);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.meta.low_pressure_turns).toBe(0);
    expect(result.state.partner_state.cost_pressure).toBe(25);
  });

  it("invalid jump_floor falls through to auto-advance", () => {
    const state = mkState();
    state.meta.floor = 5;
    const diff = mkDiff([
      { op: "jump_floor", to: undefined as unknown as number },
    ]);
    const result = applyDiff(state, diff);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    // Should auto-advance to 6 since invalid jump didn't change floor
    expect(result.state.meta.floor).toBe(6);
  });
});
