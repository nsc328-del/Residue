import { Container, Graphics } from "pixi.js";
import type { Cost, CostSeverity } from "../types.js";
import type { Palette } from "../palettes.js";
import { drawRect } from "../utils/draw.js";
import { lerpColor } from "../utils/draw.js";

// ── Layout ──
const AREA_X = 20;
const AREA_Y = 200;
const AREA_W = 220;
const MAX_SWING = 3; // max horizontal swing in pixels

type CostShape = {
  id: string;
  severity: CostSeverity;
  x: number;
  y: number;
  targetY: number;
  w: number;
  h: number;
  phase: number;    // oscillation phase
  speed: number;    // oscillation speed
  alive: boolean;
  dissolving: boolean;
  dissolveTimer: number;
};

const SEVERITY_SIZE: Record<CostSeverity, { w: number; h: number }> = {
  light: { w: 4, h: 4 },
  medium: { w: 6, h: 8 },
  heavy: { w: 10, h: 12 },
};

export class CostsLayer {
  public container = new Container();
  private gfx = new Graphics();
  private shapes: CostShape[] = [];
  private palette: Palette | null = null;
  private frame = 0;

  constructor() {
    this.container.addChild(this.gfx);
  }

  setPalette(palette: Palette): void {
    this.palette = palette;
  }

  /**
   * Sync the visual shapes with the current cost array.
   */
  setCosts(costs: Cost[]): void {
    const openCosts = costs.filter((c) => !c.settled);
    const openIds = new Set(openCosts.map((c) => c.id));

    // Mark shapes for dissolution if their cost was settled.
    for (const shape of this.shapes) {
      if (!openIds.has(shape.id) && !shape.dissolving) {
        shape.dissolving = true;
        shape.dissolveTimer = 1.0;
      }
    }

    // Add shapes for new costs.
    for (const cost of openCosts) {
      if (this.shapes.some((s) => s.id === cost.id)) continue;
      const size = SEVERITY_SIZE[cost.severity];
      const x =
        AREA_X + Math.floor(Math.random() * (AREA_W - size.w));
      this.shapes.push({
        id: cost.id,
        severity: cost.severity,
        x,
        y: 0, // Start at top, will animate down.
        targetY: AREA_Y + Math.floor(Math.random() * 20),
        w: size.w,
        h: size.h,
        phase: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.02,
        alive: true,
        dissolving: false,
        dissolveTimer: 0,
      });
    }
  }

  update(dt: number): void {
    this.frame += dt;

    for (const shape of this.shapes) {
      if (shape.dissolving) {
        shape.dissolveTimer -= 0.02 * dt;
        if (shape.dissolveTimer <= 0) {
          shape.alive = false;
        }
      } else {
        // Animate falling to target Y.
        if (shape.y < shape.targetY) {
          shape.y += 1.5 * dt;
          if (shape.y > shape.targetY) shape.y = shape.targetY;
        }
      }
    }

    // Remove dead shapes.
    this.shapes = this.shapes.filter((s) => s.alive);

    this.redraw();
  }

  private redraw(): void {
    if (!this.palette) return;
    this.gfx.clear();

    for (const shape of this.shapes) {
      const swing =
        Math.sin(this.frame * shape.speed + shape.phase) * MAX_SWING;
      const x = Math.floor(shape.x + swing);
      const y = Math.floor(shape.y);

      let alpha = 0.8;
      let color = this.severityColor(shape.severity);

      if (shape.dissolving) {
        alpha = shape.dissolveTimer * 0.8;
        // Flash brighter as it dissolves.
        color = lerpColor(color, 0xffffff, 1.0 - shape.dissolveTimer);
      }

      // Main body.
      drawRect(this.gfx, x, y, shape.w, shape.h, color, alpha);

      // Trail / shadow for medium and heavy.
      if (shape.severity !== "light") {
        const trailLen = shape.severity === "heavy" ? 6 : 3;
        for (let i = 1; i <= trailLen; i++) {
          drawRect(
            this.gfx,
            x + 1,
            y - i,
            shape.w - 2,
            1,
            color,
            alpha * (0.3 * (1 - i / trailLen))
          );
        }
      }
    }
  }

  private severityColor(severity: CostSeverity): number {
    if (!this.palette) return 0xffffff;
    switch (severity) {
      case "light":
        return this.palette.primary;
      case "medium":
        return lerpColor(this.palette.primary, this.palette.danger, 0.5);
      case "heavy":
        return this.palette.danger;
    }
  }
}
