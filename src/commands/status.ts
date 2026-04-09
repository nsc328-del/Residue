import { loadState } from "../state/load.js";

export function runStatus(stateDir: string): string {
  const s = loadState(stateDir);
  const activeFacts = s.facts.filter((f) => f.active).length;
  const openCosts = s.costs.filter((c) => !c.settled).length;
  const ended = s.meta.ended ? `ended:${s.meta.ended.reason}` : "ongoing";
  return [
    `floor=${s.meta.floor}/15`,
    `turn=${s.meta.turn}`,
    `world_line=${s.world_line.current}`,
    `facts_active=${activeFacts}`,
    `costs_open=${openCosts}`,
    `pressure=${s.partner_state.cost_pressure}`,
    `perma_token=${s.meta.perma_rewrite_token_remaining}`,
    ended,
  ].join("  ");
}
