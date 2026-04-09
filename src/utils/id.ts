// Tiny id helpers. Deterministic when seeded counters are used; uuid only for run_id.

import { randomUUID } from "node:crypto";

export function newRunId(): string {
  return randomUUID();
}

let factCounter = 0;
let debtCounter = 0;
let roomCounter = 0;

export function resetIdCounters(): void {
  factCounter = 0;
  debtCounter = 0;
  roomCounter = 0;
}

export function nextFactId(prefix = "f"): string {
  factCounter += 1;
  return `${prefix}_${factCounter.toString(36)}`;
}

export function nextDebtId(prefix = "d"): string {
  debtCounter += 1;
  return `${prefix}_${debtCounter.toString(36)}`;
}

export function nextRoomId(prefix = "r"): string {
  roomCounter += 1;
  return `${prefix}_${roomCounter.toString(36)}`;
}
