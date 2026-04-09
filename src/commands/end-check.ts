// end-check: explicit terminal-state probe.
//
// The engine never auto-ends. The agent calls end-check after narrating the
// top room (or whenever it suspects the run should end), and the engine
// answers:
//   - { ended: false }              — game continues
//   - { ended: true, reason }       — and persists meta.ended on disk
//
// Termination rule: floor === 15. The top room exists and was generated; the
// agent's narration of it is the closing beat. Once end-check confirms ended,
// further apply commands are rejected (the cost validator already checks this).

import { loadState, saveState } from "../state/load.js";

export function runEndCheck(stateDir: string): string {
  const state = loadState(stateDir);
  if (state.meta.ended) {
    return JSON.stringify(
      {
        ended: true,
        reason: state.meta.ended.reason,
        floor: state.meta.ended.floor,
      },
      null,
      2
    );
  }
  if (state.meta.floor >= 15) {
    state.meta.ended = { reason: "reached_top", floor: state.meta.floor };
    saveState(state, stateDir);
    return JSON.stringify(
      {
        ended: true,
        reason: "reached_top",
        floor: state.meta.floor,
        // Hand the agent the raw signals it needs for closing narration.
        active_facts: state.facts.filter((f) => f.active).length,
        open_costs: state.costs.filter((c) => !c.settled).length,
        world_line: state.world_line.current,
        forks: state.world_line.forks.length,
      },
      null,
      2
    );
  }
  return JSON.stringify({ ended: false, floor: state.meta.floor }, null, 2);
}
