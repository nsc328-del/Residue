import { loadState } from "../state/load.js";

export function runRoom(stateDir: string): string {
  const state = loadState(stateDir);
  return JSON.stringify(state.current_room, null, 2);
}
