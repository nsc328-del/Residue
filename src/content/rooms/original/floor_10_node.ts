// Act 2 — Floor 10 node, original world line. Three variants:
//
//   tpl_o_10_node_repay        — selected when the player carries a heavy cost
//   tpl_o_10_node_light_burst  — selected when only light costs are open
//   tpl_o_10_node_hard         — selected when no cost is open
//
// The generator picks via responds_to_cost_triggers + scoring; the heaviest
// match wins. is_node + floor lock guarantees this floor always picks one of
// the three.

import type { RoomTemplate } from "../types.js";

export const ORIGINAL_FLOOR_10_NODES: RoomTemplate[] = [
  {
    id: "tpl_o_10_node_repay",
    theme: "original",
    floor_range: [10, 10],
    kind: "node",
    is_node: true,
    requires: [],
    prefers: [],
    forbids: [],
    responds_to_cost_triggers: ["pursuit", "backflow", "doppelganger", "forged_break"],
    obstacle:
      "整间房就是你们之前借的那笔重代价的实体。它已经追上来了。问题不是怎么把它打掉——问题是怎么让它消失。",
    anchors: [
      {
        id: "a_debt_made_flesh",
        name: "走在前方的'你们之前借的那个东西'",
        tags: ["pursuit", "echo"],
        hint: "它的形态由你们之前留下的代价决定",
      },
      {
        id: "a_forge_altar",
        name: "可以伪造一段历史的注册台",
        tags: ["device", "forge"],
        hint: "用一段假记录把这条代价从世界里抹掉（但伪造本身是新代价）",
      },
      {
        id: "a_shoulder",
        name: "可以把代价转嫁到别的系统的接口",
        tags: ["device", "transfer"],
        hint: "把代价推给别的东西，自己脱身",
      },
      {
        id: "a_accept",
        name: "可以让代价永久固化的接受口",
        tags: ["device", "rule_change"],
        hint: "接受这条事实成为世界的一部分。代价：你们的某个身份从此不一样",
      },
    ],
    exits: [
      {
        id: "e_forge",
        kind: "ascend",
        hint: "伪造一段历史抹掉这条代价（轻代价换重代价）",
      },
      {
        id: "e_transfer",
        kind: "ascend",
        hint: "把代价转嫁出去（区域改写）",
      },
      {
        id: "e_accept",
        kind: "structural",
        hint: "接受它成为世界规则（结构改写：永久变化）",
      },
    ],
  },

  {
    id: "tpl_o_10_node_light_burst",
    theme: "original",
    floor_range: [10, 10],
    kind: "node",
    is_node: true,
    requires: [],
    prefers: [],
    forbids: ["pursuit", "backflow", "doppelganger"],
    responds_to_cost_triggers: ["scanner_density+", "identity_doubt", "trace_smell"],
    obstacle:
      "之前那笔小代价突然变大。一开始只是一个误读，现在那个误读已经长成了一整面针对你们的搜捕网。",
    anchors: [
      {
        id: "a_swelling_search",
        name: "正在膨胀的搜捕网",
        tags: ["scanner", "pressure"],
        hint: "由你们之前的小代价滚成的",
      },
      {
        id: "a_seam",
        name: "搜捕网中间的一个未补合的缝",
        tags: ["passage"],
        hint: "贴着边缘可以挤过去",
      },
      {
        id: "a_misdirect",
        name: "可以制造错误目标的回响节点",
        tags: ["device"],
        hint: "让搜捕网朝错误的方向收口",
      },
    ],
    exits: [
      {
        id: "e_squeeze",
        kind: "ascend",
        hint: "贴着缝挤过去",
      },
      {
        id: "e_misdirect",
        kind: "ascend",
        hint: "把搜捕网骗到别处（区域改写）",
      },
    ],
  },

  {
    id: "tpl_o_10_node_hard",
    theme: "original",
    floor_range: [10, 10],
    kind: "node",
    is_node: true,
    requires: [],
    prefers: ["barrier"],
    forbids: ["pursuit", "backflow", "scanner_density+", "identity_doubt", "trace_smell"],
    obstacle:
      "一段没有先前后果可借力的硬阻碍。这里只有当下：一道你们必须当场处理的封控。没有回响，没有代价，没有便宜可占。",
    anchors: [
      {
        id: "a_clean_barrier",
        name: "干净的封控带",
        tags: ["barrier"],
        hint: "本层规模、本层难度",
      },
      {
        id: "a_lever",
        name: "封控带边缘的物理杠杆",
        tags: ["device"],
        hint: "可以撬开一段",
      },
    ],
    exits: [
      {
        id: "e_lever",
        kind: "ascend",
        hint: "撬开穿过去",
      },
      {
        id: "e_break_zone",
        kind: "ascend",
        hint: "把整段封控带打下来（区域改写）",
      },
    ],
  },
];
