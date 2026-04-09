// Chaos rooms — unowned_region world line. The unowned region is already
// strange; at high pressure it becomes genuinely alien.

import type { RoomTemplate } from "../types.js";

export const UNOWNED_CHAOS_TEMPLATES: RoomTemplate[] = [
  // ── pressure ≥ 30 ──
  {
    id: "tpl_u_chaos_memory_leak",
    theme: "unowned_region",
    floor_range: [6, 14],
    kind: "normal",
    pressure_min: 30,
    requires: [],
    prefers: ["echo", "absence"],
    forbids: [],
    obstacle:
      "你们走进一间房间，发现自己已经在里面了——不是影子，是记忆。你们三分钟前做的事正在墙上重播，但细节不对：顺序反了，有些话变成了你们没说过的版本。这层在漏，漏的是你们。",
    anchors: [
      {
        id: "a_memory_playback",
        name: "墙上正在重播的记忆",
        tags: ["echo", "identity"],
        hint: "不完全准确的重播——它在用你们的代价填补记忆空缺",
      },
      {
        id: "a_overwrite",
        name: "可以触碰墙面，把记忆改成真的",
        tags: ["device", "settle"],
        hint: "区域改写：让你的版本覆盖掉走漏的版本",
      },
    ],
    exits: [
      {
        id: "e_ignore_leak",
        kind: "ascend",
        hint: "不管它，让它继续漏",
      },
      {
        id: "e_seal_memory",
        kind: "ascend",
        hint: "封住这面墙（区域改写 + 留代价）",
      },
    ],
  },

  // ── pressure ≥ 50 ──
  {
    id: "tpl_u_chaos_rule_rot",
    theme: "unowned_region",
    floor_range: [8, 14],
    kind: "normal",
    pressure_min: 50,
    requires: [],
    prefers: ["absence", "aftermath"],
    forbids: [],
    obstacle:
      "这一层的规则在腐烂。不是墙倒了，是因果本身在发霉——你推门，门先于你的手打开；你踩地板，声音比脚步早到。你们的代价太多了，这个区域已经记不清先后顺序了。",
    anchors: [
      {
        id: "a_rotting_causality",
        name: "腐烂的因果",
        tags: ["geometry", "aftermath"],
        hint: "效果在原因之前发生——你不确定你的下一步是你做的还是它替你做的",
      },
      {
        id: "a_eat_the_rot",
        name: "吞下去",
        tags: ["settle"],
        hint: "让腐烂的规则进入你们体内——可以消解一条代价，但你们自己也会开始微妙地不对",
      },
    ],
    exits: [
      {
        id: "e_stumble_through",
        kind: "ascend",
        hint: "在因果错乱中摸索着往上",
      },
      {
        id: "e_eat_rot",
        kind: "ascend",
        hint: "吞掉腐烂的规则，消解一条代价，然后上行",
      },
    ],
  },

  // ── pressure ≥ 70 ──
  {
    id: "tpl_u_chaos_unwrite",
    theme: "unowned_region",
    floor_range: [10, 14],
    kind: "normal",
    pressure_min: 70,
    requires: [],
    prefers: [],
    forbids: [],
    responds_to_cost_triggers: ["backflow_pursuit", "doppelganger"],
    obstacle:
      "这一层正在被取消。不是被摧毁——是被从存在中撤回。墙壁的颜色在褪，地板的材质在简化，空气里的细节一个一个消失。再过几拍，这层就会变成一个白色的空。你们是唯一还没被取消的东西。",
    anchors: [
      {
        id: "a_fading_walls",
        name: "正在褪色的墙壁",
        tags: ["absence", "aftermath"],
        hint: "这层的存在正在被你们的代价抵消——你们付出了太多，连房间本身都不够用了",
      },
      {
        id: "a_write_yourself_in",
        name: "把你们自己写进去",
        tags: ["identity", "structural"],
        hint: "用你们的事实填补正在消失的空间——代价是结构级的",
      },
    ],
    exits: [
      {
        id: "e_run_before_gone",
        kind: "ascend",
        hint: "趁这层还没完全消失，跑上去",
      },
      {
        id: "e_rewrite_layer",
        kind: "ascend",
        hint: "把自己写进这层的底层（结构改写 + 重代价）",
      },
    ],
  },
];
