// Build a fresh State for a new run. The CONTENT this references (root facts,
// initial facts, room templates, themes) lives under src/content/. This file
// is just the assembler — it never knows what a specific fact says.

import type { Fact, State, Room, AnchorTemplate, ExitTemplate } from "../state/types.js";
import { newRunId, resetIdCounters } from "../utils/id.js";
import { loadRootFacts } from "../content/facts/root.js";
import { ALL_STORYLINES, getStoryline, randomStoryline } from "../content/storylines.js";

export type InitOptions = {
  seed?: number;
  story?: string;
};

const PLACEHOLDER_ROOM: Room = {
  id: "r_seed",
  template_id: "tpl_seed",
  theme: "original",
  floor: 1,
  anchors: [] as AnchorTemplate[],
  obstacle: "(awaiting first generation)",
  exits: [] as ExitTemplate[],
  active_fact_ids: [],
  generated_from: [],
};

export function buildInitialState(opts: InitOptions = {}): State {
  resetIdCounters();
  const seed = opts.seed ?? Math.floor(Math.random() * 2 ** 31);
  const now = new Date().toISOString();

  // Pick storyline
  const storyline = opts.story
    ? getStoryline(opts.story) ?? randomStoryline(seed)
    : randomStoryline(seed);

  const roots: Fact[] = loadRootFacts();
  const facts: Fact[] = [...roots, ...storyline.facts];

  return {
    meta: {
      run_id: newRunId(),
      seed,
      floor: 1,
      turn: 0,
      started_at: now,
      ended: false,
      perma_rewrite_token_remaining: 1,
      storyline: storyline.id,
    },
    world_line: {
      current: "original",
      forks: [],
    },
    facts,
    costs: [],
    current_room: PLACEHOLDER_ROOM,
    partner_state: {
      cost_pressure: 0,
      last_diff_summary: null,
    },
  };
}
