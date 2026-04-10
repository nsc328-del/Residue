// Repeating node templates — unowned_region world line. Checkpoint rooms
// every 5 floors (15, 20, 25, ...) via scales_beyond. Unowned-region flavour:
// rules are loose, boundaries are blurred, structure is unstable.

import type { RoomTemplate } from "../types.js";

export const UNOWNED_NODE_REPEATING_TEMPLATES: RoomTemplate[] = [
  // ── Void well: a crack into the void ──
  {
    id: "tpl_ur_node_void_well",
    theme: "unowned_region",
    floor_range: [15, 15],
    kind: "node",
    is_node: true,
    scales_beyond: true,
    requires: [],
    prefers: ["unowned", "absence"],
    forbids: [],
    obstacle:
      "无主区的结构裂缝在这里更深了——地板中央有一口井，通向下方的虚空。井里没有光，但你往下看的时候感觉有什么在往上看。你可以往里看，可以往里扔东西，可以试着从里面拿东西出来。但看太久会被看回来。",
    anchors: [
      {
        id: "a_void_well",
        name: "通向虚空的井",
        tags: ["absence", "unowned"],
        hint: "井底没有底——但有回响。你扔进去的东西不一定会消失",
      },
      {
        id: "a_gaze_back",
        name: "从井底回望你的注视",
        tags: ["echo", "identity"],
        hint: "你看了太久——现在它在看你。它看到的你和你认为的你不一样",
      },
      {
        id: "a_well_edge",
        name: "井口边缘松动的碎片",
        tags: ["device"],
        hint: "可以扔进去试探深度——也可以把一条代价扔进去",
      },
    ],
    exits: [
      {
        id: "e_drop_cost",
        kind: "ascend",
        hint: "往井里扔一条代价（消解它——但虚空记住了）",
      },
      {
        id: "e_walk_around",
        kind: "ascend",
        hint: "绕过井继续走——不看、不扔、不碰",
      },
    ],
  },

  // ── Rule gap: unwritten rules ──
  {
    id: "tpl_ur_node_rule_gap",
    theme: "unowned_region",
    floor_range: [15, 15],
    kind: "node",
    is_node: true,
    scales_beyond: true,
    requires: [],
    prefers: ["unowned"],
    forbids: [],
    obstacle:
      "这里的规则还没有被写好。墙上、地板上、天花板上都是空白——不是被擦掉的空白，是从来没有被写过的空白。你可以暂时做任何事：改写、伪造、消解、创造。但这也意味着任何事都可能发生在你身上——因为保护你的规则同样不存在。",
    anchors: [
      {
        id: "a_blank_rules",
        name: "从未被写过的空白规则面",
        tags: ["unowned", "absence"],
        hint: "你可以在上面写一条临时规则——它会在你离开这层后消失",
      },
      {
        id: "a_unprotected",
        name: "同样空白的保护层",
        tags: ["absence", "pressure"],
        hint: "没有规则意味着没有保护——你现在对任何事实变化都没有抵抗力",
      },
    ],
    exits: [
      {
        id: "e_write_rule",
        kind: "ascend",
        hint: "写一条临时规则保护自己再上行（添加一条临时 local fact）",
      },
      {
        id: "e_pass_blank",
        kind: "ascend",
        hint: "什么都不写，趁还没有规则赶紧穿过去",
      },
    ],
  },
];
