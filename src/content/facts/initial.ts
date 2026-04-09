// Initial fact set: where the run starts. Floor 1, original world line, the
// situation in front of the player on turn 0.
//
// Phase 1 only needs *some* facts to exist so the engine can load. The Act 1
// content pass will rewrite this list to fit the actual opening room.

import type { Fact } from "../../state/types.js";

export function loadInitialFacts(): Fact[] {
  return [
    {
      id: "f_init_floor",
      scope: "local",
      text: "你们在第 1 层。",
      tags: ["floor", "position", "floor_bound"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_order",
      scope: "structural",
      text: "上行需要一层一层按顺序穿过。",
      tags: ["order", "worldline_original"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_jurisdiction",
      scope: "region",
      text: "第 1 层归巡查 B 管。",
      tags: ["jurisdiction", "scanner", "floor_bound"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_scan",
      scope: "region",
      text: "巡查 B 正在朝你们的方向扫描。",
      tags: ["scanner", "pressure", "floor_bound"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_shaft",
      scope: "local",
      text: "本层的维护井是封死的。",
      tags: ["passage", "barrier"],
      active: true,
      created_at_turn: 0,
    },
  ];
}
