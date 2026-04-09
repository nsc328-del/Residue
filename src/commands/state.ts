import { loadState } from "../state/load.js";

export function runState(stateDir: string): string {
  const state = loadState(stateDir);
  return JSON.stringify(state, null, 2);
}
