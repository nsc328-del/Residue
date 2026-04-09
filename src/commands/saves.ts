import {
  listSlots,
  activateSlot,
  deleteSlot,
  activeSlotName,
} from "../state/saves.js";

/**
 * `residue saves` — list all save slots.
 */
export function runSaves(): string {
  const slots = listSlots();
  if (slots.length === 0) {
    return "No saves found. Run `residue init` to start a new game.";
  }

  const lines: string[] = ["SAVES:"];
  for (const s of slots) {
    const marker = s.active ? " *" : "  ";
    const status = s.ended ? "ended" : `floor=${s.floor}/15 turn=${s.turn}`;
    lines.push(
      `${marker} ${s.name}  ${s.storyline}  ${s.world_line}  ${status}`
    );
  }
  lines.push("");
  lines.push("  * = active (linked to run/)");
  return lines.join("\n");
}

/**
 * `residue continue <name>` — switch active save.
 */
export function runContinue(name: string): string {
  if (!name) {
    throw new Error(
      "Usage: residue continue <save-name>\nRun `residue saves` to see available saves."
    );
  }
  activateSlot(name);
  return `Switched to save "${name}". run/ now points to saves/${name}/`;
}

/**
 * `residue delete <name>` — delete a save slot.
 */
export function runDelete(name: string): string {
  if (!name) {
    throw new Error(
      "Usage: residue delete <save-name>\nRun `residue saves` to see available saves."
    );
  }

  // Safety: don't silently delete the active save.
  const current = activeSlotName();
  if (current === name) {
    // Warn but allow — deleteSlot handles symlink cleanup.
  }

  deleteSlot(name);
  let msg = `Deleted save "${name}".`;
  if (current === name) {
    msg += " The active save has been unlinked. Run `residue init` or `residue continue <name>` to set a new one.";
  }
  return msg;
}
