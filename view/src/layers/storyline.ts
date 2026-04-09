import { Container, Graphics } from "pixi.js";
import type { StorylineId } from "../types.js";
import type { Palette } from "../palettes.js";

const W = 320;
const H = 240;

/**
 * Per-storyline persistent visual motif.
 * Each storyline has a unique ambient element that runs from start to finish.
 */
export class StorylineLayer {
  public container = new Container();
  private gfx = new Graphics();
  private storyline: StorylineId | null = null;
  private palette: Palette | null = null;
  private floor = 1;
  private turn = 0;
  private pressure = 0;
  private frame = 0;

  // ── residue: edge erosion state ──
  private erodedPixels: Array<{ x: number; y: number }> = [];

  // ── stolen_face: mask degradation ──
  private maskGrid: number[][] = [];
  private maskInited = false;

  // ── memory_shard: flash timer ──
  private flashTimer = 0;
  private flashFloor = 0;

  // ── echo_child: ghost position ──
  private ghostFloor = 0;
  private ghostTimer = 0;

  // ── tower_nerve: signal wave ──
  private signalPhase = 0;

  constructor() {
    this.container.addChild(this.gfx);
  }

  setStoryline(storyline: string | undefined): void {
    if (!storyline) return;
    this.storyline = storyline as StorylineId;
  }

  setPalette(palette: Palette): void {
    this.palette = palette;
  }

  setState(floor: number, turn: number, pressure: number): void {
    // Track floor changes for echo_child ghost delay.
    if (floor !== this.floor) {
      this.ghostFloor = this.floor;
      this.ghostTimer = 30; // ~0.5s at 60fps
    }
    this.floor = floor;
    this.turn = turn;
    this.pressure = pressure;
  }

  update(dt: number): void {
    this.frame += dt;
    this.gfx.clear();
    if (!this.storyline || !this.palette) return;

    switch (this.storyline) {
      case "residue":
        this.drawResidue(dt);
        break;
      case "stolen_face":
        this.drawStolenFace(dt);
        break;
      case "memory_shard":
        this.drawMemoryShard(dt);
        break;
      case "debt_walker":
        this.drawDebtWalker(dt);
        break;
      case "echo_child":
        this.drawEchoChild(dt);
        break;
      case "tower_nerve":
        this.drawTowerNerve(dt);
        break;
    }
  }

  // ── residue: edge pixels erode over time ──
  private drawResidue(_dt: number): void {
    const p = this.palette!;

    // Every few frames, erode a few more edge pixels. More erosion at higher floors.
    if (this.frame % 12 < 1) {
      const count = Math.max(1, Math.floor(this.floor / 3));
      for (let i = 0; i < count; i++) {
        // Pick random edge pixels.
        const side = Math.floor(Math.random() * 4);
        let x: number, y: number;
        if (side === 0) { x = Math.floor(Math.random() * 8); y = Math.floor(Math.random() * H); }
        else if (side === 1) { x = W - Math.floor(Math.random() * 8); y = Math.floor(Math.random() * H); }
        else if (side === 2) { x = Math.floor(Math.random() * W); y = Math.floor(Math.random() * 8); }
        else { x = Math.floor(Math.random() * W); y = H - Math.floor(Math.random() * 8); }
        this.erodedPixels.push({ x, y });
      }
      // Cap total eroded pixels.
      if (this.erodedPixels.length > 400) {
        this.erodedPixels = this.erodedPixels.slice(-400);
      }
    }

    // Draw eroded pixels as dark spots.
    for (const px of this.erodedPixels) {
      this.gfx.rect(px.x, px.y, 1, 1);
      this.gfx.fill({ color: 0x000000, alpha: 0.6 });
    }

    // A few bright "dissolving" particles near recent erosion.
    if (this.erodedPixels.length > 0 && this.frame % 4 < 1) {
      const recent = this.erodedPixels[this.erodedPixels.length - 1]!;
      this.gfx.rect(
        recent.x + Math.floor(Math.random() * 3) - 1,
        recent.y + Math.floor(Math.random() * 3) - 1,
        1,
        1
      );
      this.gfx.fill({ color: p.accent, alpha: 0.5 });
    }
  }

  // ── stolen_face: 8x8 mask that degrades each turn ──
  private drawStolenFace(_dt: number): void {
    const p = this.palette!;
    const ox = W - 16; // top-right area
    const oy = 8;

    // Initialize mask grid (simple face shape).
    if (!this.maskInited) {
      //  Simple 8x8 face pattern:
      //  ..XXXX..
      //  .XXXXXX.
      //  XX.XX.XX
      //  XXXXXXXX
      //  X.XXXX.X
      //  X..XX..X
      //  .XXXXXX.
      //  ..XXXX..
      const pattern = [
        [0,0,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,0],
        [1,1,0,1,1,0,1,1],
        [1,1,1,1,1,1,1,1],
        [1,0,1,1,1,1,0,1],
        [1,0,0,1,1,0,0,1],
        [0,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,0,0],
      ];
      this.maskGrid = pattern.map((row) => [...row]);
      this.maskInited = true;
    }

    // Degrade: each turn past 0, randomly zero out a pixel.
    const degradeCount = Math.min(this.turn, 30);
    // Use deterministic-ish degradation based on turn.
    for (let d = 0; d < degradeCount; d++) {
      const seed = d * 7 + 13;
      const r = seed % 8;
      const c = (seed * 3 + d * 11) % 8;
      if (this.maskGrid[r]) {
        this.maskGrid[r]![c] = 0;
      }
    }

    // Draw the mask.
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (this.maskGrid[r]![c]) {
          // Slight color jitter for "melting" effect.
          const jitter = Math.sin(this.frame * 0.05 + r + c) * 0.1;
          this.gfx.rect(ox + c, oy + r, 1, 1);
          this.gfx.fill({ color: p.accent, alpha: 0.6 + jitter });
        }
      }
    }
  }

  // ── memory_shard: occasional flash of old floor number ──
  private drawMemoryShard(dt: number): void {
    const p = this.palette!;

    this.flashTimer -= dt;
    if (this.flashTimer <= 0) {
      // Schedule next flash.
      this.flashTimer = 60 + Math.random() * 120; // 1-3 seconds
      this.flashFloor = Math.max(1, this.floor - 1 - Math.floor(Math.random() * 3));
    }

    // Show flash for 2-3 frames.
    if (this.flashTimer < 3 && this.flashTimer > 0) {
      const text = String(this.flashFloor);
      const x = 30 + Math.floor(Math.random() * 60);
      const y = 30 + Math.floor(Math.random() * 60);
      // Draw a crude pixel number (just a rectangle with the floor num).
      this.gfx.rect(x, y, text.length * 5, 7);
      this.gfx.fill({ color: p.accent, alpha: 0.25 });
      // Simple digit representation: filled blocks.
      for (let i = 0; i < text.length; i++) {
        this.gfx.rect(x + i * 5 + 1, y + 1, 3, 5);
        this.gfx.fill({ color: p.bg, alpha: 0.4 });
      }
    }
  }

  // ── debt_walker: constant downward gravity on everything ──
  // This is implemented as a visual overlay: faint vertical streaks pulling down.
  private drawDebtWalker(_dt: number): void {
    const p = this.palette!;
    // Draw a few faint downward streaks.
    const count = 5 + Math.floor(this.pressure / 20);
    for (let i = 0; i < count; i++) {
      const x = (i * 47 + Math.floor(this.frame * 0.3)) % W;
      const len = 8 + Math.floor(Math.random() * 12);
      const y = (Math.floor(this.frame * 0.5) + i * 31) % H;
      for (let j = 0; j < len; j++) {
        const alpha = 0.08 * (1 - j / len);
        this.gfx.rect(x, (y + j) % H, 1, 1);
        this.gfx.fill({ color: p.accent, alpha });
      }
    }
  }

  // ── echo_child: delayed ghost of tower position ──
  private drawEchoChild(dt: number): void {
    const p = this.palette!;

    if (this.ghostTimer > 0) {
      this.ghostTimer -= dt;
    }

    // Draw a faint copy of the tower current-floor indicator, but at the ghost floor.
    // Tower layout constants (mirrored from tower.ts).
    const TOWER_X = 260;
    const TOWER_TOP_Y = 16;
    const CELL_H = 12;
    const NODE_CELL_H = 16;
    const GAP = 2;
    const NODE_FLOORS = new Set([5, 10, 15]);

    const ghostF = this.ghostTimer > 0 ? this.ghostFloor : this.floor;
    if (ghostF <= 0) return;

    // Calculate y position of the ghost floor.
    let y = TOWER_TOP_Y;
    for (let f = 15; f >= 1; f--) {
      const isNode = NODE_FLOORS.has(f);
      const cellH = isNode ? NODE_CELL_H : CELL_H;
      if (f === ghostF) {
        // Draw ghost highlight.
        const alpha = this.ghostTimer > 0 ? 0.25 : 0;
        if (alpha > 0) {
          this.gfx.rect(TOWER_X, y, 24, cellH);
          this.gfx.fill({ color: p.accent, alpha });
        }
        break;
      }
      y += cellH + GAP;
    }
  }

  // ── tower_nerve: signal waveform at bottom ──
  private drawTowerNerve(dt: number): void {
    const p = this.palette!;
    this.signalPhase += dt * 0.08;

    const baseY = H - 8;
    const amplitude = 3;

    for (let x = 0; x < W; x++) {
      // Break the signal at high pressure.
      const breakChance = this.pressure / 400; // 0..0.25
      if (Math.random() < breakChance) continue; // signal gap

      const wave = Math.sin(x * 0.08 + this.signalPhase) * amplitude;
      const y = Math.floor(baseY + wave);

      // Occasional "spike" in the signal.
      const spike =
        Math.sin(x * 0.5 + this.signalPhase * 3) > 0.95 ? -2 : 0;

      this.gfx.rect(x, y + spike, 1, 1);
      this.gfx.fill({ color: p.accent, alpha: 0.5 });
    }
  }
}
