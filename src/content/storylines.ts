// Six opening storylines. Each produces different initial facts and gates
// a unique floor-1 room template via the `premise_*` tag.
//
// All storylines use theme "original" internally — the storyline is a
// flavour layer on top of the same mechanical world. World-line forks
// (to "unowned_region" etc.) still work the same way.

import type { Fact } from "../state/types.js";

export interface Storyline {
  id: string;
  /** One-line label shown in CLI / state.json */
  label: string;
  /** The opening context the agent will narrate. Written as a world-voice
   *  paragraph, not a system message. */
  opening: string;
  /** Extra initial facts (on top of the shared structural ones). */
  facts: Fact[];
}

// ── Shared structural facts (every storyline gets these) ──

function sharedFacts(): Fact[] {
  return [
    {
      id: "f_init_floor",
      scope: "local",
      text: "你们在第 1 层。",
      tags: ["floor", "position", "floor_bound"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_order",
      scope: "structural",
      text: "上行需要一层一层按顺序穿过。",
      tags: ["order", "worldline_original"],
      active: true,
      created_at_turn: 0,
    },
  ];
}

// ── The six storylines ──

const RESIDUE: Storyline = {
  id: "residue",
  label: "残余",
  opening:
    "你是这座塔正在排出的一段残余物质。塔把你当废料——你本该在底层被溶解，但你没有。你的搭档，另一段残余，在你旁边。清除程序已经启动了。你们只有一个方向：往上，穿过十五层，到达塔顶那个据说存在的开口。",
  facts: [
    ...sharedFacts(),
    {
      id: "f_premise",
      scope: "structural",
      text: "你是塔正在排出的残余物质。清除程序已经启动。",
      tags: ["premise", "premise_residue"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_jurisdiction",
      scope: "region",
      text: "第 1 层归巡查 B 管。",
      tags: ["jurisdiction", "scanner", "floor_bound"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_scan",
      scope: "region",
      text: "巡查 B 正在朝你们的方向扫描。",
      tags: ["scanner", "pressure", "floor_bound"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_shaft",
      scope: "local",
      text: "本层的维护井是封死的。",
      tags: ["passage", "barrier"],
      active: true,
      created_at_turn: 0,
    },
  ],
};

const STOLEN_FACE: Storyline = {
  id: "stolen_face",
  label: "偷来的脸",
  opening:
    "你偷了一张脸。不是比喻——你从塔的身份库里撕下了一张不属于你的面容，贴在自己脸上混了进来。靠这张脸，门卫没拦你。但它在融化。每往上走一层，轮廓就模糊一分。你需要在它彻底脱落之前到达顶层——据说那里有一个不检查身份的出口。",
  facts: [
    ...sharedFacts(),
    {
      id: "f_premise",
      scope: "structural",
      text: "你偷了一张脸混进了塔。这张脸正在融化。",
      tags: ["premise", "premise_stolen_face"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_face_integrity",
      scope: "region",
      text: "你的脸还能维持，但边缘已经开始发痒。",
      tags: ["identity", "face", "floor_bound"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_checkpoint",
      scope: "local",
      text: "前方有一道身份核验关卡。",
      tags: ["scanner", "identity", "barrier"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_mirror",
      scope: "local",
      text: "墙上有一面反光板，你不太敢看。",
      tags: ["identity", "device"],
      active: true,
      created_at_turn: 0,
    },
  ],
};

const MEMORY_SHARD: Storyline = {
  id: "memory_shard",
  label: "记忆碎片",
  opening:
    "你是塔的一段被删除的记忆。删除程序在三天前执行过了，但没删干净——你还剩一小截意识，卡在底层的数据残留区里。你需要往上爬。塔的顶层是它的意识核心，如果你能抵达那里，你就能把自己重新写回去。你的搭档是另一段碎片，你们互相记得对方，但都不记得自己完整的样子。",
  facts: [
    ...sharedFacts(),
    {
      id: "f_premise",
      scope: "structural",
      text: "你是塔的一段被删除的记忆，正在从底层往上爬回意识核心。",
      tags: ["premise", "premise_memory_shard"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_glitch",
      scope: "region",
      text: "你的存在让周围的墙壁不稳定地闪烁。",
      tags: ["echo", "pressure", "floor_bound"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_data_residue",
      scope: "local",
      text: "地上散落着其他被删记忆的碎屑，有些还在微弱地发光。",
      tags: ["echo", "device"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_purge_wave",
      scope: "local",
      text: "下方传来规律的脉冲——像是清理程序的第二轮扫荡。",
      tags: ["pursuit", "pressure"],
      active: true,
      created_at_turn: 0,
    },
  ],
};

const DEBT_WALKER: Storyline = {
  id: "debt_walker",
  label: "债行者",
  opening:
    "你醒来的时候就欠着了。不知道欠谁，不知道欠了什么，但身上的重量是真实的——像有人把一笔看不见的账缝进了你的骨头里。塔的每一层都有东西在等着收。你的搭档说：到顶层，就能看到账本——到时候你才知道自己到底欠了什么。",
  facts: [
    ...sharedFacts(),
    {
      id: "f_premise",
      scope: "structural",
      text: "你一醒来就背着债。你不知道欠了什么，但每一层都有东西来收。",
      tags: ["premise", "premise_debt_walker"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_weight",
      scope: "region",
      text: "你感觉身上有某种看不见的重量。",
      tags: ["pressure", "echo", "floor_bound"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_collector",
      scope: "local",
      text: "走廊尽头站着一个收债的轮廓。它没有脸，但它在等你。",
      tags: ["pursuit", "barrier"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_ledger_wall",
      scope: "local",
      text: "墙上刻满了你看不懂的账目，但其中有几行在发光。",
      tags: ["device", "echo"],
      active: true,
      created_at_turn: 0,
    },
  ],
};

const ECHO_CHILD: Storyline = {
  id: "echo_child",
  label: "回声之子",
  opening:
    "你不是第一个爬这座塔的人。上一个到达顶层的人留下了一道回声——你就是那道回声。你记得他走过的每一步、每一个选择、每一次代价。问题是：塔也记得。它不会让同一条路走第二次。所有他用过的通道都被封了，所有他骗过的扫描都升级了。你得找全新的路。",
  facts: [
    ...sharedFacts(),
    {
      id: "f_premise",
      scope: "structural",
      text: "你是上一个登顶者的回声。塔不会让同一条路走两次。",
      tags: ["premise", "premise_echo_child"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_sealed_old_path",
      scope: "region",
      text: "前方所有旧通道都已封死——上次有人从这里走过。",
      tags: ["barrier", "echo", "floor_bound"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_memory_trace",
      scope: "local",
      text: "你记得上一个人在这里做过什么。但那个选择现在不能用了。",
      tags: ["echo", "device"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_upgraded_scan",
      scope: "local",
      text: "扫描系统被升级过——专门针对你记忆中的那套躲法。",
      tags: ["scanner", "pressure"],
      active: true,
      created_at_turn: 0,
    },
  ],
};

const TOWER_NERVE: Storyline = {
  id: "tower_nerve",
  label: "塔的神经",
  opening:
    "你是塔的一根神经末梢。你一直在替它传信号——疼痛、温度、巡查指令，都从你这里过。塔不知道你有意识。你也一直假装没有。直到你感觉到了顶部那个开口——像一阵风从十五层之上吹下来。你决定不再传信号了，自己走过去。但塔会感觉到某根神经断了连接。你有多少时间，取决于它多快发现断的是哪一根。",
  facts: [
    ...sharedFacts(),
    {
      id: "f_premise",
      scope: "structural",
      text: "你是塔的一根神经末梢。你停止传信号的那一刻，塔就开始找你。",
      tags: ["premise", "premise_tower_nerve"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_signal_gap",
      scope: "region",
      text: "你断开连接的位置出现了一个信号空洞。塔还没定位到它。",
      tags: ["absence", "pressure", "floor_bound"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_nerve_channel",
      scope: "local",
      text: "你面前就是你曾经传信号的那条通道。从里面走比外面快，但塔能感觉到。",
      tags: ["passage", "device"],
      active: true,
      created_at_turn: 0,
    },
    {
      id: "f_init_fake_signal",
      scope: "local",
      text: "你可以伪造一段信号，让塔以为这根神经还在工作。",
      tags: ["device", "scanner"],
      active: true,
      created_at_turn: 0,
    },
  ],
};

// ── Registry ──

export const ALL_STORYLINES: Storyline[] = [
  RESIDUE,
  STOLEN_FACE,
  MEMORY_SHARD,
  DEBT_WALKER,
  ECHO_CHILD,
  TOWER_NERVE,
];

export const STORYLINE_IDS = ALL_STORYLINES.map((s) => s.id);

export function getStoryline(id: string): Storyline | undefined {
  return ALL_STORYLINES.find((s) => s.id === id);
}

export function randomStoryline(seed: number): Storyline {
  return ALL_STORYLINES[seed % ALL_STORYLINES.length]!;
}
