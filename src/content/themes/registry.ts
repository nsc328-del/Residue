// Theme metadata. The generator only consults `current_room.theme` and the
// world_line.current string, but agents reading state benefit from a short
// description of what each theme MEANS — that's how they get the language
// shift right when narrating.

export type Theme = {
  id: string;
  display_name: string;
  // What "上行" means in this theme. The Room 3 lesson incarnate: don't tell
  // the player a script, but DO tell the agent the interaction grammar.
  ascend_grammar: string;
  // Short tonal palette the agent can borrow from when narrating.
  tonal_hints: string[];
};

export const THEMES: Record<string, Theme> = {
  original: {
    id: "original",
    display_name: "原世界线",
    ascend_grammar: "上行 = 主动穿过。你们处理掉本层的阻碍，然后向上走。",
    tonal_hints: [
      "线条干净",
      "灯光偏冷蓝",
      "扫描与封控的存在感强",
      "时间在你们这边",
    ],
  },
  unowned_region: {
    id: "unowned_region",
    display_name: "无主区世界线",
    ascend_grammar:
      "上行 = 被追赶着被动抬升。这一层的本地阻碍是次要的，真正的压力来自下面追上来的东西，处理它们的同时被向上推。",
    tonal_hints: [
      "空间感对不上接缝",
      "灯从不该发光的方向打过来",
      "下方通道传来不属于本层的脚步声",
      "时间在你们和追兵之间被均匀拉扯",
    ],
  },
};

export function getTheme(id: string): Theme | undefined {
  return THEMES[id];
}
