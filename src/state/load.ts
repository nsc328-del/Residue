// state.json read / write. Single source of truth on disk.

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import type { State } from "./types.js";

export const DEFAULT_STATE_DIR = "./run";
export const STATE_FILENAME = "state.json";

export function statePath(stateDir: string): string {
  return join(stateDir, STATE_FILENAME);
}

export function loadState(stateDir: string = DEFAULT_STATE_DIR): State {
  const p = statePath(stateDir);
  if (!existsSync(p)) {
    throw new Error(
      `No state at ${p}. Run \`residue init\` first, or pass --state-dir to point at an existing run.`
    );
  }
  const raw = readFileSync(p, "utf8");
  return JSON.parse(raw) as State;
}

export function saveState(state: State, stateDir: string = DEFAULT_STATE_DIR): void {
  const p = statePath(stateDir);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(state, null, 2), "utf8");
}

export function stateExists(stateDir: string = DEFAULT_STATE_DIR): boolean {
  return existsSync(statePath(stateDir));
}
