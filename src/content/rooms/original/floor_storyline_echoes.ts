// Storyline echo rooms — mid/late game templates (floors 6-14) that respond
// to the player's opening storyline. Each requires its premise tag so only
// one is eligible per run. This keeps the storyline identity alive beyond
// floor 1 and prevents the "all runs feel the same after floor 5" problem.

import type { RoomTemplate } from "../types.js";

export const STORYLINE_ECHO_TEMPLATES: RoomTemplate[] = [
  // ── residue: the purge catches up ──
  {
    id: "tpl_echo_residue",
    theme: "original",
    floor_range: [6, 13],
    kind: "normal",
    scales_beyond: true,
    requires: ["premise_residue"],
    prefers: ["pressure", "pursuit"],
    forbids: [],
    responds_to_fact_tags: ["premise_residue"],
    obstacle:
      "清除程序换了一种形态。之前是扫描线，现在是一团没有形状的溶解场——它从楼下慢慢涌上来，经过的地方墙壁变成流质。它在找你，因为你本来就该在那片流质里。",
    anchors: [
      {
        id: "a_dissolve_field",
        name: "正在涌上来的溶解场",
        tags: ["pursuit", "echo"],
        hint: "它不快，但它不会停——你是它的目标物",
      },
      {
        id: "a_residue_trail",
        name: "你身后脱落的残余碎屑",
        tags: ["echo", "identity"],
        hint: "你走过的地方会留下痕迹，溶解场循着它追",
      },
      {
        id: "a_drain_grate",
        name: "地板上一个还没被淹没的排水口",
        tags: ["passage", "device"],
        hint: "可以把溶解场暂时引到下层——但那只是暂时的",
      },
    ],
    exits: [
      {
        id: "e_outrun",
        kind: "ascend",
        hint: "跑在溶解场前面",
      },
      {
        id: "e_drain",
        kind: "ascend",
        hint: "把溶解场引入排水口再上行（区域改写）",
      },
    ],
  },

  // ── stolen_face: the face is failing ──
  {
    id: "tpl_echo_stolen_face",
    theme: "original",
    floor_range: [6, 13],
    kind: "normal",
    scales_beyond: true,
    requires: ["premise_stolen_face"],
    prefers: ["identity", "scanner"],
    forbids: [],
    responds_to_fact_tags: ["premise_stolen_face"],
    obstacle:
      "你的脸又掉了一块。不是比喻——右颧骨的位置出现了一片空白，像有人用橡皮擦过。你路过一面反光墙时看见了自己：偷来的那张脸现在只剩大半，露出来的部分不是你原来的样子，是一片没有五官的光滑表面。前方有一道升级过的身份核验带，比第一层那道密得多。",
    anchors: [
      {
        id: "a_crumbling_face",
        name: "正在脱落的偷来的脸",
        tags: ["identity", "echo"],
        hint: "每过一层就掉一块——你需要找到补救的办法，或者接受没有脸",
      },
      {
        id: "a_upgraded_id_check",
        name: "升级过的身份核验带",
        tags: ["scanner", "identity", "barrier"],
        hint: "这一道比第一层厉害多了——半张脸可能骗不过去",
      },
      {
        id: "a_discarded_face",
        name: "地上一张被丢弃的旧面容",
        tags: ["identity", "device"],
        hint: "质量不好，但可以暂时补上你脸上的缺口",
      },
    ],
    exits: [
      {
        id: "e_bluff_through",
        kind: "ascend",
        hint: "用剩下的半张脸硬闯核验带",
      },
      {
        id: "e_patch_face",
        kind: "ascend",
        hint: "捡起地上的旧面容补上再过（区域改写：留下身份混合的痕迹）",
      },
      {
        id: "e_go_faceless",
        kind: "ascend",
        hint: "撕掉剩下的脸，以无面者的身份通过（代价：身份系统会开始追踪你）",
      },
    ],
  },

  // ── memory_shard: encounter your complete self ──
  {
    id: "tpl_echo_memory_shard",
    theme: "original",
    floor_range: [7, 13],
    kind: "normal",
    scales_beyond: true,
    requires: ["premise_memory_shard"],
    prefers: ["echo"],
    forbids: [],
    responds_to_fact_tags: ["premise_memory_shard"],
    obstacle:
      "你遇见了自己的完整版本。它站在走廊中央，背对着你，正在做你被删除之前做的最后一件事——但你不记得那是什么了。它没有意识到你在身后。它比你完整、比你清晰、比你更像你自己。你可以触碰它，但那会让它知道你在这里。",
    anchors: [
      {
        id: "a_complete_self",
        name: "你被删除前的完整版本",
        tags: ["echo", "identity", "doppelganger"],
        hint: "它不知道自己已经被删了——它还在执行最后那个指令",
      },
      {
        id: "a_last_action",
        name: "它正在做的那件事",
        tags: ["echo", "device"],
        hint: "你不记得那是什么，但如果你看清楚了，也许能恢复那段记忆",
      },
      {
        id: "a_absorb_point",
        name: "你和它之间的距离",
        tags: ["identity"],
        hint: "如果你碰到它，你们会合并——但合并后谁是主导的那个？",
      },
    ],
    exits: [
      {
        id: "e_watch_and_go",
        kind: "ascend",
        hint: "不打扰它，绕过去继续上行",
      },
      {
        id: "e_absorb",
        kind: "ascend",
        hint: "触碰它，尝试合并（区域改写：身份可能变化）",
      },
      {
        id: "e_steal_memory",
        kind: "ascend",
        hint: "偷看它在做的事，拿走那段记忆但不惊动它",
      },
    ],
  },

  // ── debt_walker: the collector returns ──
  {
    id: "tpl_echo_debt_walker",
    theme: "original",
    floor_range: [6, 13],
    kind: "normal",
    scales_beyond: true,
    requires: ["premise_debt_walker"],
    prefers: ["pressure", "echo"],
    forbids: [],
    responds_to_fact_tags: ["premise_debt_walker"],
    obstacle:
      "那个收取代价的轮廓又出现了。但这次它不是站在走廊尽头——它坐在一把椅子上，面前摆着一张桌子。桌上铺着一份你看不完整的清单，但你能看见其中几行在发光：它们对应的是你在之前几层付出的代价。它抬起没有脸的头，朝你的方向点了一下，像是在说：坐。",
    anchors: [
      {
        id: "a_collector_seated",
        name: "坐着的收取代价者",
        tags: ["pursuit", "echo"],
        hint: "它不追你了——它在等你来",
      },
      {
        id: "a_ledger_partial",
        name: "桌上不完整的清单",
        tags: ["device", "echo"],
        hint: "你之前付出的几条代价在上面发光——也许触碰它们可以消解",
      },
      {
        id: "a_empty_chair",
        name: "桌子对面的空椅子",
        tags: ["device"],
        hint: "坐下来意味着和它谈判——但你不知道它要什么",
      },
    ],
    exits: [
      {
        id: "e_ignore_collector",
        kind: "ascend",
        hint: "不理它，绕过去",
      },
      {
        id: "e_sit_down",
        kind: "ascend",
        hint: "坐下来谈（可以消解一条代价，但它会要求你答应一件事）",
      },
      {
        id: "e_flip_table",
        kind: "ascend",
        hint: "掀翻桌子（那份清单会散落，代价会变得更难追踪）",
      },
    ],
  },

  // ── echo_child: butterfly effect ──
  {
    id: "tpl_echo_echo_child",
    theme: "original",
    floor_range: [6, 13],
    kind: "normal",
    scales_beyond: true,
    requires: ["premise_echo_child"],
    prefers: ["echo", "barrier"],
    forbids: [],
    responds_to_fact_tags: ["premise_echo_child"],
    obstacle:
      "上一个人在这一层做过一个选择。你记得那个选择——他往左走了。但他不知道的是，他往左走的那一刻，右边的通道坍塌了，坍塌引发了一连串连锁反应，现在这一层的结构已经和他走过的时候完全不同了。路不是被封了，是被他改了形状。而你是唯一知道这件事的人。",
    anchors: [
      {
        id: "a_collapsed_right",
        name: "上一个人走后坍塌的右侧通道",
        tags: ["barrier", "echo"],
        hint: "他的选择的蝴蝶效应——这条路现在不通了",
      },
      {
        id: "a_left_path_trace",
        name: "他走过的左侧通道留下的痕迹",
        tags: ["echo", "passage"],
        hint: "他的路还能走，但塔已经在这条路上加了针对他的防御——你呢？",
      },
      {
        id: "a_structural_crack",
        name: "坍塌连锁反应造成的结构裂缝",
        tags: ["passage", "damage"],
        hint: "不是旧路也不是新路——是上次坍塌撕开的第三条路",
      },
    ],
    exits: [
      {
        id: "e_old_left",
        kind: "ascend",
        hint: "走他走过的左侧路（有针对他的防御，但你不是他）",
      },
      {
        id: "e_crack_path",
        kind: "ascend",
        hint: "从坍塌裂缝钻过去（一条他不知道的路）",
      },
    ],
  },

  // ── tower_nerve: the tower locates the gap ──
  {
    id: "tpl_echo_tower_nerve",
    theme: "original",
    floor_range: [6, 13],
    kind: "normal",
    scales_beyond: true,
    requires: ["premise_tower_nerve"],
    prefers: ["absence", "pressure"],
    forbids: [],
    responds_to_fact_tags: ["premise_tower_nerve"],
    obstacle:
      "塔找到了。不是找到你——是找到了你断开连接时留下的那个信号空洞。你能感觉到整座塔的注意力正在从四面八方向那个空洞收拢。它还没定位到你本人，但它知道空洞在移动——因为你在移动。你脚下曾经传过无数次信号的那条通道正在被塔一段一段地关闭，像在封锁一条神经。",
    anchors: [
      {
        id: "a_closing_channel",
        name: "正在被逐段关闭的信号通道",
        tags: ["passage", "barrier", "absence"],
        hint: "你以前在这里传信号——现在塔在把它一截截掐断",
      },
      {
        id: "a_attention_wave",
        name: "塔的注意力正在收拢",
        tags: ["pursuit", "pressure"],
        hint: "它在缩小范围——每多停一拍，包围圈就小一圈",
      },
      {
        id: "a_decoy_signal",
        name: "可以释放的一段伪造信号",
        tags: ["device", "scanner"],
        hint: "让塔以为空洞在别的地方——但伪造信号的频率你不完全记得了",
      },
    ],
    exits: [
      {
        id: "e_sprint_before_close",
        kind: "ascend",
        hint: "趁通道没全关，冲过去",
      },
      {
        id: "e_decoy",
        kind: "ascend",
        hint: "放一段伪造信号再走（区域改写：可能买到几层的时间）",
      },
      {
        id: "e_reconnect_briefly",
        kind: "ascend",
        hint: "暂时重新连上，假装还在工作——但塔会感觉到你在动",
      },
    ],
  },
];
