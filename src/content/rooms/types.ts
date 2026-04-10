// Room templates: what the generator picks from. Each template declares what
// kind of fact set it likes / dislikes. The generator scores templates against
// the current state and picks the best.
//
// A template is NOT prose. It's a structured shape the agent will narrate.

import type { AnchorTemplate, ExitTemplate } from "../../state/types.js";

export type RoomKind = "normal" | "node" | "aftermath";

export type RoomTemplate = {
  id: string;
  theme: string;
  floor_range: [number, number]; // inclusive
  kind: RoomKind;

  // Tag-based scoring against the current fact / cost landscape:
  requires: string[]; // template only eligible if every tag is present in active facts
  prefers: string[]; // each present tag adds a positive bump
  forbids: string[]; // each present tag disqualifies the template
  // Required cost triggers — if any of these strings appear in any open
  // cost's `triggers` array, this template gets a strong score boost. This is
  // how repay rooms get auto-selected when their target cost is open.
  responds_to_cost_triggers?: string[];
  // Fact-tag matches — same mechanic as responds_to_cost_triggers but matches
  // against active fact tags. Used for storyline-flavour rooms, item reactions,
  // and player-choice echoes.
  responds_to_fact_tags?: string[];

  // Whether this template is eligible only when the floor is exactly the
  // first number of floor_range AND the floor is one of the locked node
  // floors (5, 10, 15, 20, ...). Used to enforce that every 5th floor
  // always picks a node.
  is_node?: boolean;

  // When true, this template remains eligible for any floor >= floor_range[0],
  // ignoring the upper bound. Used so late-game templates can repeat on
  // floors beyond the original 15-floor range.
  scales_beyond?: boolean;

  // Minimum cost_pressure required for this template to be eligible.
  // Omit or set to 0 for always-eligible. High values gate "chaos" rooms
  // that only appear when the player has been reckless.
  pressure_min?: number;

  // The structural shape the agent will narrate. Slots like {scanner_name}
  // are filled by the generator from active facts.
  obstacle: string;
  anchors: AnchorTemplate[];
  exits: ExitTemplate[];

  // Optional extra anchor pool. The generator randomly picks
  // `anchor_pick_count` (default 1) anchors from this pool and appends them
  // to the fixed `anchors` array. This adds per-room variety so the same
  // template doesn't always look identical.
  anchor_pool?: AnchorTemplate[];
  anchor_pick_count?: number; // defaults to 1 if anchor_pool is set
};
