import { loadState } from "../state/load.js";

export function runDebugFacts(stateDir: string): string {
  const state = loadState(stateDir);
  const lines: string[] = [];
  lines.push("FACTS:");
  for (const f of state.facts) {
    const status = f.active ? "[active]" : "[inactive]";
    lines.push(
      `  ${status} ${f.id} (${f.scope}) ${f.text}  tags=[${f.tags.join(",")}]`
    );
  }
  lines.push("");
  lines.push("COSTS:");
  if (state.costs.length === 0) {
    lines.push("  (none)");
  } else {
    for (const c of state.costs) {
      const status = c.settled ? "[settled]" : "[open]";
      lines.push(
        `  ${status} ${c.id} (${c.severity}) ${c.text}  triggers=[${c.triggers.join(",")}]`
      );
    }
  }
  return lines.join("\n");
}
