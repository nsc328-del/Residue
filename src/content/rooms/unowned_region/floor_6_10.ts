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
    requires: [],
    prefers: ["unowned"],
    forbids: [],
    responds_to_debt_triggers: ["doppelganger", "identity_doubt"],
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

  // Floor 10 node — unowned_region variant of repay/burst/hard.
  // The split is the same as the original-line node: by debt severity.
  {
    id: "tpl_ur_10_node_repay",
    theme: "unowned_region",
    floor_range: [10, 10],
    kind: "node",
    is_node: true,
    requires: [],
    prefers: [],
    forbids: [],
    responds_to_debt_triggers: ["pursuit", "backflow", "doppelganger", "forged_break"],
    obstacle:
      "追兵终于追上了。这里的空间几乎被他们填满。整间房就是这条债的实体——问题不再是怎么过，是怎么让这条事实从世界里消失。",
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
        hint: "伪造历史抹掉这条债（轻债换重债）",
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
