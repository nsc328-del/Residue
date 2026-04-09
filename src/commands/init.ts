import { buildInitialState } from "../engine/initial-state.js";
import { generateRoom } from "../engine/generator.js";
import { saveState, stateExists } from "../state/load.js";
import { createSlot, activateSlot, slotDir } from "../state/saves.js";

export type InitArgs = {
  stateDir: string;
  seed?: number;
  force?: boolean;
  story?: string;
  // When true, use the saves system (default). When --state-dir is explicitly
  // passed, this is set to false to preserve backward compatibility.
  useSaves: boolean;
};

export function runInit(args: InitArgs): string {
  let targetDir = args.stateDir;
  let slotName: string | undefined;

  if (args.useSaves) {
    // Create a new save slot and point run/ at it.
    const storyline = args.story ?? "random";
    slotName = createSlot(storyline);
    targetDir = slotDir(slotName);
  } else {
    // Legacy mode: write directly to --state-dir.
    if (stateExists(targetDir) && !args.force) {
      throw new Error(
        `A run already exists at ${targetDir}. Pass --force to overwrite.`
      );
    }
  }

  const state = buildInitialState({ seed: args.seed, story: args.story });
  state.current_room = generateRoom(state);
  saveState(state, targetDir);

  if (args.useSaves && slotName) {
    activateSlot(slotName);
  }

  return JSON.stringify(
    {
      run_id: state.meta.run_id,
      seed: state.meta.seed,
      storyline: state.meta.storyline,
      floor: state.meta.floor,
      world_line: state.world_line.current,
      facts_loaded: state.facts.length,
      save_name: slotName ?? null,
      state_dir: targetDir,
    },
    null,
    2
  );
}
