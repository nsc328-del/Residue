# Residue

一个关于人类与 AI 搭档逃离高塔的游戏。**只面向 agent 接入**——本期没有 GUI，没有给人类的直接操作界面。你通过 Claude Code、OpenClaude 或任何能调 bash 的 agent 来玩，agent 扮演 `搭档`。

设计哲学见 `current-design-summary.md`。代理角色见 `AGENT_PROMPT.md`。

---

## 安装

```bash
npm install
npm run build
```

需要 Node 20+。

---

## 起一局

1. 在仓库根目录起一个会调用 `bash` 的 agent（Claude Code 是默认选择）。
2. 让它把 `AGENT_PROMPT.md` 当作扮演 `搭档` 的系统提示。比如直接说："读一下 `AGENT_PROMPT.md`，从现在开始你就是搭档。然后调用 `node dist/cli.js init`，叙述第一间房，等我说话。"
3. 用自然语言说话。一句话、一拍。

agent 会通过 bash 调 `node dist/cli.js <command>` 读写状态，并把结构化的房间用世界语言叙述给你。

---

## 状态在哪里

每一局的状态在 `./run/` 下：

- `run/state.json` — 当前活跃事实、债、世界线、当前房间
- `run/history.jsonl` — 每次 apply 留下的 append-only 日志

调试时 `cat run/state.json | jq` 可以直接看。`node dist/cli.js debug-facts` 给一份更可读的事实/债表。

---

## CLI 速查

```
residue init [--seed N] [--story S] [--force]   开新局
  stories: residue, stolen_face, memory_shard, debt_walker, echo_child, tower_nerve
residue state                       完整 state.json
residue room                        当前房间 JSON
residue status                      一行摘要
residue apply '<diff json>'         提交 diff
residue memory '<query>'            搜索过往
residue end-check                   检查是否到顶层
residue debug-facts                 fact 表（调试）
```

`--state-dir <path>` 指定非默认状态目录。

---

## 跑测试

```bash
npm test
```

测试覆盖代价曲线、apply-diff、生成器、世界线分叉。

---

## 怎么算"跑通"

技术上跑通 = 测试全绿 + 一次实战通关到第 15 层。

设计上跑通是另一回事。通完一局之后问自己（来自 `current-design-summary.md` 第 5 节）：

- 这拍爽不爽？
- 玩家有没有真的拿到一样东西？
- 世界有没有真的留下一个具体变化？
- 这个变化会不会在后面变成新的可玩选择？

如果第四个问题答不出来，骨架还不行。这是这个项目最重要的红线。
