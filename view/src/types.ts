// Read-only mirror of the engine's State type.
// Hand-written to avoid importing engine code (different module system).

export type FactScope = "root" | "structural" | "region" | "local";

export type Fact = {
  id: string;
  scope: FactScope;
  text: string;
  tags: string[];
  active: boolean;
  created_at_turn: number;
  immutable_reason?: string;
};

export type CostSeverity = "light" | "medium" | "heavy";

export type Cost = {
  id: string;
  severity: CostSeverity;
  text: string;
  source_turn: number;
  settled: boolean;
  triggers: string[];
};

export type ExitKind = "ascend" | "descend" | "sideways" | "structural";

export type AnchorTemplate = {
  id: string;
  name: string;
  tags: string[];
  hint: string;
};

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
  active_fact_ids: string[];
  generated_from: string[];
};

export type WorldLineFork = {
  from: string;
  to: string;
  at_turn: number;
  cause: string;
};

export type Meta = {
  run_id: string;
  seed: number;
  floor: number;
  turn: number;
  started_at: string;
  ended: false | { reason: string; floor: number };
  perma_rewrite_token_remaining: number;
  storyline?: string;
};

export type PartnerState = {
  cost_pressure: number;
  last_diff_summary: string | null;
};

export type State = {
  meta: Meta;
  world_line: {
    current: string;
    forks: WorldLineFork[];
  };
  facts: Fact[];
  costs: Cost[];
  current_room: Room;
  partner_state: PartnerState;
};

export type StorylineId =
  | "residue"
  | "stolen_face"
  | "memory_shard"
  | "debt_walker"
  | "echo_child"
  | "tower_nerve";

export type ThemeId = "original" | "unowned_region";
