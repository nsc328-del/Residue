// Act 3 — Floors 11-15, original world line. "World catches up." No new
// opportunities; only consequences. Every template references something the
// player did earlier. Floor 15 is the top.

import type { RoomTemplate } from "../types.js";

export const ORIGINAL_FLOOR_11_15_TEMPLATES: RoomTemplate[] = [
  {
    id: "tpl_o_11_14_aftermath_normal",
    theme: "original",
    floor_range: [11, 14],
    kind: "aftermath",
    requires: [],
    prefers: [],
    forbids: [],
    obstacle:
      "环境扭曲度比之前都高。墙的几何感对不上你们的记忆，扫描模式也不再讲道理。这一层不是冲你们来的，但你们带着的东西已经把它惹起来了。",
    anchors: [
      {
        id: "a_warp",
        name: "对不上的几何感",
        tags: ["aftermath"],
        hint: "之前留下的代价正在让本层变形",
      },
      {
        id: "a_pressure_field",
        name: "针对你们之前选择的压力场",
        tags: ["pressure", "echo"],
        hint: "这是后果不是阻碍",
      },
      {
        id: "a_thread",
        name: "穿过压力场的一条窄缝",
        tags: ["passage"],
        hint: "勉强够过",
      },
    ],
    exits: [
      {
        id: "e_thread",
        kind: "ascend",
        hint: "贴着窄缝走过去",
      },
      {
        id: "e_pay_more",
        kind: "ascend",
        hint: "再付一次代价让本层让路（区域改写：注意债已经在变贵）",
      },
    ],
  },

  {
    id: "tpl_o_11_14_aftermath_doppel",
    theme: "original",
    floor_range: [11, 14],
    kind: "aftermath",
    requires: [],
    prefers: [],
    forbids: [],
    responds_to_debt_triggers: ["doppelganger", "identity_doubt"],
    obstacle:
      "你们走进的房间里站着另一个'你们'。它比你们走得快，比你们更熟悉这一层。它是你们之前留下的某个东西长成的。",
    anchors: [
      {
        id: "a_other_self",
        name: "另一个你们",
        tags: ["doppelganger", "echo"],
        hint: "由你们之前的代价拼出来的",
      },
      {
        id: "a_settle_offer",
        name: "可以把身份还回去的接口",
        tags: ["device", "settle"],
        hint: "结清之前那条身份债",
      },
    ],
    exits: [
      {
        id: "e_settle",
        kind: "ascend",
        hint: "结清那条身份债再上行",
      },
      {
        id: "e_walk_past",
        kind: "ascend",
        hint: "什么都不做，绕开它继续往上",
      },
    ],
  },

  // ----- Floor 15: the top -----
  {
    id: "tpl_o_15_top",
    theme: "original",
    floor_range: [15, 15],
    kind: "node",
    is_node: true,
    requires: [],
    prefers: [],
    forbids: [],
    obstacle:
      "塔的天花板。一个被打开的口，外面的东西取决于你们一路上留下的所有东西。这不是胜利，是一个开口。",
    anchors: [
      {
        id: "a_opening",
        name: "天花板上的开口",
        tags: ["exit"],
        hint: "形状由你们的活跃事实集决定",
      },
      {
        id: "a_what_remains",
        name: "你们身上剩下的所有东西",
        tags: ["aftermath"],
        hint: "债、伪造记录、被改写的身份、未结的事实——它们决定外面是什么样",
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
