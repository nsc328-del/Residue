// Act 2 — Floors 6-9, original world line. The player chose to stay in the
// original ascending order. These rooms get progressively more pressured.
// Templates with `responds_to_debt_triggers` will outscore generics when the
// player is carrying matching debts.

import type { RoomTemplate } from "../types.js";

export const ORIGINAL_FLOOR_6_9_TEMPLATES: RoomTemplate[] = [
  {
    id: "tpl_o_6_9_calm_corridor",
    theme: "original",
    floor_range: [6, 9],
    kind: "normal",
    requires: [],
    prefers: ["scanner"],
    forbids: ["backflow", "doppelganger"],
    obstacle:
      "走廊比之前更长，扫描线密度上调了一档，但仍是一段可处理的常规阻碍。",
    anchors: [
      {
        id: "a_dense_scan",
        name: "密度被调高的扫描带",
        tags: ["scanner", "pressure"],
        hint: "比 Act 1 的难一些",
      },
      {
        id: "a_panel",
        name: "墙边的扫描节点",
        tags: ["device"],
        hint: "可以临时让一段扫描盲掉",
      },
    ],
    exits: [
      {
        id: "e_through",
        kind: "ascend",
        hint: "穿过去",
      },
      {
        id: "e_blind",
        kind: "ascend",
        hint: "让扫描节点盲掉再上行",
      },
    ],
  },

  // Reacts to identity_doubt — fired when the player took the temptation on
  // floor 3.
  {
    id: "tpl_o_6_9_callback_audit",
    theme: "original",
    floor_range: [6, 9],
    kind: "normal",
    requires: [],
    prefers: [],
    forbids: [],
    responds_to_debt_triggers: ["identity_doubt", "scanner_density+"],
    obstacle:
      "前方架起了一面身份核验台。它不是冲你们来的——它是冲你们随手带走的那块身份残片来的。但你们带着它，所以它会扫到你们。",
    anchors: [
      {
        id: "a_audit",
        name: "身份核验台",
        tags: ["device", "scanner", "identity"],
        hint: "针对的是被你们偷走的那个身份",
      },
      {
        id: "a_throw_evidence",
        name: "可以让残片脱手的下水通道",
        tags: ["device"],
        hint: "丢掉它就能过，但你们就不再有它了",
      },
      {
        id: "a_reforge",
        name: "墙边一个可被改写的注册节点",
        tags: ["device", "identity"],
        hint: "可以让那块残片在系统里变得'本来就属于你们'",
      },
    ],
    exits: [
      {
        id: "e_drop",
        kind: "ascend",
        hint: "丢掉残片穿过去",
      },
      {
        id: "e_legalize",
        kind: "ascend",
        hint: "把残片改写成合法的（区域改写：留中度债）",
      },
    ],
  },

  // Reacts to scanner_density+ when the井 was torn (the easy beginner debt).
  {
    id: "tpl_o_6_9_trace_hounds",
    theme: "original",
    floor_range: [6, 9],
    kind: "normal",
    requires: [],
    prefers: [],
    forbids: [],
    responds_to_debt_triggers: ["trace_smell", "scanner_density+"],
    obstacle:
      "前方走廊里有一群从未见过的小型嗅探单位。它们闻得出维护井里那道暴力损伤上残留的你们。",
    anchors: [
      {
        id: "a_hounds",
        name: "嗅探单位",
        tags: ["pursuit", "scanner"],
        hint: "在追的不是你们，是你们留下的味道",
      },
      {
        id: "a_water",
        name: "墙根渗出的冷凝水",
        tags: ["device"],
        hint: "可以洗掉味道",
      },
    ],
    exits: [
      {
        id: "e_wash",
        kind: "ascend",
        hint: "洗掉味道再上行",
      },
      {
        id: "e_lure",
        kind: "ascend",
        hint: "把嗅探单位引到别的地方再上行（区域改写）",
      },
    ],
  },
];
