import { Container, Graphics } from "pixi.js";
import type { Palette } from "../palettes.js";

const W = 320;
const H = 240;
const NOISE_DENSITY = 0.003; // fraction of pixels that are noise dots

export class BackgroundLayer {
  public container = new Container();
  private bg = new Graphics();
  private noise = new Graphics();
  private currentBg = 0x000000;
  private frame = 0;

  constructor() {
    this.container.addChild(this.bg);
    this.container.addChild(this.noise);
  }

  setPalette(palette: Palette): void {
    if (this.currentBg === palette.bg) return;
    this.currentBg = palette.bg;
    this.redrawBg();
  }

  update(_dt: number): void {
    this.frame++;
    // Refresh noise every 8 frames for a slow shimmer.
    if (this.frame % 8 === 0) {
      this.redrawNoise();
    }
  }

  private redrawBg(): void {
    this.bg.clear();
    this.bg.rect(0, 0, W, H);
    this.bg.fill({ color: this.currentBg });
  }

  private redrawNoise(): void {
    this.noise.clear();
    const count = Math.floor(W * H * NOISE_DENSITY);
    for (let i = 0; i < count; i++) {
      const x = Math.floor(Math.random() * W);
      const y = Math.floor(Math.random() * H);
      // Subtle single-pixel noise, slightly brighter than bg.
      const brightness = 0x08 + Math.floor(Math.random() * 0x0a);
      const color =
        ((((this.currentBg >> 16) & 0xff) + brightness) << 16) |
        ((((this.currentBg >> 8) & 0xff) + brightness) << 8) |
        ((this.currentBg & 0xff) + brightness);
      this.noise.rect(x, y, 1, 1);
      this.noise.fill({ color, alpha: 0.4 });
    }
  }
}
