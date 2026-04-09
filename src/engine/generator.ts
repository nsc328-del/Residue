// Pure function: state → next Room.
//
// The generator is the bridge between fact set and what the player sees. It
// has zero language model in it. It picks a template by tag-scoring against
// active facts and open costs, then fills slots and stamps an id.

import type {
  AnchorTemplate,
  Fact,
  ExitTemplate,
  Room,
  State,
  Cost,
} from "../state/types.js";
import type { RoomTemplate } from "../content/rooms/types.js";
import { loadAllRoomTemplates } from "../content/rooms/registry.js";
import { mulberry32, pickIndex } from "../utils/rng.js";
import { nextRoomId } from "../utils/id.js";

const NODE_FLOORS = new Set([5, 10, 15]);

export function generateRoom(state: State): Room {
  const templates = loadAllRoomTemplates();
  const activeFactTags = collectFactTags(state.facts);
  const openCostTriggers = collectOpenCostTriggers(state.costs);

  const eligible = templates.filter((tpl) =>
    isEligible(tpl, state, activeFactTags, openCostTriggers)
  );

  if (eligible.length === 0) {
    return fallbackRoom(state);
  }

  const pressure = state.partner_state.cost_pressure;
  const scored = eligible.map((tpl) => ({
    tpl,
    score: scoreTemplate(tpl, activeFactTags, openCostTriggers, pressure),
  }));

  // Highest score wins. Ties broken deterministically by (seed, turn).
  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter((s) => s.score === scored[0]!.score);
  const rand = mulberry32(state.meta.seed + state.meta.turn);
  const chosen = top[pickIndex(rand, top.length)]!.tpl;

  return instantiate(chosen, state);
}

function collectFactTags(facts: Fact[]): Set<string> {
  const out = new Set<string>();
  for (const f of facts) {
    if (!f.active) continue;
    for (const t of f.tags) out.add(t);
  }
  return out;
}

function collectOpenCostTriggers(costs: Cost[]): Set<string> {
  const out = new Set<string>();
  for (const c of costs) {
    if (c.settled) continue;
    for (const t of c.triggers) out.add(t);
  }
  return out;
}

function isEligible(
  tpl: RoomTemplate,
  state: State,
  factTags: Set<string>,
  _costTriggers: Set<string>
): boolean {
  if (tpl.theme !== state.world_line.current) return false;
  if (state.meta.floor < tpl.floor_range[0] || state.meta.floor > tpl.floor_range[1]) {
    return false;
  }
  // Pressure gate: chaos rooms only unlock when cost_pressure is high enough
  if (tpl.pressure_min && state.partner_state.cost_pressure < tpl.pressure_min) {
    return false;
  }
  // Hard requires
  for (const r of tpl.requires) {
    if (!factTags.has(r)) return false;
  }
  // Hard forbids
  for (const f of tpl.forbids) {
    if (factTags.has(f)) return false;
  }
  // Lock node floors to is_node templates and vice versa
  const isNodeFloor = NODE_FLOORS.has(state.meta.floor);
  if (isNodeFloor && !tpl.is_node) return false;
  if (!isNodeFloor && tpl.is_node) return false;
  return true;
}

function scoreTemplate(
  tpl: RoomTemplate,
  factTags: Set<string>,
  costTriggers: Set<string>,
  pressure: number
): number {
  let score = 0;
  for (const p of tpl.prefers) {
    if (factTags.has(p)) score += 10;
  }
  // Cost-trigger matches are heavy — open costs should pull their repay
  // rooms to the front of the line.
  for (const t of tpl.responds_to_cost_triggers ?? []) {
    if (costTriggers.has(t)) score += 50;
  }
  // Node templates get a baseline bump on their lock floor so they always
  // beat any non-node fallback that slipped through.
  if (tpl.is_node) score += 5;
  // Chaos bonus: pressure-gated templates get a score boost proportional to
  // how far the player has pushed beyond the threshold. The world literally
  // warps toward insanity when costs pile up.
  if (tpl.pressure_min && pressure >= tpl.pressure_min) {
    score += Math.floor((pressure - tpl.pressure_min) / 5) * 10 + 20;
  }
  return score;
}

function instantiate(tpl: RoomTemplate, state: State): Room {
  const activeFactIds = state.facts.filter((f) => f.active).map((f) => f.id);
  return {
    id: nextRoomId(),
    template_id: tpl.id,
    theme: tpl.theme,
    floor: state.meta.floor,
    anchors: tpl.anchors.map((a) => fillAnchorSlots(a, state)),
    obstacle: fillSlots(tpl.obstacle, state),
    exits: tpl.exits.map((e) => ({ ...e } satisfies ExitTemplate)),
    active_fact_ids: activeFactIds,
    generated_from: [tpl.id],
  };
}

// Phase 3: slots aren't actually used yet — return the strings as-is. The
// content phases will introduce real slot vocabularies; this hook stays so
// they don't have to touch the generator core.
function fillSlots(text: string, _state: State): string {
  return text;
}

function fillAnchorSlots(a: AnchorTemplate, state: State): AnchorTemplate {
  return {
    id: a.id,
    name: fillSlots(a.name, state),
    tags: [...a.tags],
    hint: fillSlots(a.hint, state),
  };
}

function fallbackRoom(state: State): Room {
  return {
    id: nextRoomId(),
    template_id: "tpl_fallback",
    theme: state.world_line.current,
    floor: state.meta.floor,
    anchors: [],
    obstacle:
      "（此处生成器找不到匹配的房间模板。这是内容空缺。请检查 fact 集与模板池。）",
    exits: [{ id: "e_force_ascend", kind: "ascend", hint: "强行往上一层" }],
    active_fact_ids: state.facts.filter((f) => f.active).map((f) => f.id),
    generated_from: [],
  };
}
