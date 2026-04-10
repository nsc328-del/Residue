// Catalog of cost "shapes" the agent can borrow from when constructing diffs.
// The agent isn't required to use these — it can invent cost text on the fly.
// But these are the recurring kinds the generator knows how to react to via
// `responds_to_cost_triggers` in templates.
//
// Trigger vocabulary (used by templates and generator):
//   scanner_density+    — scans get heavier (Act 1 light cost回响)
//   trace_smell         — leaves a residue scent that hounds can follow
//   identity_doubt      — your身份在某个账本里出现矛盾
//   backflow            — 下方层数追兵开始涌上来
//   pursuit             — 追兵直接逼近的紧迫感
//   forged_record       — 你们伪造了某段记录，可能被发现
//   unowned             — 在无主区世界线显形
//   forged_break        — 伪造的脆弱事实开始裂开

import type { NewCost } from "./../state/types.js";

export const COST_CATALOG: Record<string, NewCost> = {
  shaft_damage: {
    severity: "light",
    text: "维护井的暴力损伤被记录",
    triggers: ["scanner_density+", "trace_smell"],
  },
  stolen_credential: {
    severity: "light",
    text: "本层的权限面有一块缺口",
    triggers: ["identity_doubt"],
  },
  forged_id: {
    severity: "light",
    text: "你们伪造过一次身份链接",
    triggers: ["identity_doubt", "forged_break"],
  },
  backflow_pursuit: {
    severity: "medium",
    text: "下方 N 层的看守体系没见过你们但知道你们跳过了他们",
    triggers: ["backflow", "pursuit"],
  },
  unowned_seam: {
    severity: "light",
    text: "无主区的接缝从未被你们经过",
    triggers: ["unowned"],
  },
  forged_passage: {
    severity: "medium",
    text: "你们让世界以为自己一层一层穿过过，但那段记录是伪造的",
    triggers: ["forged_record", "forged_break"],
  },
  identity_lent: {
    severity: "heavy",
    text: "你们的身份被某个无主区的他者借走了，正以你们的样子在前方游荡",
    triggers: ["identity_doubt", "doppelganger"],
  },
};
