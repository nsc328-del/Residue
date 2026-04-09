#!/usr/bin/env node
// Residue CLI. The agent calls this from bash; nothing here knows anything
// about narration. Each command prints either JSON or a single status line.
//
// Conventions:
//   - Success: print to stdout, exit 0
//   - Failure: print to stderr, exit non-zero
//   - --state-dir <path> overrides the default ./run

import { runInit } from "./commands/init.js";
import { runState } from "./commands/state.js";
import { runStatus } from "./commands/status.js";
import { runApply } from "./commands/apply.js";
import { runRoom } from "./commands/room.js";
import { runDebugFacts } from "./commands/debug-facts.js";
import { runEndCheck } from "./commands/end-check.js";
import { runMemory } from "./commands/memory.js";
import { runSaves, runContinue, runDelete } from "./commands/saves.js";
import { DEFAULT_STATE_DIR } from "./state/load.js";

type ParsedArgs = {
  command: string;
  positional: string[];
  flags: Record<string, string | boolean>;
};

function parseArgs(argv: string[]): ParsedArgs {
  const [, , command = "", ...rest] = argv;
  const positional: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < rest.length; i++) {
    const tok = rest[i]!;
    if (tok.startsWith("--")) {
      const key = tok.slice(2);
      const next = rest[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        flags[key] = next;
        i += 1;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(tok);
    }
  }
  return { command, positional, flags };
}

function getStateDir(flags: Record<string, string | boolean>): string {
  const v = flags["state-dir"];
  return typeof v === "string" ? v : DEFAULT_STATE_DIR;
}

function hasExplicitStateDir(flags: Record<string, string | boolean>): boolean {
  return typeof flags["state-dir"] === "string";
}

function printHelp(): void {
  process.stdout.write(
    [
      "residue — agent-driven game engine",
      "",
      "Usage: residue <command> [args] [--state-dir <path>]",
      "",
      "Commands:",
      "  init [--seed N] [--story S] [--force]   Start a new run (auto-saved)",
      "    stories: residue, stolen_face, memory_shard, debt_walker, echo_child, tower_nerve",
      "  saves                       List all save slots",
      "  continue <name>             Switch to a different save",
      "  delete <name>               Delete a save slot",
      "  state                       Print full state.json",
      "  status                      One-line summary",
      "  room                        Print current room",
      "  apply '<diff json>'         Apply a diff",
      "  memory '<query>'            Search history",
      "  end-check                   Check terminal state",
      "  debug-facts                 Dump fact table",
      "",
    ].join("\n")
  );
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv);
  const stateDir = getStateDir(args.flags);

  switch (args.command) {
    case "":
    case "help":
    case "--help":
    case "-h":
      printHelp();
      return;

    case "init": {
      const seedFlag = args.flags["seed"];
      const seed = typeof seedFlag === "string" ? Number(seedFlag) : undefined;
      const force = args.flags["force"] === true;
      const storyFlag = args.flags["story"];
      const story = typeof storyFlag === "string" ? storyFlag : undefined;
      const useSaves = !hasExplicitStateDir(args.flags);
      const out = runInit({ stateDir, seed, force, story, useSaves });
      process.stdout.write(out + "\n");
      return;
    }

    case "saves": {
      process.stdout.write(runSaves() + "\n");
      return;
    }

    case "continue": {
      const name = args.positional[0] ?? "";
      process.stdout.write(runContinue(name) + "\n");
      return;
    }

    case "delete": {
      const name = args.positional[0] ?? "";
      process.stdout.write(runDelete(name) + "\n");
      return;
    }

    case "state": {
      process.stdout.write(runState(stateDir) + "\n");
      return;
    }

    case "status": {
      process.stdout.write(runStatus(stateDir) + "\n");
      return;
    }

    case "apply": {
      const diffJson = args.positional[0];
      if (!diffJson) {
        throw new Error("apply requires a diff JSON string as the first argument");
      }
      process.stdout.write(runApply({ stateDir, diffJson }) + "\n");
      return;
    }

    case "room": {
      process.stdout.write(runRoom(stateDir) + "\n");
      return;
    }

    case "debug-facts": {
      process.stdout.write(runDebugFacts(stateDir) + "\n");
      return;
    }

    case "end-check": {
      process.stdout.write(runEndCheck(stateDir) + "\n");
      return;
    }

    case "memory": {
      const query = args.positional[0] ?? "";
      process.stdout.write(runMemory(query, stateDir) + "\n");
      return;
    }

    default:
      process.stderr.write(`Unknown command: ${args.command}\n`);
      printHelp();
      process.exit(2);
  }
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(`error: ${msg}\n`);
  process.exit(1);
});
