import { buildInitialState } from "../engine/initial-state.js";
import { generateRoom } from "../engine/generator.js";
import { saveState, stateExists } from "../state/load.js";

export type InitArgs = {
  stateDir: string;
  seed?: number;
  force?: boolean;
  story?: string;
};

export function runInit(args: InitArgs): string {
  if (stateExists(args.stateDir) && !args.force) {
    throw new Error(
      `A run already exists at ${args.stateDir}. Pass --force to overwrite.`
    );
  }
  const state = buildInitialState({ seed: args.seed, story: args.story });
  state.current_room = generateRoom(state);
  saveState(state, args.stateDir);
  return JSON.stringify(
    {
      run_id: state.meta.run_id,
      seed: state.meta.seed,
      storyline: state.meta.storyline,
      floor: state.meta.floor,
      world_line: state.world_line.current,
      facts_loaded: state.facts.length,
      state_dir: args.stateDir,
    },
    null,
    2
  );
}
