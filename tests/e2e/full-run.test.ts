// End-to-end: simulate a "fake agent" playing the full 15 floors. Two paths:
//   - Conservative: stay on the original world line, mostly local rewrites,
//     take the temptation on floor 3, settle the cost on floor 10.
//   - Adventurous: trigger a worldline fork around floor 5, ride the unowned
//     region world line to the top.
//
// This test covers the architecture end-to-end without an LLM in the loop.
// Anything content-shaped (template ids, fact ids) is asserted as structural
// invariants — not as exact prose.

import { describe, it, expect } from "vitest";
import { applyDiff } from "../../src/engine/apply-diff.js";
import { generateRoom } from "../../src/engine/generator.js";
import { buildInitialState } from "../../src/engine/initial-state.js";
import type { Diff, State } from "../../src/state/types.js";

function step(state: State, diff: Diff): State {
  const result = applyDiff(state, diff);
  if (!result.ok) {
    throw new Error(
      "diff rejected: " + result.errors.map((e) => `${e.code} ${e.message}`).join("; ")
    );
  }
  const next = result.state;
  next.current_room = generateRoom(next);
  return next;
}

function startRun(seed: number): State {
  const state = buildInitialState({ seed, story: "residue" });
  state.current_room = generateRoom(state);
  return state;
}

// ----- Helpers to make the test bodies readable -----

const local = (sentence: string, factText: string): Diff => ({
  player_sentence: sentence,
  rationale: "local rewrite",
  operations: [
    {
      op: "add_fact",
      fact: { scope: "local", text: factText, tags: ["passage"] },
    },
  ],
});

const localWithRemove = (
  sentence: string,
  removeId: string,
  newFactText: string
): Diff => ({
  player_sentence: sentence,
  rationale: "local rewrite with removal",
  operations: [
    { op: "remove_fact", id: removeId },
    {
      op: "add_fact",
      fact: { scope: "local", text: newFactText, tags: ["passage"] },
    },
  ],
});

const grabIdentity = (sentence: string): Diff => ({
  player_sentence: sentence,
  rationale: "贪一手身份残片",
  operations: [
    {
      op: "add_fact",
      fact: {
        scope: "local",
        text: "你们摘走了那片身份残片",
        tags: ["identity", "loot"],
      },
    },
    {
      op: "add_cost",
      cost: {
        severity: "light",
        text: "你们带走了一片不属于你们的身份残片",
        triggers: ["identity_doubt"],
      },
    },
  ],
});

describe("e2e full run — conservative path", () => {
  it("walks 15 floors on the original world line, takes the bait on floor 3, settles a heavy cost on floor 10", () => {
    let s = startRun(1);
    expect(s.current_room.floor).toBe(1);
    expect(s.current_room.theme).toBe("original");

    // Floor 1 → 2
    s = step(s, localWithRemove("撕开维护井", "f_init_shaft", "维护井被撕开"));
    expect(s.meta.floor).toBe(2);

    // Floor 2 → 3
    s = step(s, local("贴墙绕过", "贴着墙缝绕过去了"));
    expect(s.meta.floor).toBe(3);
    expect(s.current_room.template_id).toBe("tpl_o_3_temptation");

    // Floor 3 → 4 (take the bait)
    s = step(s, grabIdentity("顺手把身份残片摘走"));
    expect(s.meta.floor).toBe(4);
    expect(s.costs.filter((c) => !c.settled)).toHaveLength(1);
    // The echo template should be the one selected on floor 4 because we owe
    // an identity_doubt cost.
    expect(s.current_room.template_id).toBe("tpl_o_4_echo");

    // Floor 4 → 5 (the central node)
    s = step(s, local("贴着扫描网的缝隙过去", "我们挤过了那张密扫描网"));
    expect(s.meta.floor).toBe(5);
    expect(s.current_room.template_id).toBe("tpl_o_5_node_barrier");
    expect(s.current_room.exits.some((e) => e.kind === "structural")).toBe(true);

    // Conservative: don't take the structural exit. Region rewrite the wall.
    s = step(s, {
      player_sentence: "把这堵墙的管辖偷走",
      rationale: "region rewrite — wall no longer applies to us",
      operations: [
        {
          op: "add_fact",
          fact: {
            scope: "region",
            text: "封控墙的管辖被你们偷走了",
            tags: ["jurisdiction"],
          },
        },
        {
          op: "add_cost",
          cost: {
            severity: "light",
            text: "本层的封控权属在账本上有缺口",
            triggers: ["scanner_density+"],
          },
        },
      ],
    });
    expect(s.meta.floor).toBe(6);

    // Floors 6, 7, 8, 9 — generic walking. The generator may pick the
    // identity_doubt callback room since we still owe that cost.
    for (let i = 0; i < 4; i++) {
      s = step(s, local("继续往上", "我们穿过了这一层"));
    }
    expect(s.meta.floor).toBe(10);

    // Floor 10 should be a node. With only light costs open we expect the
    // light_burst variant (not the heavy repay node).
    expect(s.current_room.template_id).toBe("tpl_o_10_node_light_burst");

    // Settle the identity cost by transferring it.
    const identityCost = s.costs.find((c) => !c.settled && c.triggers.includes("identity_doubt"));
    expect(identityCost).toBeDefined();
    s = step(s, {
      player_sentence: "把那块身份还回去",
      rationale: "settle the identity cost",
      operations: [{ op: "settle_cost", id: identityCost!.id }],
    });
    expect(s.meta.floor).toBe(11);

    // Floors 11-14 — aftermath
    for (let i = 0; i < 4; i++) {
      s = step(s, local("继续往上", "我们继续往上"));
    }
    expect(s.meta.floor).toBe(15);
    // Floor 15 is a node floor — should pick a node template (repeating or
    // endgame depending on readiness). Endgame requires endgame_ready tag.
    expect(s.current_room.template_id).toMatch(/^tpl_o_(15_top|node_)/);

    // The top room should reference active facts (via active_fact_ids list).
    expect(s.current_room.active_fact_ids.length).toBeGreaterThan(0);
    expect(s.world_line.current).toBe("original");
  });
});

describe("e2e full run — adventurous path", () => {
  it("forks to unowned_region around floor 5 and rides it to the top", () => {
    let s = startRun(2);

    // Floors 1, 2, 3, 4 — uneventful local moves; don't take the bait.
    s = step(s, localWithRemove("撕开维护井", "f_init_shaft", "维护井被撕开"));
    s = step(s, local("贴墙绕过", "我们绕过了警报"));
    s = step(s, local("不拿那东西，直接走", "我们留下了那两片东西"));
    s = step(s, local("穿过去", "我们穿过了空旷段"));
    expect(s.meta.floor).toBe(5);
    expect(s.current_room.template_id).toBe("tpl_o_5_node_barrier");

    // The愿望级 sentence: jump multiple floors AND fork worldline.
    s = step(s, {
      player_sentence: "我们直接跳到第 8 层，不再按顺序爬",
      rationale: "structural rewrite + worldline fork",
      operations: [
        { op: "remove_fact", id: "f_init_order" },
        { op: "jump_floor", to: 8 },
        {
          op: "add_cost",
          cost: {
            severity: "medium",
            text: "下方 N 层的看守体系没见过你们但知道你们跳过了他们",
            triggers: ["backflow", "pursuit"],
          },
        },
        {
          op: "add_cost",
          cost: {
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
    });
    expect(s.meta.floor).toBe(8);
    expect(s.world_line.current).toBe("unowned_region");
    expect(s.current_room.theme).toBe("unowned_region");

    // Floor 9 — keep getting pushed up
    s = step(s, local("被推着继续上", "我们被推上了第 9 层"));
    expect(s.meta.floor).toBe(9);

    // Floor 10 — node, repay variant because backflow + pursuit are open
    s = step(s, local("塞住下方通道", "我们堵住了一段通道"));
    expect(s.meta.floor).toBe(10);
    expect(s.current_room.template_id).toBe("tpl_ur_10_node_repay");

    // Settle the heavy cost by accepting it (structural)
    const backflowCost = s.costs.find(
      (c) => !c.settled && c.triggers.includes("backflow")
    );
    expect(backflowCost).toBeDefined();
    s = step(s, {
      player_sentence: "让世界以为我们一层一层穿过来过",
      rationale: "forge a passage record — light-cost-for-medium-cost swap",
      operations: [
        { op: "settle_cost", id: backflowCost!.id },
        {
          op: "add_cost",
          cost: {
            severity: "light",
            text: "那段穿过记录是伪造的",
            triggers: ["forged_record", "forged_break"],
          },
        },
      ],
    });
    expect(s.meta.floor).toBe(11);

    // Floors 11-14 — aftermath in unowned_region
    for (let i = 0; i < 4; i++) {
      s = step(s, local("继续往上", "我们继续往上"));
    }
    expect(s.meta.floor).toBe(15);
    // Floor 15 node — repeating or endgame depending on readiness
    expect(s.current_room.template_id).toMatch(/^tpl_ur_(15_top|node_)/);
    expect(s.world_line.current).toBe("unowned_region");
  });
});

describe("e2e — engine guarantees", () => {
  it("rejects diffs after end-check has set ended", () => {
    let s = startRun(3);
    s.meta.floor = 15;
    s.meta.ended = { reason: "reached_top", floor: 15 };
    const result = applyDiff(s, {
      player_sentence: "still talking",
      rationale: "should be blocked",
      operations: [
        { op: "add_fact", fact: { scope: "local", text: "x", tags: [] } },
      ],
    });
    expect(result.ok).toBe(false);
  });

  it("advances beyond floor 15 (no hard cap)", () => {
    let s = startRun(4);
    s.meta.floor = 14;
    const result = applyDiff(s, {
      player_sentence: "再走一步",
      rationale: "should reach 15",
      operations: [
        { op: "add_fact", fact: { scope: "local", text: "ok", tags: [] } },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.state.meta.floor).toBe(15);
    // Auto-advance from 15 should now go to 16 (no cap).
    const r2 = applyDiff(result.state, {
      player_sentence: "再一步",
      rationale: "no cap test",
      operations: [
        { op: "add_fact", fact: { scope: "local", text: "ok", tags: [] } },
      ],
    });
    expect(r2.ok).toBe(true);
    if (!r2.ok) return;
    expect(r2.state.meta.floor).toBe(16);
  });
});
