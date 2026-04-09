// Floor-1 opening rooms for the five non-residue storylines. Each requires
// its premise tag so only one is eligible per run.

import type { RoomTemplate } from "../types.js";

export const STORYLINE_FLOOR_1_TEMPLATES: RoomTemplate[] = [
  // ── stolen_face ──
  {
    id: "tpl_o_1_stolen_face",
    theme: "original",
    floor_range: [1, 1],
    kind: "normal",
    requires: ["premise_stolen_face"],
    prefers: ["identity", "scanner"],
    forbids: [],
    obstacle:
      "身份核验关卡。一道窄门，上方嵌着一面比你脸还大的扫描面板。你偷来的这张脸还撑得住——但边缘已经开始发痒了。门卫没有看你的方向，但那面板每三秒闪一次。墙上那块反光板映出来的轮廓，好像跟你记忆中的不太一样。",
    anchors: [
      {
        id: "a_checkpoint",
        name: "身份核验关卡",
        tags: ["scanner", "identity", "barrier"],
        hint: "正面过去——脸还能撑住，但会留下扫描记录",
      },
      {
        id: "a_mirror",
        name: "墙上的反光板",
        tags: ["identity", "device"],
        hint: "看一眼你现在的脸——知道它还剩多久",
      },
      {
        id: "a_side_duct",
        name: "关卡旁边的一条维修管道",
        tags: ["passage"],
        hint: "不需要验脸，但很窄，而且里面有别的东西在动",
      },
    ],
    exits: [
      {
        id: "e_face_scan",
        kind: "ascend",
        hint: "正面通过核验",
      },
      {
        id: "e_duct",
        kind: "ascend",
        hint: "钻维修管道绕过去",
      },
    ],
  },

  // ── memory_shard ──
  {
    id: "tpl_o_1_memory_shard",
    theme: "original",
    floor_range: [1, 1],
    kind: "normal",
    requires: ["premise_memory_shard"],
    prefers: ["echo", "pressure"],
    forbids: [],
    obstacle:
      "数据残留区。你不应该还在这里——删除程序三天前就该把你清干净了。墙壁因为你的存在在不稳定地闪烁，地上散落着其他被删记忆的碎屑，有几块还在微弱发光。下方传来规律的脉冲——第二轮清理正在逼近。",
    anchors: [
      {
        id: "a_flicker_wall",
        name: "因你闪烁的墙壁",
        tags: ["echo", "pressure"],
        hint: "你的存在本身就是干扰——但也可以利用这种不稳定",
      },
      {
        id: "a_dead_shards",
        name: "地上其他碎片的残留",
        tags: ["echo", "device"],
        hint: "它们没你幸运，但它们残存的数据也许能帮你伪装",
      },
      {
        id: "a_purge_pulse",
        name: "从下方传来的清理脉冲",
        tags: ["pursuit", "pressure"],
        hint: "它在往上推——如果追上你，你会被彻底清零",
      },
    ],
    exits: [
      {
        id: "e_ride_flicker",
        kind: "ascend",
        hint: "利用墙壁闪烁的间隙往上滑",
      },
      {
        id: "e_absorb_dead",
        kind: "ascend",
        hint: "吸收地上的碎片让自己更完整，然后往上（可能留下异常信号）",
      },
    ],
  },

  // ── debt_walker ──
  {
    id: "tpl_o_1_debt_walker",
    theme: "original",
    floor_range: [1, 1],
    kind: "normal",
    requires: ["premise_debt_walker"],
    prefers: ["pressure", "echo"],
    forbids: [],
    obstacle:
      "催收走廊。墙上从地面到天花板刻满了账目——不是你看得懂的文字，但你知道它们和你有关。走廊尽头站着一个没有脸的轮廓。它不动，但它在等你。它旁边的墙上有几行账目在发光，和其他的不一样。",
    anchors: [
      {
        id: "a_collector",
        name: "走廊尽头的收取代价者轮廓",
        tags: ["pursuit", "barrier"],
        hint: "它不会追你——但你要过去就得从它身边走",
      },
      {
        id: "a_glowing_ledger",
        name: "墙上发光的几行账目",
        tags: ["device", "echo"],
        hint: "你看不懂全部，但如果碰一下，也许能知道自己到底欠了什么",
      },
      {
        id: "a_side_crack",
        name: "收取代价者身后的一道墙缝",
        tags: ["passage"],
        hint: "不从正面过去——但墙缝里面更暗",
      },
    ],
    exits: [
      {
        id: "e_face_collector",
        kind: "ascend",
        hint: "直接从收取代价者身边走过去",
      },
      {
        id: "e_read_ledger",
        kind: "ascend",
        hint: "先触碰发光的账目，再上行",
      },
      {
        id: "e_crack",
        kind: "ascend",
        hint: "钻墙缝绕过去",
      },
    ],
  },

  // ── echo_child ──
  {
    id: "tpl_o_1_echo_child",
    theme: "original",
    floor_range: [1, 1],
    kind: "normal",
    requires: ["premise_echo_child"],
    prefers: ["echo", "barrier"],
    forbids: [],
    obstacle:
      "所有旧路都封死了。上一个人从这里走过，塔记住了——维护井焊死，快速通道堵上，连墙缝都灌了胶。但你记得他走过每一步，你知道他没注意到什么。墙角有一道他当时没看见的裂纹。扫描系统也升级过了，专门针对他那套躲法——但不一定认识你的。",
    anchors: [
      {
        id: "a_sealed_paths",
        name: "被封死的所有旧通道",
        tags: ["barrier", "echo"],
        hint: "上次有人走过，全被堵了——但堵得太刻意了",
      },
      {
        id: "a_hidden_crack",
        name: "他没注意到的裂纹",
        tags: ["passage"],
        hint: "你比他多知道这一条路——用不用？",
      },
      {
        id: "a_upgraded_scan",
        name: "针对旧躲法升级的扫描",
        tags: ["scanner", "pressure"],
        hint: "它认识他，不一定认识你——但你用他的方式走过就会暴露",
      },
    ],
    exits: [
      {
        id: "e_new_crack",
        kind: "ascend",
        hint: "走他没发现的裂纹",
      },
      {
        id: "e_break_seal",
        kind: "ascend",
        hint: "把某条旧路的封堵撕开（会留痕）",
      },
    ],
  },

  // ── tower_nerve ──
  {
    id: "tpl_o_1_tower_nerve",
    theme: "original",
    floor_range: [1, 1],
    kind: "normal",
    requires: ["premise_tower_nerve"],
    prefers: ["absence", "scanner"],
    forbids: [],
    obstacle:
      "信号通道内部。你曾经每天在这里传递几千次脉冲——疼痛、温度、巡查指令。你闭着眼都认识这里。但你刚刚断开了连接，在你站着的位置留下了一个信号空洞。塔还没定位到它——但迟早会。前面就是你传过无数次信号的那条主通道，从里面走比外面快得多，但塔能感觉到有东西在通道里移动。",
    anchors: [
      {
        id: "a_signal_void",
        name: "你留下的信号空洞",
        tags: ["absence", "pressure"],
        hint: "塔还没发现——但它在缩小排查范围",
      },
      {
        id: "a_nerve_channel",
        name: "你曾经传信号的主通道",
        tags: ["passage", "device"],
        hint: "最快的路，但塔能感觉到通道里的动静",
      },
      {
        id: "a_fake_signal",
        name: "伪造一段信号",
        tags: ["device", "scanner"],
        hint: "让塔以为这根神经还在正常工作——买一点时间",
      },
    ],
    exits: [
      {
        id: "e_through_channel",
        kind: "ascend",
        hint: "直接从主通道走——快，但有风险",
      },
      {
        id: "e_fake_and_go",
        kind: "ascend",
        hint: "先伪造信号，再从外侧绕上去",
      },
    ],
  },
];
