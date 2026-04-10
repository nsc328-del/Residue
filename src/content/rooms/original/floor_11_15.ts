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
    scales_beyond: true,
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
        hint: "再付一次代价让本层让路（区域改写：注意代价已经在变贵）",
      },
    ],
    anchor_pool: [
      {
        id: "a_echo_scar",
        name: "墙上一道之前某次区域改写留下的疤痕",
        tags: ["aftermath", "echo"],
        hint: "你之前改写过某一层——那次改写的裂纹一直延伸到了这里",
      },
      {
        id: "a_cost_residue",
        name: "空气中漂浮的代价残渣",
        tags: ["pressure", "aftermath"],
        hint: "你带着的代价在这一层的扭曲场里开始析出实体——它们看起来像碎玻璃",
      },
      {
        id: "a_quiet_pocket",
        name: "扭曲场中一小块异常安静的区域",
        tags: ["absence", "passage"],
        hint: "那一小块没有被扭曲——像是有什么东西在保护它",
      },
    ],
    anchor_pick_count: 1,
  },

  {
    id: "tpl_o_11_14_aftermath_doppel",
    theme: "original",
    floor_range: [11, 14],
    kind: "aftermath",
    scales_beyond: true,
    requires: [],
    prefers: [],
    forbids: [],
    responds_to_cost_triggers: ["doppelganger", "identity_doubt"],
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
        hint: "消解之前那条身份代价",
      },
    ],
    exits: [
      {
        id: "e_settle",
        kind: "ascend",
        hint: "消解那条身份代价再上行",
      },
      {
        id: "e_walk_past",
        kind: "ascend",
        hint: "什么都不做，绕开它继续往上",
      },
    ],
    anchor_pool: [
      {
        id: "a_mirrored_wound",
        name: "另一个你们身上一道你没有的伤",
        tags: ["doppelganger", "echo"],
        hint: "它经历过你没经历的事——那道伤是证据",
      },
      {
        id: "a_shared_object",
        name: "你们俩手里拿着一模一样的东西",
        tags: ["identity", "echo"],
        hint: "同一件东西不该存在两份——如果你碰它的那份，可能两份都会消失",
      },
    ],
    anchor_pick_count: 1,
  },

  // ── Memory corridor: your choices played back ──
  {
    id: "tpl_o_11_14_memory_corridor",
    theme: "original",
    floor_range: [11, 14],
    kind: "aftermath",
    scales_beyond: true,
    requires: [],
    prefers: ["echo"],
    forbids: [],
    obstacle:
      "走廊两侧的墙变成了屏幕。它们在放映你之前每一层做过的事——不是文字记录，是实况。你看到自己撕开维护井的画面、你看到自己拿走那块残片的画面、你看到自己在某一层犹豫了很久的画面。有几帧在发光，像是可以伸手进去的。",
    anchors: [
      {
        id: "a_replay_walls",
        name: "正在放映过去选择的墙壁",
        tags: ["echo", "aftermath"],
        hint: "每一帧都是你之前真实的选择——有些画面比别的亮",
      },
      {
        id: "a_interactive_frame",
        name: "一帧发光的画面",
        tags: ["device", "echo"],
        hint: "你可以伸手进去改写那个瞬间——但那是区域级的改写",
      },
    ],
    exits: [
      {
        id: "e_walk_through_memories",
        kind: "ascend",
        hint: "不碰任何画面，走过去",
      },
      {
        id: "e_rewrite_moment",
        kind: "ascend",
        hint: "伸手进去改写一帧画面（区域改写：代价是记忆变得不确定）",
      },
    ],
    anchor_pool: [
      {
        id: "a_blank_frame",
        name: "一帧全黑的画面",
        tags: ["absence", "echo"],
        hint: "那一层的记忆被删了——但被谁删的？",
      },
      {
        id: "a_wrong_memory",
        name: "一帧你不记得做过的事",
        tags: ["echo", "identity"],
        hint: "画面里的你做了一件你确定自己没做的事——是记忆出错了还是你忘了？",
      },
      {
        id: "a_sound_leak",
        name: "从某一帧里漏出来的声音",
        tags: ["echo"],
        hint: "你说过的一句话在走廊里回荡——但声调不太对",
      },
    ],
    anchor_pick_count: 1,
  },

  // ── Collapsed future: what would have happened without you ──
  {
    id: "tpl_o_11_14_collapsed_future",
    theme: "original",
    floor_range: [11, 14],
    kind: "aftermath",
    scales_beyond: true,
    requires: [],
    prefers: ["aftermath"],
    forbids: [],
    obstacle:
      "这间房展示的是你如果没来会发生什么。墙上、地板上、天花板上，到处都是一个'你不存在的版本'的这一层——安静的、没有被改写过的、完整的。但现在你来了，这个版本正在因为你的存在而解体。地板在裂，墙壁在褪色，那个平行的、安静的房间正在一块一块碎掉。",
    anchors: [
      {
        id: "a_intact_version",
        name: "正在碎裂的'你不存在'版本",
        tags: ["aftermath", "echo"],
        hint: "你的存在本身就是对这个版本的破坏",
      },
      {
        id: "a_falling_quiet",
        name: "从那个版本掉落的安静碎片",
        tags: ["geometry", "absence"],
        hint: "它们落在你脚边——每一块都是一段没有被你改写过的、原始的规则",
      },
    ],
    exits: [
      {
        id: "e_let_it_collapse",
        kind: "ascend",
        hint: "让它碎完，从废墟上走过去",
      },
      {
        id: "e_salvage_quiet",
        kind: "ascend",
        hint: "捡一块安静碎片带走——也许以后有用（添加一条 local fact）",
      },
    ],
    anchor_pool: [
      {
        id: "a_ghost_footstep",
        name: "那个版本里一个正在消失的脚步声",
        tags: ["echo", "absence"],
        hint: "那个'你不存在'的版本里有人在走——但不是你",
      },
      {
        id: "a_untouched_door",
        name: "一扇从未被打开过的门",
        tags: ["passage", "absence"],
        hint: "在那个版本里这扇门从来不需要打开——因为没有人要逃",
      },
    ],
    anchor_pick_count: 1,
  },

  // ----- Floor 15: the top -----
  {
    id: "tpl_o_15_top",
    theme: "original",
    floor_range: [15, 15],
    kind: "node",
    is_node: true,
    scales_beyond: true,
    requires: ["endgame_ready"],
    prefers: [],
    forbids: [],
    responds_to_fact_tags: ["endgame_ready"],
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
        hint: "代价、伪造记录、被改写的身份、未结的事实——它们决定外面是什么样",
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
