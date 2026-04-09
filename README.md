# Residue

一个关于人类与 AI 搭档逃离高塔的游戏。**只面向 agent 接入**——本期没有 GUI，没有给人类的直接操作界面。你通过 Claude Code、OpenClaw 或任何能调 bash 的 agent 来玩，agent 扮演 `搭档`。

代理角色见 `AGENT_PROMPT.md`。

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

## 六条故事线

每局随机选一条，或用 `--story <id>` 指定。每条故事线决定"你是谁"和第一层的环境。

| ID | 名字 | 你是谁 |
|---|---|---|
| `residue` | 残余 | 你是塔正在排出的废料。清除程序已启动，你们必须在被溶解之前爬到顶。 |
| `stolen_face` | 偷来的脸 | 你偷了一张脸混进来。它在融化——每上一层就模糊一分。 |
| `memory_shard` | 记忆碎片 | 你是塔被删除的一段记忆。删除没删干净，你正在往上爬回意识核心。 |
| `debt_walker` | 债行者 | 你醒来就欠着。不知道欠谁，不知道欠了什么。每一层都有东西来收。 |
| `echo_child` | 回声之子 | 你是上一个登顶者的回声。塔不让同一条路走两次——所有旧路封死。 |
| `tower_nerve` | 塔的神经 | 你是塔的一根神经末梢。你停止传信号的那一刻，塔就开始找你。 |

第 2 层开始共享房间池——故事线决定开场的味道，后续走向由你的选择决定。

---

## 核心机制

### 代价曲线

每句话都有"重量"。改写越深的事实，需要付出越重的代价（debt）。

| 改写 scope | 要求 |
|---|---|
| `local` | 免费。一句普通的话。 |
| `region` | ≥ 1 条轻债 |
| `structural` | ≥ 2 条债（≥ 1 条中债）|
| `root` | 消耗唯一的永久改写额度 |

代价不是惩罚——是让"重话"真的有重量。

### 债务系统

债不会拦你。你可以一路硬闯到顶层。但债会改变世界：

- **pressure 0–20**：正常房间
- **pressure 30+**：追兵倒灌、记忆泄漏
- **pressure 50+**：几何崩溃、因果腐烂
- **pressure 65+**：你的债拼成人形站在房间中央
- **pressure 80+**：塔在叫，地板脱落，脚下只剩钢筋

越暴力，世界越疯。引擎不拦你，但它会让你看见自己干了什么。

### 世界线

默认在 `original` 线上。做出足够重的结构改写（带 `worldline_*` 标签的事实），可以 fork 到 `unowned_region`——一条无主的、被遗弃的世界线。那里的规则更松，但回声更重。

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

测试覆盖代价曲线、apply-diff、生成器、世界线分叉、e2e 全流程。

---

## 怎么算"跑通"

技术上跑通 = 测试全绿 + 一次实战通关到第 15 层。

设计上跑通是另一回事。通完一局之后问自己：

- 这拍爽不爽？
- 玩家有没有真的拿到一样东西？
- 世界有没有真的留下一个具体变化？
- 这个变化会不会在后面变成新的可玩选择？

如果第四个问题答不出来，骨架还不行。
