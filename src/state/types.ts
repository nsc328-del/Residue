// All shared types for the Residue engine.
//
// The state model is intentionally a single tree so the agent can read it in
// one CLI call. Nothing here is prose — narration is the agent's job.

export type FactScope = "root" | "structural" | "region" | "local";

export type Fact = {
  id: string;
  scope: FactScope;
  text: string; // natural language; agent reads this to understand
  tags: string[]; // generator-side keys, e.g. ["scanner", "barrier"]
  active: boolean;
  created_at_turn: number;
  immutable_reason?: string; // hint for root facts ("you are the escaping core")
};

export type DebtSeverity = "light" | "medium" | "heavy";

export type Debt = {
  id: string;
  severity: DebtSeverity;
  text: string;
  source_turn: number;
  settled: boolean;
  triggers: string[]; // generator hints, e.g. ["scanner_density+", "backflow_pursuit"]
};

export type AnchorTemplate = {
  id: string;
  name: string;
  tags: string[];
  hint: string;
};

export type ExitKind = "ascend" | "descend" | "sideways" | "structural";

export type ExitTemplate = {
  id: string;
  kind: ExitKind;
  hint: string;
};

export type Room = {
  id: string;
  template_id: string;
  theme: string;
  floor: number;
  anchors: AnchorTemplate[];
  obstacle: string;
  exits: ExitTemplate[];
  active_fact_ids: string[]; // facts that show up in this room
  generated_from: string[]; // ids of facts/debts that drove template selection
};

export type WorldLine = {
  current: string; // theme id
  forks: WorldLineFork[];
};

export type WorldLineFork = {
  from: string;
  to: string;
  at_turn: number;
  cause: string;
};

export type PartnerState = {
  // Engine exposes raw signals; the agent decides how to perform.
  debt_pressure: number; // 0..100
  last_diff_summary: string | null;
};

export type Meta = {
  run_id: string;
  seed: number;
  floor: number; // 1..15
  turn: number;
  started_at: string; // ISO timestamp
  ended: false | { reason: string; floor: number };
  perma_rewrite_token_remaining: number; // starts at 1
  storyline?: string; // which opening storyline was chosen
};

export type State = {
  meta: Meta;
  world_line: WorldLine;
  facts: Fact[];
  debts: Debt[];
  current_room: Room;
  partner_state: PartnerState;
};

// ---------- Diff format (what the agent submits) ----------

export type DiffOp =
  | { op: "add_fact"; fact: NewFact }
  | { op: "remove_fact"; id: string }
  | { op: "add_debt"; debt: NewDebt }
  | { op: "settle_debt"; id: string }
  | { op: "consume_perma_token" }
  | { op: "mark_worldline_fork"; to: string; cause: string }
  // jump_floor: declare a non-default floor advancement. Default is +1 per
  // diff. Anything beyond +1 is treated as structural and must come with the
  // matching debts.
  | { op: "jump_floor"; to: number };

export type NewFact = {
  id?: string; // engine fills if missing
  scope: FactScope;
  text: string;
  tags: string[];
};

export type NewDebt = {
  id?: string;
  severity: DebtSeverity;
  text: string;
  triggers: string[];
};

export type Diff = {
  player_sentence: string;
  rationale: string;
  operations: DiffOp[];
};

// ---------- History entry (append-only log) ----------

export type HistoryEntry = {
  turn: number;
  at: string; // ISO timestamp
  player_sentence: string;
  rationale: string;
  operations: DiffOp[];
  resulting_floor: number;
  resulting_world_line: string;
  resulting_room_id: string;
  debt_ids_after: string[];
};
