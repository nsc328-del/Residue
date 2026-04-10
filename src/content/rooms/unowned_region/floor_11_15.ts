// Act 3 — Floors 11-15, unowned_region. Same "world catches up" logic but
// the world is the无主区. Floor 15 reaches the top.

import type { RoomTemplate } from "../types.js";

export const UNOWNED_REGION_FLOOR_11_15_TEMPLATES: RoomTemplate[] = [
  {
    id: "tpl_ur_11_14_aftermath",
    theme: "unowned_region",
    floor_range: [11, 14],
    kind: "aftermath",
    scales_beyond: true,
    requires: [],
    prefers: [],
    forbids: [],
    obstacle:
      "无主区进一步丧失了形状。每一房都在变成你们的某条代价的实体——之前付出的东西回来了。",
    anchors: [
      {
        id: "a_cost_field",
        name: "由你们借走的东西拼出来的房间本身",
        tags: ["aftermath", "echo"],
        hint: "墙、门、追兵都是你们之前的代价",
      },
      {
        id: "a_thread",
        name: "穿过这片代价场的窄路",
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
        hint: "再付代价让代价场散开（注意代价越晚越贵）",
      },
    ],
  },

  // ── Border dissolution: worldline boundary visible ──
  {
    id: "tpl_ur_11_14_border",
    theme: "unowned_region",
    floor_range: [11, 14],
    kind: "aftermath",
    scales_beyond: true,
    requires: [],
    prefers: ["unowned"],
    forbids: [],
    obstacle:
      "两条世界线的边界在这里可见了。房间的左半边是无主区——没有形状、没有规则、墙壁像烟一样在飘。右半边是原来的世界线——墙是实的，扫描线在规矩地巡逻。中间隔着一面半透明的膜，像一层快要撕破的保鲜膜。你能看到另一边的自己——如果你没有跳进无主区，你会在那里。",
    anchors: [
      {
        id: "a_membrane",
        name: "两条世界线之间的半透明膜",
        tags: ["geometry", "unowned"],
        hint: "它在颤抖——你可以撕开它，但两边会混在一起",
      },
      {
        id: "a_other_side_self",
        name: "膜那边的'如果你没跳'的自己",
        tags: ["echo", "doppelganger"],
        hint: "它在往上走，比你慢，但比你安全",
      },
    ],
    exits: [
      {
        id: "e_stay_unowned",
        kind: "ascend",
        hint: "继续在无主区这边走",
      },
      {
        id: "e_tear_membrane",
        kind: "ascend",
        hint: "撕开膜，让两边混合（会创造新的混合事实）",
      },
    ],
    anchor_pool: [
      {
        id: "a_leaking_rule",
        name: "从膜那边渗过来的一条规则",
        tags: ["device", "echo"],
        hint: "原世界线的某条规则在往这边泄漏——也许可以利用它",
      },
      {
        id: "a_fading_membrane",
        name: "膜上一处已经变得完全透明的位置",
        tags: ["passage", "absence"],
        hint: "这里几乎可以直接走过去——但不确定走过去之后你还在哪条线上",
      },
    ],
    anchor_pick_count: 1,
  },

  // ── Cost garden: unsettled costs take plant form ──
  {
    id: "tpl_ur_11_14_cost_garden",
    theme: "unowned_region",
    floor_range: [11, 14],
    kind: "aftermath",
    scales_beyond: true,
    requires: [],
    prefers: ["echo", "aftermath"],
    forbids: [],
    obstacle:
      "你所有未消解的代价在这里长成了植物。不是比喻——它们从地板的裂缝里钻出来，开着不同颜色的花。轻代价是矮的、灰绿色的藤；中代价是弯曲的黑色灌木；重代价是一棵到天花板的、通体发红的树。它们不拦路，但你经过时它们会往你身上缠。",
    anchors: [
      {
        id: "a_cost_plants",
        name: "由你的代价长成的植物",
        tags: ["aftermath", "echo"],
        hint: "每一株对应你之前留下的一条代价——消解代价就等于连根拔掉",
      },
      {
        id: "a_red_tree",
        name: "那棵到天花板的红色树",
        tags: ["aftermath", "pressure"],
        hint: "最重的那条代价——如果你有的话。它的根已经扎进了地板结构",
      },
      {
        id: "a_pollen",
        name: "空气里飘着的代价花粉",
        tags: ["echo"],
        hint: "吸入它不会怎样——但你会更清晰地感觉到自己背着什么",
      },
    ],
    exits: [
      {
        id: "e_walk_through_garden",
        kind: "ascend",
        hint: "让植物缠着走过去——不改变任何东西",
      },
      {
        id: "e_uproot",
        kind: "ascend",
        hint: "拔掉一株——消解对应的那条代价",
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
    scales_beyond: true,
    requires: ["endgame_ready"],
    prefers: [],
    forbids: [],
    responds_to_fact_tags: ["endgame_ready"],
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
