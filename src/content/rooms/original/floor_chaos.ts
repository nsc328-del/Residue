// Chaos rooms — original world line. These only appear when debt_pressure
// crosses specific thresholds. The player chose violence; the tower answers.

import type { RoomTemplate } from "../types.js";

export const ORIGINAL_CHAOS_TEMPLATES: RoomTemplate[] = [
  // ── pressure ≥ 30: the tower starts noticing ──
  {
    id: "tpl_o_chaos_backflow",
    theme: "original",
    floor_range: [6, 14],
    kind: "normal",
    pressure_min: 30,
    requires: [],
    prefers: ["pressure", "damage"],
    forbids: [],
    responds_to_debt_triggers: ["trace_smell", "scanner_density+"],
    obstacle:
      "你们还没走出走廊，身后就来了。不是巡查，是你们自己留下的东西——井口的碎屑、被撕开的痕迹、被惹恼的密度——它们从楼下倒灌上来，像一股活的追兵。",
    anchors: [
      {
        id: "a_backflow",
        name: "正在倒灌的追兵",
        tags: ["pursuit", "backflow"],
        hint: "不是人，是你们之前留下的所有暴力痕迹汇成的",
      },
      {
        id: "a_seal_crack",
        name: "墙壁上刚裂开的一条缝",
        tags: ["passage", "damage"],
        hint: "是被追兵的冲击震开的——可以钻过去，但会把裂缝留得更大",
      },
      {
        id: "a_face_it",
        name: "停下来，回头看它",
        tags: ["settle", "echo"],
        hint: "承认这些是你们的，有可能让它停下来——但你得真的承受它",
      },
    ],
    exits: [
      {
        id: "e_flee",
        kind: "ascend",
        hint: "钻裂缝跑掉——追兵还会在后面",
      },
      {
        id: "e_absorb",
        kind: "ascend",
        hint: "让它追上你们，吃下那个冲击（可以结清一条轻债）",
      },
    ],
  },

  // ── pressure ≥ 50: the geometry breaks ──
  {
    id: "tpl_o_chaos_geometry_break",
    theme: "original",
    floor_range: [8, 14],
    kind: "normal",
    pressure_min: 50,
    requires: [],
    prefers: ["aftermath", "damage"],
    forbids: [],
    obstacle:
      "这一层已经不是一个正常的楼层了。墙在缓慢旋转，地板和天花板之间的距离每几秒变一次。你们的债在改写这个地方的物理。楼梯出口还在，但它在晃，像随时会折断。",
    anchors: [
      {
        id: "a_rotating_wall",
        name: "在旋转的墙",
        tags: ["aftermath", "geometry"],
        hint: "不是幻觉——你们的暴力让这层的结构失去了固定点",
      },
      {
        id: "a_unstable_stair",
        name: "正在晃动的楼梯",
        tags: ["passage", "unstable"],
        hint: "踩上去就得跑，它不会等你",
      },
      {
        id: "a_calm_spot",
        name: "房间正中一小块静止的地板",
        tags: ["settle", "anchor"],
        hint: "在这里站一会儿，可以用一条债的重量把这层重新钉住",
      },
    ],
    exits: [
      {
        id: "e_sprint_stair",
        kind: "ascend",
        hint: "趁楼梯还在，冲上去",
      },
      {
        id: "e_anchor_floor",
        kind: "ascend",
        hint: "站稳，用一条债的重量稳住这层，再上行（结清一条债）",
      },
    ],
  },

  // ── pressure ≥ 65: debts take form ──
  {
    id: "tpl_o_chaos_debt_incarnate",
    theme: "original",
    floor_range: [10, 14],
    kind: "normal",
    pressure_min: 65,
    requires: [],
    prefers: ["echo", "aftermath"],
    forbids: [],
    responds_to_debt_triggers: [
      "doppelganger",
      "identity_doubt",
      "trace_smell",
      "backflow_pursuit",
    ],
    obstacle:
      "你们的债活了。不是比喻——它站在房间中央，穿着你们的轮廓，用你们之前每一次'硬闯'的碎片拼成的。它不拦路，它在重建这一层：按照你们'应该'经历但跳过的所有后果来重建。你现在看到的走廊，是你欠下的走廊。",
    anchors: [
      {
        id: "a_debt_body",
        name: "由你们的债拼成的人形",
        tags: ["doppelganger", "echo", "backflow"],
        hint: "它不恨你们——它只是存在，因为你们欠了太多",
      },
      {
        id: "a_rebuilt_corridor",
        name: "正在被重建的走廊",
        tags: ["aftermath", "geometry"],
        hint: "每一堵新长出来的墙都是你们跳过的某一层的回声",
      },
      {
        id: "a_tear_through",
        name: "从重建中撕出的一个口子",
        tags: ["passage", "damage"],
        hint: "可以再撕一次——但这次它会更疼",
      },
      {
        id: "a_surrender_weight",
        name: "跪下来承认这些是你的",
        tags: ["settle"],
        hint: "结清至少两条债，人形就会散开，走廊就会停止重建",
      },
    ],
    exits: [
      {
        id: "e_tear_again",
        kind: "ascend",
        hint: "再撕一次，继续欠（新增重债）",
      },
      {
        id: "e_pay_all",
        kind: "ascend",
        hint: "结清尽量多的债再上行",
      },
      {
        id: "e_coexist",
        kind: "ascend",
        hint: "不打也不还，带着人形一起上去",
      },
    ],
  },

  // ── pressure ≥ 80: tower is failing ──
  {
    id: "tpl_o_chaos_tower_scream",
    theme: "original",
    floor_range: [11, 14],
    kind: "normal",
    pressure_min: 80,
    requires: [],
    prefers: [],
    forbids: [],
    obstacle:
      "塔在叫。不是警报，是结构本身的声音——像一根被拧过头的金属梁终于发出了断裂前的哀鸣。你们的债太重了，这个地方已经不是在阻止你们上行，它是在求你们别再拆了。上行的路还在，但地板正在一块一块脱落，你们脚下只剩钢筋。",
    anchors: [
      {
        id: "a_screaming_beam",
        name: "正在断裂的主梁",
        tags: ["aftermath", "structural"],
        hint: "它的哀鸣频率和你们身上的债数成正比",
      },
      {
        id: "a_falling_floor",
        name: "正在脱落的地板",
        tags: ["geometry", "unstable"],
        hint: "每走一步都有块板子掉下去——但还没掉完",
      },
      {
        id: "a_last_rebar",
        name: "最后一排钢筋",
        tags: ["passage"],
        hint: "能踩着过去，但不够两个人同时站",
      },
    ],
    exits: [
      {
        id: "e_sprint_rebar",
        kind: "ascend",
        hint: "踩着钢筋冲上去——不回头",
      },
      {
        id: "e_rebuild_one_span",
        kind: "ascend",
        hint: "用一条重债的代价把脚下这一段修回来（结清一条重债）",
      },
    ],
  },
];
