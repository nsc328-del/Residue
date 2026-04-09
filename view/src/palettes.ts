import type { ThemeId, StorylineId } from "./types.js";

export type Palette = {
  bg: number;        // background
  primary: number;   // main accent
  accent: number;    // highlight / emphasis
  dim: number;       // passed floors, settled costs
  particle: number;  // default particle color
  danger: number;    // high-pressure tint
};

// ── World-line palettes ──

const ORIGINAL: Palette = {
  bg: 0x0a0e1a,       // deep blue-black
  primary: 0x4a7ccc,   // cold blue
  accent: 0xb8d4ff,    // white-blue
  dim: 0x1a2233,       // dark navy
  particle: 0x3a5a8a,  // muted blue
  danger: 0xcc4444,    // red warning
};

const UNOWNED_REGION: Palette = {
  bg: 0x12081a,        // deep purple-black
  primary: 0x9a6ec7,   // off-purple
  accent: 0xd4a844,    // wrong warm yellow
  dim: 0x1a1024,       // dark purple
  particle: 0x7a5a9a,  // muted purple
  danger: 0xd46644,    // amber-red
};

export const THEME_PALETTES: Record<ThemeId, Palette> = {
  original: ORIGINAL,
  unowned_region: UNOWNED_REGION,
};

// ── Storyline color overrides ──
// Each storyline tints the base palette slightly. These are partial overrides
// blended on top of the world-line palette.

export type StorylineVisualHint = {
  accentOverride?: number;   // replace accent color
  particleOverride?: number; // replace particle color
  bgTint?: number;           // additively tint the background
};

export const STORYLINE_HINTS: Record<StorylineId, StorylineVisualHint> = {
  residue: {
    // Dissolution: sickly green tint
    particleOverride: 0x44aa66,
    bgTint: 0x040a04,
  },
  stolen_face: {
    // Melting identity: flesh/pink accent
    accentOverride: 0xdd8899,
    particleOverride: 0xaa6677,
  },
  memory_shard: {
    // Fragmented memory: cyan flicker
    accentOverride: 0x66dddd,
    particleOverride: 0x44aaaa,
  },
  debt_walker: {
    // Invisible weight: amber/gold
    accentOverride: 0xddaa44,
    particleOverride: 0xaa8833,
  },
  echo_child: {
    // Echo/ghost: pale white-blue
    accentOverride: 0xccddff,
    particleOverride: 0x8899bb,
  },
  tower_nerve: {
    // Severed signal: electric green
    accentOverride: 0x66ff88,
    particleOverride: 0x44cc66,
  },
};

/**
 * Resolve the final palette for the current world-line + storyline combination.
 */
export function resolvePalette(
  theme: string,
  storyline?: string
): Palette {
  const themeId = (theme === "unowned_region" ? "unowned_region" : "original") as ThemeId;
  const base = { ...THEME_PALETTES[themeId] };

  if (storyline) {
    const hint = STORYLINE_HINTS[storyline as StorylineId];
    if (hint) {
      if (hint.accentOverride !== undefined) base.accent = hint.accentOverride;
      if (hint.particleOverride !== undefined) base.particle = hint.particleOverride;
      if (hint.bgTint !== undefined) {
        // Simple additive tint: add each channel clamped to 0xFF.
        base.bg = addColors(base.bg, hint.bgTint);
      }
    }
  }

  return base;
}

function addColors(a: number, b: number): number {
  const r = Math.min(0xff, ((a >> 16) & 0xff) + ((b >> 16) & 0xff));
  const g = Math.min(0xff, ((a >> 8) & 0xff) + ((b >> 8) & 0xff));
  const bl = Math.min(0xff, (a & 0xff) + (b & 0xff));
  return (r << 16) | (g << 8) | bl;
}
