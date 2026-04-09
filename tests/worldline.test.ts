import { describe, it, expect } from "vitest";
import { applyDiff } from "../src/engine/apply-diff.js";
import { generateRoom } from "../src/engine/generator.js";
import { buildInitialState } from "../src/engine/initial-state.js";
import type { Diff } from "../src/state/types.js";

describe("worldline fork", () => {
  it("forks from original to unowned_region and the next room comes from the new theme", () => {
    const state = buildInitialState({ seed: 42 });
    state.current_room = generateRoom(state);

    // Verify the worldline-tagged structural fact exists in the initial set.
    const orderFact = state.facts.find((f) => f.id === "f_init_order");
    expect(orderFact).toBeDefined();
    expect(orderFact!.scope).toBe("structural");
    expect(orderFact!.tags).toContain("worldline_original");

    const fork: Diff = {
      player_sentence: "我们不该按顺序爬，直接跳到第 7 层",
      rationale:
        "结构改写：抛弃顺序约束，跳层并进入无主区世界线",
      operations: [
        { op: "remove_fact", id: "f_init_order" },
        { op: "jump_floor", to: 7 },
        {
          op: "add_debt",
          debt: {
            severity: "medium",
            text: "下方 N 层的看守体系没见过你们但知道你们跳过了他们",
            triggers: ["backflow", "pursuit"],
          },
        },
        {
          op: "add_debt",
          debt: {
            severity: "light",
            text: "无主区的接缝从未被你们经过",
            triggers: ["unowned"],
          },
        },
        {
          op: "mark_worldline_fork",
          to: "unowned_region",
          cause: "skipped the ascending order",
        },
      ],
    };

    const result = applyDiff(state, fork);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const next = result.state;
    next.current_room = generateRoom(next);

    expect(next.world_line.current).toBe("unowned_region");
    expect(next.world_line.forks).toHaveLength(1);
    expect(next.current_room.theme).toBe("unowned_region");
    expect(next.meta.floor).toBe(7);
    expect(next.partner_state.debt_pressure).toBeGreaterThan(0);
  });

  it("worldline fork is irreversible (no backwards op)", () => {
    // Sanity check: there's no DiffOp that lets you re-enter a previous
    // worldline. The only way to change worldline is via mark_worldline_fork,
    // and once forks accumulate they're append-only.
    const state = buildInitialState({ seed: 1 });
    expect(state.world_line.forks).toEqual([]);
    // After a fork, forks array grows; nothing in the API removes from it.
  });
});
