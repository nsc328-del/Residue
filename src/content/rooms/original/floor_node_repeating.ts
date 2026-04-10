// Repeating node templates — original world line. These are checkpoint rooms
// that appear every 5 floors (15, 20, 25, ...) via scales_beyond. Unlike the
// endgame tpl_o_15_top, these have no requirements and serve as generic
// reckoning/breathing/reflection points.

import type { RoomTemplate } from "../types.js";

export const ORIGINAL_NODE_REPEATING_TEMPLATES: RoomTemplate[] = [
  // ── Reckoning room: all unsettled costs laid out ──
  {
    id: "tpl_o_node_reckoning",
    theme: "original",
    floor_range: [15, 15],
    kind: "node",
    is_node: true,
    scales_beyond: true,
    requires: [],
    prefers: ["echo", "aftermath"],
    forbids: [],
    obstacle:
      "一间安静的房间。四面墙上列出了你到目前为止所有未消解的代价——每条一行，字迹是你自己的笔迹。房间中央有一个凹槽，形状刚好可以放进去一条代价。你可以在这里消解一条，或者带着它们全部继续走。",
    anchors: [
      {
        id: "a_cost_ledger",
        name: "墙上列出的代价清单",
        tags: ["aftermath", "echo"],
        hint: "每一条都是你之前留下的——字迹是你自己的",
      },
      {
        id: "a_dissolve_slot",
        name: "房间中央的凹槽",
        tags: ["device"],
        hint: "把一条代价放进去就可以消解它——但只能放一条",
      },
      {
        id: "a_silence",
        name: "房间里异常的安静",
        tags: ["calm"],
        hint: "没有扫描、没有追兵——但这种安静本身让你不安",
      },
    ],
    exits: [
      {
        id: "e_dissolve_one",
        kind: "ascend",
        hint: "消解一条代价再继续上行",
      },
      {
        id: "e_carry_all",
        kind: "ascend",
        hint: "什么都不放下，带着全部继续走",
      },
    ],
  },

  // ── Breathing layer: structural gap in the tower ──
  {
    id: "tpl_o_node_breathing",
    theme: "original",
    floor_range: [15, 15],
    kind: "node",
    is_node: true,
    scales_beyond: true,
    requires: [],
    prefers: ["pursuit", "pressure"],
    forbids: [],
    obstacle:
      "塔在这里有一个结构缝隙——两层楼板之间拉开了一段不属于任何一层的空间。追兵的脚步声在下面，扫描线在上面，但这里两者都够不到。你可以休息。但你已经知道，在这座塔里，休息本身也许有代价。",
    anchors: [
      {
        id: "a_gap",
        name: "两层楼板之间的结构缝隙",
        tags: ["passage", "calm"],
        hint: "不属于任何一层——追兵和扫描都够不到这里",
      },
      {
        id: "a_rest_cost",
        name: "缝隙角落里一个正在计时的装置",
        tags: ["device", "pressure"],
        hint: "你停留的每一秒都被记录——停太久会产生新代价",
      },
    ],
    exits: [
      {
        id: "e_rest_then_go",
        kind: "ascend",
        hint: "短暂休息后继续上行（轻代价：被记录了停留时间）",
      },
      {
        id: "e_pass_through",
        kind: "ascend",
        hint: "不停留，直接穿过缝隙继续走",
      },
    ],
  },

  // ── Mirror point: full path review ──
  {
    id: "tpl_o_node_mirror",
    theme: "original",
    floor_range: [15, 15],
    kind: "node",
    is_node: true,
    scales_beyond: true,
    requires: [],
    prefers: ["echo", "identity"],
    forbids: [],
    obstacle:
      "一面从地板到天花板的镜子。但它照出来的不是你现在的样子——它照出来的是你从第一层走到现在的完整路径。路径的形状取决于你做过的所有选择：每一次代价、每一次改写、每一次放弃。你可以只看不动，也可以试着改变路径的形状——但改变过去的形状会影响你现在站的位置。",
    anchors: [
      {
        id: "a_path_mirror",
        name: "照出完整路径的镜子",
        tags: ["echo", "identity"],
        hint: "路径的形状由你之前所有的选择决定——弯曲的地方是你犹豫过的",
      },
      {
        id: "a_path_node",
        name: "路径上一个特别亮的节点",
        tags: ["device", "echo"],
        hint: "那是你做过的最重的一个决定——你可以重新审视它",
      },
      {
        id: "a_current_position",
        name: "镜子里你现在站着的位置",
        tags: ["identity"],
        hint: "你在路径的末端——你的位置是所有之前选择的总和",
      },
    ],
    exits: [
      {
        id: "e_accept_path",
        kind: "ascend",
        hint: "接受路径的形状，继续走",
      },
      {
        id: "e_reshape",
        kind: "ascend",
        hint: "试着改变路径上一个节点的形状（区域改写：你现在的位置会偏移）",
      },
    ],
  },
];
