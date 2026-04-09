// state.json read / write. Single source of truth on disk.

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import type { State } from "./types.js";

export const DEFAULT_STATE_DIR = "./run";
export const STATE_FILENAME = "state.json";

export function statePath(stateDir: string): string {
  return join(stateDir, STATE_FILENAME);
}

/**
 * Migrate a raw parsed state from the old debt-based schema to the new
 * cost-based schema, if needed. This is a best-effort in-place migration
 * so existing run/ directories keep working after the rename.
 */
function migrateState(raw: Record<string, unknown>): State {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = raw as any;

  // debts -> costs
  if (s.debts !== undefined && s.costs === undefined) {
    s.costs = s.debts;
    delete s.debts;
  }

  // partner_state.debt_pressure -> partner_state.cost_pressure
  if (s.partner_state) {
    if (
      s.partner_state.debt_pressure !== undefined &&
      s.partner_state.cost_pressure === undefined
    ) {
      s.partner_state.cost_pressure = s.partner_state.debt_pressure;
      delete s.partner_state.debt_pressure;
    }
  }

  return s as State;
}

export function loadState(stateDir: string = DEFAULT_STATE_DIR): State {
  const p = statePath(stateDir);
  if (!existsSync(p)) {
    throw new Error(
      `No state at ${p}. Run \`residue init\` first, or pass --state-dir to point at an existing run.`
    );
  }
  const raw = readFileSync(p, "utf8");
  return migrateState(JSON.parse(raw));
}

export function saveState(state: State, stateDir: string = DEFAULT_STATE_DIR): void {
  const p = statePath(stateDir);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, JSON.stringify(state, null, 2), "utf8");
}

export function stateExists(stateDir: string = DEFAULT_STATE_DIR): boolean {
  return existsSync(statePath(stateDir));
}
