// Act 3 — Floors 11-15, unowned_region. Same "world catches up" logic but
// the world is the无主区. Floor 15 reaches the top.

import type { RoomTemplate } from "../types.js";

export const UNOWNED_REGION_FLOOR_11_15_TEMPLATES: RoomTemplate[] = [
  {
    id: "tpl_ur_11_14_aftermath",
    theme: "unowned_region",
    floor_range: [11, 14],
    kind: "aftermath",
    requires: [],
    prefers: [],
    forbids: [],
    obstacle:
      "无主区进一步丧失了形状。每一房都在变成你们的某条债的实体——之前借的东西回来了。",
    anchors: [
      {
        id: "a_debt_field",
        name: "由你们借走的东西拼出来的房间本身",
        tags: ["aftermath", "echo"],
        hint: "墙、门、追兵都是你们之前的代价",
      },
      {
        id: "a_thread",
        name: "穿过这片债场的窄路",
        tags: ["passage"],
        hint: "勉强能过",
      },
    ],
    exits: [
      {
        id: "e_thread",
        kind: "ascend",
        hint: "穿过去",
      },
      {
        id: "e_pay_more",
        kind: "ascend",
        hint: "再付代价让债场散开（注意债越晚还越贵）",
      },
    ],
  },

  // ----- Floor 15: the top -----
  {
    id: "tpl_ur_15_top",
    theme: "unowned_region",
    floor_range: [15, 15],
    kind: "node",
    is_node: true,
    requires: [],
    prefers: [],
    forbids: [],
    obstacle:
      "无主区的天花板。它看起来比原世界线的开口更不像出口——更像一个继续延伸的开。但你们已经到了它能让你们到的最远的地方。",
    anchors: [
      {
        id: "a_opening",
        name: "无主区的开口",
        tags: ["exit"],
        hint: "形状不是给你们准备的",
      },
      {
        id: "a_what_remains",
        name: "你们身上剩下的所有东西",
        tags: ["aftermath"],
        hint: "无主区的版本——更可能包含一个不再属于你们的身份",
      },
    ],
    exits: [
      {
        id: "e_step_out",
        kind: "ascend",
        hint: "走出去",
      },
    ],
  },
];
