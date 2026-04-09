import { applyDiff } from "../engine/apply-diff.js";
import { generateRoom } from "../engine/generator.js";
import { loadState, saveState } from "../state/load.js";
import { appendHistory } from "../state/history.js";
import type { Diff, HistoryEntry } from "../state/types.js";

export type ApplyArgs = {
  stateDir: string;
  diffJson: string;
};

export function runApply(args: ApplyArgs): string {
  let diff: Diff;
  try {
    diff = JSON.parse(args.diffJson) as Diff;
  } catch (err) {
    throw new Error(
      `diff is not valid JSON: ${err instanceof Error ? err.message : String(err)}`
    );
  }
  if (!diff || typeof diff !== "object" || !Array.isArray(diff.operations)) {
    throw new Error("diff must have shape { player_sentence, rationale, operations[] }");
  }

  const state = loadState(args.stateDir);
  const result = applyDiff(state, diff);

  if (!result.ok) {
    const lines = result.errors.map((e) => `  - [${e.code}] ${e.message}`);
    throw new Error("diff rejected:\n" + lines.join("\n"));
  }

  const next = result.state;
  // Regenerate the room based on the new fact set / costs / floor / theme.
  next.current_room = generateRoom(next);
  saveState(next, args.stateDir);

  const entry: HistoryEntry = {
    turn: next.meta.turn,
    at: new Date().toISOString(),
    player_sentence: diff.player_sentence,
    rationale: diff.rationale,
    operations: diff.operations,
    resulting_floor: next.meta.floor,
    resulting_world_line: next.world_line.current,
    resulting_room_id: next.current_room.id,
    cost_ids_after: next.costs.filter((c) => !c.settled).map((c) => c.id),
  };
  appendHistory(entry, args.stateDir);

  return JSON.stringify(
    {
      ok: true,
      turn: next.meta.turn,
      floor: next.meta.floor,
      world_line: next.world_line.current,
      cost_pressure: next.partner_state.cost_pressure,
      open_costs: next.costs.filter((c) => !c.settled).length,
      summary: next.partner_state.last_diff_summary,
    },
    null,
    2
  );
}
