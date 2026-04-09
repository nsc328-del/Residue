// memory <query>: search the run's history.jsonl for entries that match the
// query, and return them. The agent calls this when the player asks "what
// just happened?" or "do you remember when..." — it then narrates from the
// raw entries in world voice.
//
// Search is intentionally cheap (substring match across the JSON blob). The
// language model on the other end is the smart part.

import { searchHistory } from "../state/history.js";

export function runMemory(query: string, stateDir: string): string {
  const entries = searchHistory(query, stateDir);
  return JSON.stringify(
    {
      query,
      count: entries.length,
      entries,
    },
    null,
    2
  );
}
