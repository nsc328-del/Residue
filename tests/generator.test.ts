import { describe, it, expect } from "vitest";
import { generateRoom } from "../src/engine/generator.js";
import type { State, Fact } from "../src/state/types.js";

function mkFact(partial: Partial<Fact> & Pick<Fact, "id" | "scope">): Fact {
  return {
    text: "",
    tags: [],
    active: true,
    created_at_turn: 0,
    ...partial,
  };
}

function mkState(floor: number, facts: Fact[] = []): State {
  return {
    meta: {
      run_id: "test",
      seed: 7,
      floor,
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
      floor,
      anchors: [],
      obstacle: "",
      exits: [],
      active_fact_ids: [],
      generated_from: [],
    },
    partner_state: { cost_pressure: 0, end_readiness: 0, last_diff_summary: null },
  };
}

describe("generator", () => {
  it("picks a node template on a node floor", () => {
    const state = mkState(5, [mkFact({ id: "f1", scope: "region", tags: ["barrier"] })]);
    const room = generateRoom(state);
    expect(room.template_id).toBe("tpl_o_5_node_barrier");
    expect(room.exits.some((e) => e.kind === "structural")).toBe(true);
  });

  it("does not pick a node template on a non-node floor", () => {
    const state = mkState(3, [mkFact({ id: "f1", scope: "region", tags: ["scanner"] })]);
    const room = generateRoom(state);
    expect(room.template_id).not.toContain("node");
  });

  it("falls back when nothing matches", () => {
    const state = mkState(3, []);
    state.world_line.current = "no_such_theme";
    const room = generateRoom(state);
    expect(room.template_id).toBe("tpl_fallback");
  });

  it("is deterministic for a given seed and turn", () => {
    const a = mkState(3, [mkFact({ id: "f1", scope: "region", tags: ["scanner"] })]);
    const b = mkState(3, [mkFact({ id: "f1", scope: "region", tags: ["scanner"] })]);
    expect(generateRoom(a).template_id).toBe(generateRoom(b).template_id);
  });
});
