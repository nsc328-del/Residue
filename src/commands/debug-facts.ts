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
  lines.push("DEBTS:");
  if (state.debts.length === 0) {
    lines.push("  (none)");
  } else {
    for (const d of state.debts) {
      const status = d.settled ? "[settled]" : "[open]";
      lines.push(
        `  ${status} ${d.id} (${d.severity}) ${d.text}  triggers=[${d.triggers.join(",")}]`
      );
    }
  }
  return lines.join("\n");
}
