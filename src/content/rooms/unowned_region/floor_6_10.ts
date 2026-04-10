// Act 2 — Floors 6-10, unowned_region world line. The interaction grammar
// in this theme is "上行 = 被追赶着被动抬升". Every room here features the
// backflow pursuit as a primary anchor, not a side detail. Floor 10 is a node.

import type { RoomTemplate } from "../types.js";

export const UNOWNED_REGION_FLOOR_6_10_TEMPLATES: RoomTemplate[] = [
  {
    id: "tpl_ur_6_9_pushed_up",
    theme: "unowned_region",
    floor_range: [6, 9],
    kind: "normal",
    scales_beyond: true,
    requires: [],
    prefers: ["pursuit", "backflow", "unowned"],
    forbids: [],
    obstacle:
      "本层没有给你们准备的阻碍——它根本不知道你们在这里。但下方那 N 层的追兵没有放弃，他们正持续从地面下方涌上来，把你们往上推。",
    anchors: [
      {
        id: "a_pushed_seam",
        name: "脚下不停掉落的接缝",
        tags: ["unowned", "passage"],
        hint: "你们站不稳，世界本身在把你们抬起来",
      },
      {
        id: "a_backflow",
        name: "从下方涌上来的追兵",
        tags: ["pursuit", "backflow"],
        hint: "他们看不见你们，但能感觉你们在前面",
      },
      {
        id: "a_jam",
        name: "可以堵住下方通道的塌方点",
        tags: ["device"],
        hint: "塞住一段通道，给自己一段缓冲",
      },
    ],
    exits: [
      {
        id: "e_carried",
        kind: "ascend",
        hint: "顺着推力被动抬升",
      },
      {
        id: "e_jam",
        kind: "ascend",
        hint: "塞住下方通道再上行（区域改写）",
      },
    ],
  },

  {
    id: "tpl_ur_6_9_doppelganger_glimpse",
    theme: "unowned_region",
    floor_range: [6, 9],
    kind: "normal",
    scales_beyond: true,
    requires: [],
    prefers: ["unowned"],
    forbids: [],
    responds_to_cost_triggers: ["doppelganger", "identity_doubt"],
    obstacle:
      "前方某个旁路上溜过去一个戴着你们壳的他者。它走得比你们还快，没有回头看。无主区把你们留下的位置交给了别人。",
    anchors: [
      {
        id: "a_doppel",
        name: "戴着你们壳的他者",
        tags: ["doppelganger"],
        hint: "它走的方向你们也想走",
      },
      {
        id: "a_split_path",
        name: "通向他者方向的旁路",
        tags: ["passage"],
        hint: "如果跟过去会撞上",
      },
    ],
    exits: [
      {
        id: "e_avoid",
        kind: "ascend",
        hint: "绕开他者继续往上",
      },
      {
        id: "e_chase",
        kind: "sideways",
        hint: "去追那个他者，要回属于你们的壳",
      },
    ],
  },

  // ── Ownerless court ──
  {
    id: "tpl_ur_6_9_court",
    theme: "unowned_region",
    floor_range: [6, 9],
    kind: "normal",
    scales_beyond: true,
    requires: [],
    prefers: ["unowned"],
    forbids: [],
    obstacle:
      "一个没有法官的审判台。台上方有一把空椅子，椅子前面是一面镜子。无主区不审判别人——它审判你自己。你可以坐上去，面对镜子，选择你的某条代价，然后宣判：承认它，或者否认它。无主区会接受你的判决，不管对错。",
    anchors: [
      {
        id: "a_empty_bench",
        name: "没有法官的审判台",
        tags: ["device", "unowned"],
        hint: "法官的位置是给你坐的",
      },
      {
        id: "a_judgement_mirror",
        name: "审判台前的镜子",
        tags: ["identity", "device"],
        hint: "你会看见自己——以及你身上背着的代价",
      },
      {
        id: "a_verdict_slot",
        name: "台子下方一个刻着'判决'的凹槽",
        tags: ["device"],
        hint: "把你的判决放进去——承认或否认",
      },
    ],
    exits: [
      {
        id: "e_pass_court",
        kind: "ascend",
        hint: "不坐上去，绕过审判台继续走",
      },
      {
        id: "e_judge_self",
        kind: "ascend",
        hint: "坐上去审判自己的一条代价（可以消解，但判决本身会成为新事实）",
      },
    ],
  },

  // ── Inverted pursuit ──
  {
    id: "tpl_ur_6_9_mirror_pursuit",
    theme: "unowned_region",
    floor_range: [7, 9],
    kind: "normal",
    scales_beyond: true,
    requires: [],
    prefers: ["pursuit", "backflow"],
    forbids: [],
    obstacle:
      "追兵不再从下方来了。它们从上方来——倒着追，像一段被倒放的录像。你抬头看见它们正头朝下沿着天花板移动，动作和你见过的追兵一模一样但方向全反了。它们在追的不是现在的你，而是'即将到达上面的你'。",
    anchors: [
      {
        id: "a_inverted_pursuers",
        name: "从上方倒着追下来的追兵",
        tags: ["pursuit", "geometry"],
        hint: "它们在拦截你的未来位置——如果你不改变速度，它们会在上一层等到你",
      },
      {
        id: "a_time_gap",
        name: "你和'被追的未来你'之间的时间差",
        tags: ["device", "echo"],
        hint: "如果你能拉开这个时间差，它们就追错了位置",
      },
    ],
    exits: [
      {
        id: "e_race_up",
        kind: "ascend",
        hint: "加速——让你到达的时间和它们预测的不一样",
      },
      {
        id: "e_stall",
        kind: "ascend",
        hint: "故意减速，让它们在上面扑空，然后从它们背后穿过",
      },
    ],
    anchor_pool: [
      {
        id: "a_reversed_footprint",
        name: "天花板上倒着的脚印",
        tags: ["echo", "pursuit"],
        hint: "那是它们留下的——时间反向的追踪印记",
      },
      {
        id: "a_future_debris",
        name: "从上方掉下来的、你还没到过的那一层的碎片",
        tags: ["geometry", "echo"],
        hint: "上面那层的东西已经先于你开始碎了",
      },
    ],
    anchor_pick_count: 1,
  },

  // Floor 10 node — unowned_region variant of repay/burst/hard.
  // The split is the same as the original-line node: by cost severity.
  {
    id: "tpl_ur_10_node_repay",
    theme: "unowned_region",
    floor_range: [10, 10],
    kind: "node",
    is_node: true,
    requires: [],
    prefers: [],
    forbids: [],
    responds_to_cost_triggers: ["pursuit", "backflow", "doppelganger", "forged_break"],
    obstacle:
      "追兵终于追上了。这里的空间几乎被他们填满。整间房就是这条代价的实体——问题不再是怎么过，是怎么让这条事实从世界里消失。",
    anchors: [
      {
        id: "a_pursuit_arrived",
        name: "已经追上来的追兵",
        tags: ["pursuit", "echo"],
        hint: "围绕着你们，但仍然没有真正看见",
      },
      {
        id: "a_forge_record",
        name: "可以伪造一段穿过记录的注册台",
        tags: ["device", "forge"],
        hint: "让世界以为你们一层一层走过来过",
      },
      {
        id: "a_offer_doppel",
        name: "把追兵交给那个戴你们壳的他者的接口",
        tags: ["device", "transfer"],
        hint: "让追兵去追他者，自己脱身",
      },
      {
        id: "a_become",
        name: "可以让你们承认自己就是无主区的接受口",
        tags: ["device", "rule_change"],
        hint: "接受这条事实成为你们的一部分。代价：你们不再是原来那个核心",
      },
    ],
    exits: [
      {
        id: "e_forge",
        kind: "ascend",
        hint: "伪造历史抹掉这条代价（轻代价换重代价）",
      },
      {
        id: "e_offer_doppel",
        kind: "ascend",
        hint: "把追兵导向他者（区域改写）",
      },
      {
        id: "e_become",
        kind: "structural",
        hint: "承认自己是无主区的一部分（结构改写：永久变化）",
      },
    ],
  },

  {
    id: "tpl_ur_10_node_hard",
    theme: "unowned_region",
    floor_range: [10, 10],
    kind: "node",
    is_node: true,
    requires: [],
    prefers: [],
    forbids: ["pursuit", "backflow", "doppelganger"],
    obstacle:
      "无主区里少见的、有形状的房间。本身的阻碍并不重，但你们意识到自己已经在这里待得太久——再不动，被动抬升就会停。",
    anchors: [
      {
        id: "a_pause",
        name: "无主区里短暂的稳定",
        tags: ["calm"],
        hint: "可以整理一下，但停不久",
      },
      {
        id: "a_old_seam",
        name: "通往上层的接缝",
        tags: ["passage"],
        hint: "比之前清晰",
      },
    ],
    exits: [
      {
        id: "e_climb",
        kind: "ascend",
        hint: "趁稳定主动上行",
      },
    ],
  },
];
