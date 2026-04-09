// history.jsonl: append-only log of every applied diff. Used by the memory
// command to let the agent answer "what just happened?" questions in world voice.

import { appendFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { HistoryEntry } from "./types.js";

export const HISTORY_FILENAME = "history.jsonl";

export function historyPath(stateDir: string): string {
  return join(stateDir, HISTORY_FILENAME);
}

export function appendHistory(entry: HistoryEntry, stateDir: string): void {
  const p = historyPath(stateDir);
  mkdirSync(dirname(p), { recursive: true });
  appendFileSync(p, JSON.stringify(entry) + "\n", "utf8");
}

export function readAllHistory(stateDir: string): HistoryEntry[] {
  const p = historyPath(stateDir);
  if (!existsSync(p)) return [];
  const raw = readFileSync(p, "utf8");
  return raw
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as HistoryEntry);
}

// Cheap keyword search. The agent's job is to use the matched entries to
// reconstruct narrative — we don't try to be clever here.
export function searchHistory(query: string, stateDir: string): HistoryEntry[] {
  const all = readAllHistory(stateDir);
  if (!query.trim()) return all;
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 0);
  return all.filter((entry) => {
    const blob = JSON.stringify(entry).toLowerCase();
    return tokens.some((t) => blob.includes(t));
  });
}
