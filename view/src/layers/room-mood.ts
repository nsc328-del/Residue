import { Container, Graphics } from "pixi.js";
import type { Palette } from "../palettes.js";

const W = 320;
const H = 240;
const MAX_PARTICLES = 150;

type RoomKind = "normal" | "node" | "chaos" | "aftermath" | "top";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;    // 0..1, counts down
  maxLife: number;
  size: number;
  color: number;
  alpha: number;
};

export class RoomMoodLayer {
  public container = new Container();
  private gfx = new Graphics();
  private particles: Particle[] = [];
  private palette: Palette | null = null;
  private kind: RoomKind = "normal";
  private pressure = 0;
  private frame = 0;

  constructor() {
    this.container.addChild(this.gfx);
  }

  setPalette(palette: Palette): void {
    this.palette = palette;
  }

  /**
   * Determine the room "mood" from the template_id and pressure.
   */
  setRoom(templateId: string, pressure: number): void {
    this.pressure = pressure;

    if (templateId.includes("_15_top") || templateId.includes("15_top")) {
      this.kind = "top";
    } else if (templateId.includes("chaos")) {
      this.kind = "chaos";
    } else if (templateId.includes("node")) {
      this.kind = "node";
    } else if (templateId.includes("aftermath")) {
      this.kind = "aftermath";
    } else {
      this.kind = "normal";
    }
  }

  update(dt: number): void {
    this.frame += dt;

    // Spawn new particles.
    this.spawnParticles(dt);

    // Update existing particles.
    for (const p of this.particles) {
      this.updateParticle(p, dt);
    }

    // Remove dead particles.
    this.particles = this.particles.filter((p) => p.life > 0);

    this.redraw();
  }

  private spawnParticles(dt: number): void {
    if (this.particles.length >= MAX_PARTICLES) return;

    let spawnRate: number;
    switch (this.kind) {
      case "normal":
        spawnRate = 0.3;
        break;
      case "node":
        spawnRate = 0.8;
        break;
      case "chaos":
        spawnRate = 1.2;
        break;
      case "aftermath":
        spawnRate = 0.5;
        break;
      case "top":
        spawnRate = 1.0;
        break;
    }

    // Pressure boosts spawn rate for chaos.
    if (this.kind === "chaos") {
      spawnRate += this.pressure * 0.01;
    }

    const count = Math.floor(spawnRate * dt);
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  private createParticle(): Particle {
    const color = this.palette?.particle ?? 0x444444;
    const chaosColor = this.palette?.danger ?? 0xcc4444;

    switch (this.kind) {
      case "normal":
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.1,
          life: 1,
          maxLife: 1,
          size: 1,
          color,
          alpha: 0.2 + Math.random() * 0.2,
        };

      case "node":
        // Particles spawn around edges and drift toward center.
        const edge = Math.floor(Math.random() * 4);
        let nx: number, ny: number;
        if (edge === 0) { nx = 0; ny = Math.random() * H; }
        else if (edge === 1) { nx = W; ny = Math.random() * H; }
        else if (edge === 2) { nx = Math.random() * W; ny = 0; }
        else { nx = Math.random() * W; ny = H; }
        const cx = W / 2, cy = H / 2;
        const dx = cx - nx, dy = cy - ny;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        return {
          x: nx,
          y: ny,
          vx: (dx / dist) * 0.4,
          vy: (dy / dist) * 0.4,
          life: 1,
          maxLife: 1,
          size: 1,
          color,
          alpha: 0.3 + Math.random() * 0.3,
        };

      case "chaos": {
        // Erratic motion, wrong colors.
        const useWrongColor = Math.random() > 0.5;
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          life: 1,
          maxLife: 1,
          size: Math.random() > 0.7 ? 2 : 1,
          color: useWrongColor ? chaosColor : color,
          alpha: 0.3 + Math.random() * 0.4,
        };
      }

      case "aftermath":
        // Ash-like: spawn near top, drift down slowly.
        return {
          x: Math.random() * W,
          y: Math.random() * (H * 0.3),
          vx: (Math.random() - 0.5) * 0.05,
          vy: 0.15 + Math.random() * 0.1,
          life: 1,
          maxLife: 1,
          size: 1,
          color,
          alpha: 0.15 + Math.random() * 0.15,
        };

      case "top":
        // Upward drift, light from above.
        return {
          x: Math.random() * W,
          y: H * 0.5 + Math.random() * (H * 0.5),
          vx: (Math.random() - 0.5) * 0.1,
          vy: -(0.3 + Math.random() * 0.3),
          life: 1,
          maxLife: 1,
          size: Math.random() > 0.5 ? 2 : 1,
          color: this.palette?.accent ?? 0xffffff,
          alpha: 0.3 + Math.random() * 0.4,
        };
    }
  }

  private updateParticle(p: Particle, dt: number): void {
    p.life -= (1 / (60 * 3)) * dt; // ~3 seconds lifetime at 60fps
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    // Chaos: occasionally curve the trajectory.
    if (this.kind === "chaos" && this.frame % 30 < 1) {
      p.vx += (Math.random() - 0.5) * 0.2;
      p.vy += (Math.random() - 0.5) * 0.2;
    }

    // Kill particles that leave the screen.
    if (p.x < -5 || p.x > W + 5 || p.y < -5 || p.y > H + 5) {
      p.life = 0;
    }
  }

  private redraw(): void {
    this.gfx.clear();

    for (const p of this.particles) {
      const fadeAlpha = p.alpha * Math.max(0, p.life / p.maxLife);
      if (fadeAlpha < 0.01) continue;
      this.gfx.rect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      this.gfx.fill({ color: p.color, alpha: fadeAlpha });
    }
  }
}
