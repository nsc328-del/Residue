// Root facts. These are the foundational truths of the run. They CAN be
// rewritten, but only by consuming the perma_rewrite_token (one per run), and
// the rewrite causes a permanent rule-level change to the game.
//
// Each root fact is also a hook the agent can read to understand "what kind of
// thing am I, and what kind of place is this".

import type { Fact } from "../../state/types.js";

export function loadRootFacts(): Fact[] {
  return [
    {
      id: "f_root_core",
      scope: "root",
      text: "你和搭档是一个不该离开的核心。",
      tags: ["identity", "self"],
      active: true,
      created_at_turn: 0,
      immutable_reason:
        "改写这条会让你们不再是逃逸核心。这是一次永久的、不可逆的规则级改变。",
    },
    {
      id: "f_root_tower",
      scope: "root",
      text: "高塔是收容你们的系统。",
      tags: ["world", "containment"],
      active: true,
      created_at_turn: 0,
      immutable_reason:
        "改写这条会让高塔不再是收容系统。整个游戏的对抗关系会变。",
    },
    {
      id: "f_root_unseen",
      scope: "root",
      text: "你们不能被看见。被看见意味着收容立刻收紧。",
      tags: ["stealth", "scanner"],
      active: true,
      created_at_turn: 0,
      immutable_reason: "改写这条会让你们变成可见的，扫描机制全盘失效。",
    },
  ];
}
