import { Container, Graphics } from "pixi.js";
import { lerpColor } from "../utils/draw.js";
import type { Palette } from "../palettes.js";

const W = 320;
const H = 240;

/**
 * World-line transition layer.
 *
 * On fork: plays a noise-dissolve animation (old palette → white noise → new palette).
 * Otherwise: provides a subtle shimmer that reflects the current world-line's tonal identity.
 *
 * The visual "unowned_region" difference is: occasional pixel misalignment (sub-pixel jitter)
 * and wrong-direction light leaks simulated as brief bright pixels from the bottom-left.
 */
export class WorldLineLayer {
  public container = new Container();
  private overlay = new Graphics();
  private shimmer = new Graphics();

  private currentTheme = "";
  private palette: Palette | null = null;

  // Fork dissolve animation state.
  private dissolving = false;
  private dissolveProgress = 0; // 0..1
  private oldPalette: Palette | null = null;
  private newPalette: Palette | null = null;

  // Unowned region jitter.
  private isUnowned = false;
  private frame = 0;

  constructor() {
    this.container.addChild(this.overlay);
    this.container.addChild(this.shimmer);
  }

  setPalette(palette: Palette, theme: string): void {
    const themeChanged = theme !== this.currentTheme && this.currentTheme !== "";
    this.isUnowned = theme === "unowned_region";

    if (themeChanged) {
      // Start fork dissolve.
      this.oldPalette = this.palette;
      this.newPalette = palette;
      this.dissolving = true;
      this.dissolveProgress = 0;
    }

    this.currentTheme = theme;
    this.palette = palette;
  }

  update(dt: number): void {
    this.frame += dt;

    if (this.dissolving) {
      this.dissolveProgress += 0.02 * dt; // ~0.8s at 60fps
      if (this.dissolveProgress >= 1) {
        this.dissolving = false;
        this.dissolveProgress = 0;
        this.oldPalette = null;
        this.newPalette = null;
      }
      this.drawDissolve();
    } else {
      this.overlay.clear();
    }

    this.drawShimmer();
  }

  private drawDissolve(): void {
    this.overlay.clear();
    if (!this.oldPalette || !this.newPalette) return;

    const t = this.dissolveProgress;

    // Phase 1 (0..0.4): old palette fades to white noise.
    // Phase 2 (0.4..0.6): peak noise.
    // Phase 3 (0.6..1.0): noise resolves to new palette.

    let noiseIntensity: number;
    let baseColor: number;

    if (t < 0.4) {
      noiseIntensity = t / 0.4;
      baseColor = this.oldPalette.bg;
    } else if (t < 0.6) {
      noiseIntensity = 1.0;
      baseColor = lerpColor(this.oldPalette.bg, this.newPalette.bg, (t - 0.4) / 0.2);
    } else {
      noiseIntensity = 1.0 - (t - 0.6) / 0.4;
      baseColor = this.newPalette.bg;
    }

    // Draw sparse noise pixels.
    const count = Math.floor(W * H * 0.04 * noiseIntensity);
    const alpha = noiseIntensity * 0.7;

    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * W);
      const y = Math.floor(Math.random() * H);
      const bright = Math.random() > 0.5;
      const color = bright ? 0xffffff : baseColor;
      this.overlay.rect(x, y, 1, 1);
      this.overlay.fill({ color, alpha: alpha * (0.3 + Math.random() * 0.7) });
    }
  }

  private drawShimmer(): void {
    this.shimmer.clear();

    if (this.isUnowned) {
      // "Wrong light" — occasional bright pixel from bottom-left.
      if (this.frame % 4 < 1) {
        const count = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
          // Bias toward bottom-left quadrant.
          const x = Math.floor(Math.random() * (W * 0.4));
          const y = H - Math.floor(Math.random() * (H * 0.3));
          this.shimmer.rect(x, y, 1, 1);
          this.shimmer.fill({
            color: this.palette?.accent ?? 0xd4a844,
            alpha: 0.15 + Math.random() * 0.2,
          });
        }
      }

      // Sub-pixel jitter: randomly offset a few pixels by 1px.
      if (this.frame % 6 < 1) {
        const count = 3;
        for (let i = 0; i < count; i++) {
          const x = Math.floor(Math.random() * W);
          const y = Math.floor(Math.random() * H);
          this.shimmer.rect(x + 1, y, 1, 1);
          this.shimmer.fill({
            color: this.palette?.primary ?? 0x9a6ec7,
            alpha: 0.1,
          });
        }
      }
    }
  }
}
