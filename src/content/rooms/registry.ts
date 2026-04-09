// Template registry. The generator imports from here and gets one flat list.
// Phase 3 ships dummy templates so the loop can run; phases 5-7 replace them.

import type { RoomTemplate } from "./types.js";
import { ORIGINAL_FLOOR_1_4_TEMPLATES } from "./original/floor_1_4.js";
import { STORYLINE_FLOOR_1_TEMPLATES } from "./original/floor_1_storylines.js";
import { ORIGINAL_FLOOR_5_NODE } from "./original/floor_5_node.js";
import { ORIGINAL_FLOOR_6_9_TEMPLATES } from "./original/floor_6_9.js";
import { ORIGINAL_FLOOR_10_NODES } from "./original/floor_10_node.js";
import { ORIGINAL_FLOOR_11_15_TEMPLATES } from "./original/floor_11_15.js";
import { UNOWNED_REGION_FLOOR_6_10_TEMPLATES } from "./unowned_region/floor_6_10.js";
import { UNOWNED_REGION_FLOOR_11_15_TEMPLATES } from "./unowned_region/floor_11_15.js";
import { ORIGINAL_CHAOS_TEMPLATES } from "./original/floor_chaos.js";
import { UNOWNED_CHAOS_TEMPLATES } from "./unowned_region/floor_chaos.js";

export function loadAllRoomTemplates(): RoomTemplate[] {
  return [
    // ----- Original world line -----
    ...ORIGINAL_FLOOR_1_4_TEMPLATES,
    ...STORYLINE_FLOOR_1_TEMPLATES,
    ORIGINAL_FLOOR_5_NODE,
    ...ORIGINAL_FLOOR_6_9_TEMPLATES,
    ...ORIGINAL_FLOOR_10_NODES,
    ...ORIGINAL_FLOOR_11_15_TEMPLATES,

    // ----- Chaos rooms (pressure-gated) -----
    ...ORIGINAL_CHAOS_TEMPLATES,
    ...UNOWNED_CHAOS_TEMPLATES,

    // ----- Unowned region world line -----
    ...UNOWNED_REGION_FLOOR_6_10_TEMPLATES,
    ...UNOWNED_REGION_FLOOR_11_15_TEMPLATES,
  ];
}
