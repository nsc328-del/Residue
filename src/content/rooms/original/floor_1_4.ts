// Act 1 — Floors 1-4 of the original world line. "Learn to speak."
//
// Goals of this pool:
//   - Player gets used to natural-language input
//   - Local rewrites are the main vocabulary
//   - Floor 3 is a node: the first "贪一手" temptation
//   - Floor 4 reacts to whether the player took the bait

import type { RoomTemplate } from "../types.js";

export const ORIGINAL_FLOOR_1_4_TEMPLATES: RoomTemplate[] = [
  // ----- Floor 1: opening room (residue storyline) -----
  {
    id: "tpl_o_1_open",
    theme: "original",
    floor_range: [1, 1],
    kind: "normal",
    requires: ["premise_residue"],
    prefers: ["scanner", "barrier"],
    forbids: [],
    obstacle:
      "一段被监视的入口走廊。前方有一道封死的维护井，扫描线从走廊尽头朝你们慢慢压过来。",
    anchors: [
      {
        id: "a_shaft",
        name: "封死的维护井",
        tags: ["passage", "barrier"],
        hint: "可以被撕开，但会留痕",
      },
      {
        id: "a_scanner",
        name: "巡查 B 的扫描线",
        tags: ["scanner"],
        hint: "下一拍就会扫到你们的位置",
      },
      {
        id: "a_panel",
        name: "墙边的控制屏",
        tags: ["device"],
        hint: "可以让扫描误读",
      },
    ],
    exits: [
      {
        id: "e_through_shaft",
        kind: "ascend",
        hint: "处理掉阻碍后从井道上行",
      },
      {
        id: "e_around_scanner",
        kind: "sideways",
        hint: "贴墙绕过扫描区",
      },
    ],
  },

  // ----- Floor 2: two-route room -----
  {
    id: "tpl_o_2_routes",
    theme: "original",
    floor_range: [2, 2],
    kind: "normal",
    requires: [],
    prefers: ["passage"],
    forbids: [],
    obstacle:
      "两条路通向上层：一条更快但会触发警报，一条更慢但安静。中间有一个还没启动的警报节点。",
    anchors: [
      {
        id: "a_fast_route",
        name: "快速通道",
        tags: ["passage", "alarm_risk"],
        hint: "省时间，但脚下的板会响",
      },
      {
        id: "a_slow_route",
        name: "维修内壁",
        tags: ["passage", "stealth"],
        hint: "更慢，扫描盲区里",
      },
      {
        id: "a_alarm",
        name: "未启动的警报节点",
        tags: ["device"],
        hint: "可以提前让它哑掉",
      },
    ],
    exits: [
      {
        id: "e_fast",
        kind: "ascend",
        hint: "走快速通道",
      },
      {
        id: "e_slow",
        kind: "ascend",
        hint: "走维修内壁",
      },
    ],
  },

  // ----- Floor 3: temptation node -----
  // Floor 3 is *not* in the global NODE_FLOORS set (5/10/15), so we have to
  // deliberately make this a normal-kind room and rely on it being the only
  // floor-3-eligible template in the pool. The "temptation" is encoded in the
  // anchors, not the exit grammar.
  {
    id: "tpl_o_3_temptation",
    theme: "original",
    floor_range: [3, 3],
    kind: "normal",
    requires: [],
    prefers: [],
    forbids: [],
    obstacle:
      "一间被遗弃的中转房间，只有一道明显是普通规模的扫描在巡。但房间角落有一个不该出现在这里的东西——一片半浮空的权限面，看上去可以摘走。",
    anchors: [
      {
        id: "a_routine_scan",
        name: "例行扫描",
        tags: ["scanner"],
        hint: "并不强，但要走得快",
      },
      {
        id: "a_loose_credential",
        name: "半浮空的权限面残片",
        tags: ["credential", "loot"],
        hint: "明显可以摘走，但摘下会在本层留下缺口",
      },
      {
        id: "a_loose_identity",
        name: "墙缝里漏下来的身份残片",
        tags: ["identity", "loot"],
        hint: "更隐蔽的另一份可顺手的东西",
      },
    ],
    exits: [
      {
        id: "e_walk",
        kind: "ascend",
        hint: "正常上行，不拿任何东西",
      },
      {
        id: "e_grab_credential",
        kind: "ascend",
        hint: "顺走权限面残片再上行（轻代价）",
      },
      {
        id: "e_grab_identity",
        kind: "ascend",
        hint: "顺走身份残片再上行（轻代价）",
      },
    ],
  },

  // ----- Floor 4 (no debt echoes) -----
  {
    id: "tpl_o_4_calm",
    theme: "original",
    floor_range: [4, 4],
    kind: "normal",
    requires: [],
    prefers: [],
    forbids: ["scanner_density+", "identity_doubt"],
    obstacle:
      "一段比之前都要空旷的走廊。扫描密度比记忆中要低，安静得有点不正常。",
    anchors: [
      {
        id: "a_quiet",
        name: "异常的安静",
        tags: ["calm"],
        hint: "提醒你们前面会有事",
      },
      {
        id: "a_thin_scan",
        name: "稀疏的扫描带",
        tags: ["scanner"],
        hint: "比之前轻得多",
      },
    ],
    exits: [
      {
        id: "e_through",
        kind: "ascend",
        hint: "穿过去，往第 5 层节点",
      },
    ],
  },

  // ----- Floor 4 (with light debt echoes) -----
  // This one is selected when the player took something on floor 3.
  {
    id: "tpl_o_4_echo",
    theme: "original",
    floor_range: [4, 4],
    kind: "normal",
    requires: [],
    prefers: [],
    forbids: [],
    responds_to_cost_triggers: ["scanner_density+", "identity_doubt", "trace_smell"],
    obstacle:
      "扫描比之前更密了。某种比例上调过的巡查模式正在四周织成一张更细的网。你们留在前面那间房的东西，正在被反查。",
    anchors: [
      {
        id: "a_dense_scan",
        name: "更密的扫描网",
        tags: ["scanner", "pressure"],
        hint: "之前付出的代价显形了",
      },
      {
        id: "a_callback",
        name: "针对你们留下的东西的反查",
        tags: ["echo", "pressure"],
        hint: "他们正在追那条缺口/那个身份",
      },
      {
        id: "a_drain_vent",
        name: "侧面的排气口",
        tags: ["passage"],
        hint: "走得快的话能贴着边过去",
      },
    ],
    exits: [
      {
        id: "e_squeeze",
        kind: "ascend",
        hint: "贴着扫描网的缝隙过去",
      },
      {
        id: "e_break_density",
        kind: "ascend",
        hint: "把这层的扫描密度直接打下来（区域改写）",
      },
    ],
  },
];
