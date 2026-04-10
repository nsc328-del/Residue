// end-check: multi-signal terminal-state probe.
//
// The engine can auto-end when readiness >= 90 (set in apply-diff). The agent
// can also call `end-check --end` to end the run when readiness is 60-89.
// Without --end, end-check is read-only: it returns the current readiness
// score and a natural-language hint.
//
// Readiness formula (computed in cost.ts endReadiness):
//   floor signal   — ramps to 40 at floor 15, caps at 60
//   resolution     — ratio of settled to total costs (max 20)
//   stagnation     — consecutive low-pressure turns (max 20)

import { loadState, saveState } from "../state/load.js";
import { endReadiness } from "../engine/cost.js";

function readinessHint(readiness: number): string | null {
  if (readiness < 40) return null;
  if (readiness < 60) return "故事在积累。";
  if (readiness < 80) return "你可以开始收束了。下一个节点层适合作为结尾。";
  return "这一局该结束了。";
}

export function runEndCheck(stateDir: string, forceEnd = false): string {
  const state = loadState(stateDir);

  // Already ended — just echo the status.
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

  const readiness = endReadiness(state);

  // Agent requested --end
  if (forceEnd) {
    if (readiness < 60) {
      return JSON.stringify(
        {
          ended: false,
          floor: state.meta.floor,
          readiness,
          hint: readinessHint(readiness),
          error: "readiness too low to end (need >= 60)",
        },
        null,
        2
      );
    }
    state.meta.ended = { reason: "agent_ended", floor: state.meta.floor };
    saveState(state, stateDir);
    return JSON.stringify(
      {
        ended: true,
        reason: "agent_ended",
        floor: state.meta.floor,
        readiness,
        active_facts: state.facts.filter((f) => f.active).length,
        open_costs: state.costs.filter((c) => !c.settled).length,
        world_line: state.world_line.current,
        forks: state.world_line.forks.length,
      },
      null,
      2
    );
  }

  // Read-only probe
  return JSON.stringify(
    {
      ended: false,
      floor: state.meta.floor,
      readiness,
      hint: readinessHint(readiness),
      active_facts: state.facts.filter((f) => f.active).length,
      open_costs: state.costs.filter((c) => !c.settled).length,
    },
    null,
    2
  );
}
