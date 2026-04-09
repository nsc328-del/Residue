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

  // Tag-based scoring against the current fact / debt landscape:
  requires: string[]; // template only eligible if every tag is present in active facts/debts
  prefers: string[]; // each present tag adds a positive bump
  forbids: string[]; // each present tag disqualifies the template
  // Required debt triggers — if any of these strings appear in any open
  // debt's `triggers` array, this template gets a strong score boost. This is
  // how repay rooms get auto-selected when their target debt is open.
  responds_to_cost_triggers?: string[];

  // Whether this template is eligible only when the floor is exactly the
  // first number of floor_range AND the floor is one of the locked node
  // floors (5, 10, 15). Used to enforce that 5/10/15 always pick a node.
  is_node?: boolean;

  // Minimum debt_pressure required for this template to be eligible.
  // Omit or set to 0 for always-eligible. High values gate "chaos" rooms
  // that only appear when the player has been reckless.
  pressure_min?: number;

  // The structural shape the agent will narrate. Slots like {scanner_name}
  // are filled by the generator from active facts.
  obstacle: string;
  anchors: AnchorTemplate[];
  exits: ExitTemplate[];
};
