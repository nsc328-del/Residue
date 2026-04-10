// Act 2 — Floors 6-9, original world line. The player chose to stay in the
// original ascending order. These rooms get progressively more pressured.
// Templates with `responds_to_cost_triggers` will outscore generics when the
// player is carrying matching costs.

import type { RoomTemplate } from "../types.js";

export const ORIGINAL_FLOOR_6_9_TEMPLATES: RoomTemplate[] = [
  {
    id: "tpl_o_6_9_calm_corridor",
    theme: "original",
    floor_range: [6, 9],
    kind: "normal",
    scales_beyond: true,
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
    anchor_pool: [
      {
        id: "a_scanner_ghost",
        name: "扫描线留下的一道残影",
        tags: ["scanner", "echo"],
        hint: "上一次扫描的残影还挂在空气里——它不会动，但经过它会触发警报",
      },
      {
        id: "a_maintenance_hatch",
        name: "走廊尽头一个半开的检修口",
        tags: ["passage", "device"],
        hint: "可以绕过扫描带，但里面很窄，而且不确定通向哪里",
      },
      {
        id: "a_old_badge",
        name: "地上一块褪色的通行证",
        tags: ["identity", "device"],
        hint: "不知道是谁的——也许能骗过扫描，也许会引来更多注意",
      },
    ],
    anchor_pick_count: 1,
  },

  // Reacts to identity_doubt — fired when the player took the temptation on
  // floor 3.
  {
    id: "tpl_o_6_9_callback_audit",
    theme: "original",
    floor_range: [6, 9],
    kind: "normal",
    scales_beyond: true,
    requires: [],
    prefers: [],
    forbids: [],
    responds_to_cost_triggers: ["identity_doubt", "scanner_density+"],
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
        hint: "把残片改写成合法的（区域改写：留中度代价）",
      },
    ],
    anchor_pool: [
      {
        id: "a_queued_others",
        name: "核验台前排队的几个模糊轮廓",
        tags: ["echo", "identity"],
        hint: "它们也在等核验——有一个的身份看起来比你们的还假",
      },
      {
        id: "a_bypass_log",
        name: "核验台侧面一份泄漏的通行记录",
        tags: ["device", "scanner"],
        hint: "上面列着最近通过的几个身份——也许你能冒充其中一个",
      },
    ],
    anchor_pick_count: 1,
  },

  // Reacts to scanner_density+ when the井 was torn (the easy beginner cost).
  {
    id: "tpl_o_6_9_trace_hounds",
    theme: "original",
    floor_range: [6, 9],
    kind: "normal",
    scales_beyond: true,
    requires: [],
    prefers: [],
    forbids: [],
    responds_to_cost_triggers: ["trace_smell", "scanner_density+"],
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
    anchor_pool: [
      {
        id: "a_dead_hound",
        name: "角落里一个已经失灵的嗅探单位",
        tags: ["device", "damage"],
        hint: "它已经坏了，但身上还沾着上一个目标的气味——也许能利用",
      },
      {
        id: "a_scent_vent",
        name: "通风口正在往外吹一股杂味",
        tags: ["device"],
        hint: "如果把通风口对准嗅探单位，杂味会干扰它们一阵子",
      },
    ],
    anchor_pick_count: 1,
  },

  // ── New templates: break the scanner/identity/pursuit loop ──

  // Gravity inversion room
  {
    id: "tpl_o_6_9_gravity_flip",
    theme: "original",
    floor_range: [6, 9],
    kind: "normal",
    scales_beyond: true,
    requires: [],
    prefers: [],
    forbids: [],
    obstacle:
      "天花板变成了地板。不是你翻过来了——是这一层翻过来了。你脚下踩的是灯管和排气口，头顶是本来该走的走廊地面。方向感全部失效，楼梯在你头上方，但重力把你钉在这一面。",
    anchors: [
      {
        id: "a_inverted_stair",
        name: "悬在头顶的楼梯",
        tags: ["passage", "geometry"],
        hint: "出口在那里，但你现在走不到——除非你能让重力再翻一次",
      },
      {
        id: "a_gravity_node",
        name: "墙壁裂缝里露出的重力锚点",
        tags: ["device", "geometry"],
        hint: "这一层的方向是被它控制的——如果你改写它，整层会再翻转",
      },
    ],
    exits: [
      {
        id: "e_climb_inverted",
        kind: "ascend",
        hint: "在倒置的表面攀爬到楼梯位置",
      },
      {
        id: "e_flip_gravity",
        kind: "ascend",
        hint: "改写重力锚点让整层翻回来（区域改写）",
      },
    ],
    anchor_pool: [
      {
        id: "a_hanging_debris",
        name: "从'上方'地面掉落的碎片",
        tags: ["geometry", "damage"],
        hint: "每隔几秒就有东西从本来的地面上掉下来——说明那边也在松动",
      },
      {
        id: "a_inverted_puddle",
        name: "贴在天花板上的一滩水",
        tags: ["geometry"],
        hint: "它不该在那里——但它就是贴着，像重力对它不起作用",
      },
      {
        id: "a_lost_fragment",
        name: "某个之前路过的人留在这里的碎片",
        tags: ["echo", "identity"],
        hint: "它在倒置的房间里飘着，像一段还没沉底的旧记忆",
      },
    ],
    anchor_pick_count: 1,
  },

  // Time loop room
  {
    id: "tpl_o_6_9_time_loop",
    theme: "original",
    floor_range: [6, 9],
    kind: "normal",
    scales_beyond: true,
    requires: [],
    prefers: [],
    forbids: [],
    obstacle:
      "你走进来的时候，自己已经在出口那边了。不是错觉——出口边站着的那个你，做的是你三秒后会做的动作。这间房的时间是弯的：你的未来在前面等着，你的过去还没消失。如果你和'前面的你'做了不一样的选择，这个环就会断。",
    anchors: [
      {
        id: "a_future_self",
        name: "出口边站着的'未来的你'",
        tags: ["echo", "doppelganger"],
        hint: "它在做你三秒后会做的动作——如果你改变选择，它会消失",
      },
      {
        id: "a_time_seam",
        name: "房间中央一道微微发光的接缝",
        tags: ["device", "geometry"],
        hint: "时间在这里折叠过——踩上去可能会让你跳过几个瞬间",
      },
    ],
    exits: [
      {
        id: "e_follow_future",
        kind: "ascend",
        hint: "和'未来的你'做一样的事，平稳通过",
      },
      {
        id: "e_break_loop",
        kind: "ascend",
        hint: "做不一样的选择，打碎时间环（会留下一条关于因果混乱的代价）",
      },
    ],
    anchor_pool: [
      {
        id: "a_frozen_moment",
        name: "空气中凝固的一个瞬间",
        tags: ["geometry", "echo"],
        hint: "你可以伸手碰它——它是某个已经过去的选择留下的残像",
      },
      {
        id: "a_past_echo",
        name: "墙上正在回放的你进门时的动作",
        tags: ["echo"],
        hint: "它比你慢三秒——你的过去还在这间房里",
      },
    ],
    anchor_pick_count: 1,
  },

  // Rule auction room
  {
    id: "tpl_o_6_9_rule_auction",
    theme: "original",
    floor_range: [7, 9],
    kind: "normal",
    scales_beyond: true,
    requires: [],
    prefers: [],
    forbids: [],
    obstacle:
      "这一层的规则正在被出售。房间中央悬浮着三块标牌，每块上写着一条本层的约束——扫描频率、通行权限、重力方向。它们在缓慢旋转，每转一圈价格就涨一点。你可以'买下'其中一条的豁免权，但你需要付出代价。或者你什么都不买，按原来的规则硬走。",
    anchors: [
      {
        id: "a_rule_tags",
        name: "悬浮旋转的规则标牌",
        tags: ["device", "geometry"],
        hint: "每一块代表一条约束——扫描、权限、重力。买下其中一条就免疫它",
      },
      {
        id: "a_price_counter",
        name: "标牌下方跳动的数字",
        tags: ["pressure"],
        hint: "每转一圈价格涨——但你不一定非得买",
      },
    ],
    exits: [
      {
        id: "e_buy_exemption",
        kind: "ascend",
        hint: "买下一条规则的豁免权（区域改写 + 代价）",
      },
      {
        id: "e_walk_raw",
        kind: "ascend",
        hint: "什么都不买，按原来的规则硬走过去",
      },
    ],
    anchor_pool: [
      {
        id: "a_previous_buyer",
        name: "角落里一个买过规则豁免的旧轮廓",
        tags: ["echo", "identity"],
        hint: "它买了太多——现在它的形状就是那些被免除的规则拼成的",
      },
      {
        id: "a_broken_tag",
        name: "一块已经碎掉的旧标牌",
        tags: ["device", "damage"],
        hint: "之前有人直接把规则砸碎了——但规则碎了不代表它消失了",
      },
    ],
    anchor_pick_count: 1,
  },
];
