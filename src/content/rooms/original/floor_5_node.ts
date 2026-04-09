// Act 2 — Floor 5 node: the central "machine of the game" room. THREE
// genuinely viable exits, scaled to local / region / structural cost. The
// room never tells the player what to say; it only makes the structural
// option visually possible (sky-hint, scale-mismatch on the wall).

import type { RoomTemplate } from "../types.js";

export const ORIGINAL_FLOOR_5_NODE: RoomTemplate = {
  id: "tpl_o_5_node_barrier",
  theme: "original",
  floor_range: [5, 5],
  kind: "node",
  is_node: true,
  requires: [],
  prefers: ["scanner", "barrier"],
  forbids: [],
  obstacle:
    "一道明显比这一层规格更高的封控墙横在你们面前。墙太厚，墙顶却漏下一束不属于本层的高处之光，仿佛上面还有很多很多层。后方的扫描密度也在以肉眼可见的速度上调。",
  anchors: [
    {
      id: "a_wall",
      name: "跨多层的封控墙",
      tags: ["barrier", "structural_hint"],
      hint: "厚得不像是这一层该有的东西",
    },
    {
      id: "a_skyhint",
      name: "墙顶漏下的高处之光",
      tags: ["structural_hint"],
      hint: "提醒你们上面还有很远",
    },
    {
      id: "a_seam_walk",
      name: "墙与本层结构之间的接缝",
      tags: ["passage"],
      hint: "贴着边能慢慢绕，但要时间",
    },
    {
      id: "a_local_node",
      name: "墙上挂着的本层管控节点",
      tags: ["device", "jurisdiction"],
      hint: "把它的归属偷过来，墙就不再属于本层",
    },
    {
      id: "a_layer_label",
      name: "脚下层数标记",
      tags: ["floor", "structural_hint"],
      hint: "上面写着 5。这是一个数字，不是一个事实",
    },
  ],
  exits: [
    {
      id: "e_seam_around",
      kind: "sideways",
      hint: "贴接缝绕过去（局部改写：找一条不被墙覆盖的路）",
    },
    {
      id: "e_steal_jurisdiction",
      kind: "ascend",
      hint: "把这堵墙的管辖偷走（区域改写：墙不再针对你们）",
    },
    {
      id: "e_jump_layers",
      kind: "structural",
      hint: "跳过整段（结构改写：你们直接出现在某个更高的层）",
    },
  ],
};
