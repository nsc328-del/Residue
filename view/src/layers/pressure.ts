import { Container, Graphics } from "pixi.js";

const W = 320;
const H = 240;

/**
 * Pressure-driven visual distortion — pure Graphics, no shaders.
 *
 * 0-20:   nothing
 * 20-40:  faint edge noise pixels
 * 40-60:  edge noise + scanline overlay
 * 60-80:  heavier noise + scanlines + occasional row glitch
 * 80-100: everything + color inversion flashes
 */
export class PressureLayer {
  public container = new Container();
  private scanlines = new Graphics();
  private edgeNoise = new Graphics();
  private glitchRows = new Graphics();
  private targetPressure = 0;
  private currentPressure = 0;
  private frame = 0;

  constructor() {
    this.container.addChild(this.scanlines);
    this.container.addChild(this.edgeNoise);
    this.container.addChild(this.glitchRows);
  }

  setPressure(pressure: number): void {
    this.targetPressure = pressure;
  }

  update(dt: number): void {
    this.frame += dt;

    // Smooth interpolation.
    const speed = 0.05;
    this.currentPressure +=
      (this.targetPressure - this.currentPressure) * speed * dt;

    const p = this.currentPressure / 100; // 0..1

    this.drawScanlines(p);
    this.drawEdgeNoise(p);
    this.drawGlitchRows(p);
  }

  private drawScanlines(p: number): void {
    this.scanlines.clear();
    if (p < 0.4) return;

    // Scanline intensity scales with pressure.
    const intensity = (p - 0.4) / 0.6; // 0..1
    const alpha = 0.03 + intensity * 0.08;

    // Draw every other row as a dark line.
    for (let y = 0; y < H; y += 2) {
      this.scanlines.rect(0, y, W, 1);
      this.scanlines.fill({ color: 0x000000, alpha });
    }

    // Vignette: darken edges.
    if (p > 0.5) {
      const va = (p - 0.5) * 0.4;
      // Top/bottom strips.
      for (let i = 0; i < 8; i++) {
        const a = va * (1 - i / 8);
        this.scanlines.rect(0, i, W, 1);
        this.scanlines.fill({ color: 0x000000, alpha: a });
        this.scanlines.rect(0, H - 1 - i, W, 1);
        this.scanlines.fill({ color: 0x000000, alpha: a });
      }
      // Left/right strips.
      for (let i = 0; i < 6; i++) {
        const a = va * (1 - i / 6);
        this.scanlines.rect(i, 0, 1, H);
        this.scanlines.fill({ color: 0x000000, alpha: a });
        this.scanlines.rect(W - 1 - i, 0, 1, H);
        this.scanlines.fill({ color: 0x000000, alpha: a });
      }
    }
  }

  private drawEdgeNoise(p: number): void {
    this.edgeNoise.clear();
    if (p < 0.2) return;

    const intensity = (p - 0.2) / 0.8; // 0..1
    const count = Math.floor(intensity * 60);

    // Only refresh every few frames for flicker effect.
    if (this.frame % 3 > 1) return;

    for (let i = 0; i < count; i++) {
      // Bias toward edges.
      let x: number, y: number;
      const edge = Math.random();
      if (edge < 0.25) {
        x = Math.floor(Math.random() * 12);
        y = Math.floor(Math.random() * H);
      } else if (edge < 0.5) {
        x = W - Math.floor(Math.random() * 12);
        y = Math.floor(Math.random() * H);
      } else if (edge < 0.75) {
        x = Math.floor(Math.random() * W);
        y = Math.floor(Math.random() * 10);
      } else {
        x = Math.floor(Math.random() * W);
        y = H - Math.floor(Math.random() * 10);
      }
      const bright = Math.random() > 0.5;
      const color = bright ? 0xffffff : 0x000000;
      this.edgeNoise.rect(x, y, 1, 1);
      this.edgeNoise.fill({ color, alpha: 0.15 + intensity * 0.25 });
    }
  }

  private drawGlitchRows(p: number): void {
    this.glitchRows.clear();
    if (p < 0.6) return;

    const intensity = (p - 0.6) / 0.4; // 0..1

    // Only glitch on some frames.
    if (Math.random() > 0.15 * intensity) return;

    // Pick 1-3 random rows and shift them horizontally.
    const rowCount = 1 + Math.floor(intensity * 2);
    for (let i = 0; i < rowCount; i++) {
      const y = Math.floor(Math.random() * H);
      const shift = Math.floor((Math.random() - 0.5) * 8 * intensity);
      // Draw a shifted bright/dark bar.
      const barW = 20 + Math.floor(Math.random() * 40);
      this.glitchRows.rect(W / 2 + shift - barW / 2, y, barW, 1);
      this.glitchRows.fill({
        color: Math.random() > 0.5 ? 0xffffff : 0x000000,
        alpha: 0.08 + intensity * 0.12,
      });
    }

    // ── Color inversion flash at very high pressure ──
    if (p > 0.8 && Math.random() > 0.92) {
      this.glitchRows.rect(0, 0, W, H);
      this.glitchRows.fill({ color: 0xffffff, alpha: 0.06 });
    }
  }
}
