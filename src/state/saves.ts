// Save-slot management.
//
// Layout:
//   saves/              ← all save slots live here
//     tower_nerve_a3f/  ← one slot = one run directory (state.json + history.jsonl)
//     residue_7b2/
//   run/                ← symlink → saves/<active slot>
//
// The symlink `run/` is what every other command reads via DEFAULT_STATE_DIR.
// `init` creates a new slot and points `run/` at it.
// `continue` switches `run/` to a different slot.

import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  unlinkSync,
} from "node:fs";
import { basename, join, resolve } from "node:path";

export const SAVES_DIR = "./saves";
export const RUN_LINK = "./run";

export type SaveInfo = {
  name: string;
  storyline: string;
  floor: number;
  turn: number;
  world_line: string;
  ended: boolean;
  active: boolean;
};

// ── Helpers ──

function ensureSavesDir(): void {
  mkdirSync(SAVES_DIR, { recursive: true });
}

/**
 * Generate a short, readable slot name: `<storyline>_<hex4>`
 */
export function generateSlotName(storyline: string): string {
  const hex = Math.floor(Math.random() * 0xffff)
    .toString(16)
    .padStart(4, "0");
  return `${storyline}_${hex}`;
}

/**
 * Resolve the save directory for a given slot name.
 */
export function slotDir(name: string): string {
  return join(SAVES_DIR, name);
}

/**
 * Get the currently active slot name (what `run/` points to), or null.
 */
export function activeSlotName(): string | null {
  try {
    const stat = lstatSync(RUN_LINK);
    if (stat.isSymbolicLink()) {
      const target = readlinkSync(RUN_LINK);
      return basename(target);
    }
    // run/ exists but is a real directory (legacy). Not a managed slot.
    return null;
  } catch {
    return null;
  }
}

/**
 * Point `run/` at a save slot via symlink.
 * If `run/` already exists as a symlink, it's replaced.
 * If `run/` exists as a real directory, it's left alone and an error is thrown.
 */
export function activateSlot(name: string): void {
  const target = slotDir(name);
  if (!existsSync(target)) {
    throw new Error(`Save slot "${name}" does not exist.`);
  }

  if (existsSync(RUN_LINK)) {
    const stat = lstatSync(RUN_LINK);
    if (stat.isSymbolicLink()) {
      unlinkSync(RUN_LINK);
    } else {
      throw new Error(
        `"${RUN_LINK}" is a real directory, not a symlink. ` +
          `Move or delete it manually before using the save system.`
      );
    }
  }

  // Symlink uses resolved absolute path so it works regardless of cwd.
  symlinkSync(resolve(target), RUN_LINK);
}

/**
 * Create a new save slot directory and return its name.
 */
export function createSlot(storyline: string): string {
  ensureSavesDir();
  const name = generateSlotName(storyline);
  mkdirSync(slotDir(name), { recursive: true });
  return name;
}

/**
 * List all save slots with summary info.
 */
export function listSlots(): SaveInfo[] {
  ensureSavesDir();
  const current = activeSlotName();
  const entries = readdirSync(SAVES_DIR, { withFileTypes: true });
  const results: SaveInfo[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    const stateFile = join(SAVES_DIR, name, "state.json");
    if (!existsSync(stateFile)) continue;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = JSON.parse(readFileSync(stateFile, "utf8")) as any;
      // Handle both old (debts/debt_pressure) and new (costs/cost_pressure) schema.
      results.push({
        name,
        storyline: raw.meta?.storyline ?? "unknown",
        floor: raw.meta?.floor ?? 0,
        turn: raw.meta?.turn ?? 0,
        world_line: raw.world_line?.current ?? "unknown",
        ended: !!raw.meta?.ended,
        active: name === current,
      });
    } catch {
      // Corrupted state.json — skip.
    }
  }

  // Sort: active first, then by most recent turn descending.
  results.sort((a, b) => {
    if (a.active !== b.active) return a.active ? -1 : 1;
    return b.turn - a.turn;
  });

  return results;
}

/**
 * Delete a save slot.
 */
export function deleteSlot(name: string): void {
  const dir = slotDir(name);
  if (!existsSync(dir)) {
    throw new Error(`Save slot "${name}" does not exist.`);
  }

  // If this is the active slot, remove the symlink first.
  if (activeSlotName() === name) {
    unlinkSync(RUN_LINK);
  }

  rmSync(dir, { recursive: true, force: true });
}
