import { Container, Graphics } from "pixi.js";
import type { Palette } from "../palettes.js";
import { drawRect, drawRectOutline, lerpColor } from "../utils/draw.js";

const TOTAL_FLOORS = 15;
const NODE_FLOORS = new Set([5, 10, 15]);

// Layout constants (in internal 320x240 pixel space).
const TOWER_X = 260;      // right side of screen
const TOWER_TOP_Y = 16;   // top margin
const CELL_W = 24;        // width of each floor cell
const CELL_H = 12;        // height of normal floor cell
const NODE_CELL_H = 16;   // height of node floor cell
const GAP = 2;             // gap between cells

export class TowerLayer {
  public container = new Container();
  private cells = new Graphics();
  private palette: Palette | null = null;
  private currentFloor = 0;
  private visitedFloors = new Set<number>();
  private visitedPressure = new Map<number, number>(); // floor -> pressure when visited
  private frame = 0;

  constructor() {
    this.container.addChild(this.cells);
  }

  setPalette(palette: Palette): void {
    this.palette = palette;
    this.redraw();
  }

  setFloor(floor: number, pressure: number): void {
    if (floor === this.currentFloor) return;
    // Mark old floor as visited.
    if (this.currentFloor > 0) {
      this.visitedFloors.add(this.currentFloor);
      this.visitedPressure.set(this.currentFloor, pressure);
    }
    this.currentFloor = floor;
    this.redraw();
  }

  update(dt: number): void {
    this.frame += dt;
    this.redraw();
  }

  private redraw(): void {
    if (!this.palette) return;
    const p = this.palette;
    this.cells.clear();

    // Floors are drawn bottom-to-top visually (floor 1 at bottom).
    let y = TOWER_TOP_Y;
    for (let f = TOTAL_FLOORS; f >= 1; f--) {
      const isNode = NODE_FLOORS.has(f);
      const cellH = isNode ? NODE_CELL_H : CELL_H;
      const isCurrent = f === this.currentFloor;
      const isVisited = this.visitedFloors.has(f);

      if (isCurrent) {
        // Breathing glow: alpha oscillates between 0.7 and 1.0.
        const breath = 0.85 + 0.15 * Math.sin(this.frame * 0.05);
        drawRect(this.cells, TOWER_X, y, CELL_W, cellH, p.primary, breath);

        // Bright border for current floor.
        drawRectOutline(this.cells, TOWER_X, y, CELL_W, cellH, p.accent, 0.9);
      } else if (isVisited) {
        // Visited floors: tinted by the pressure at time of visit.
        const pAtVisit = this.visitedPressure.get(f) ?? 0;
        const tint = lerpColor(p.dim, p.danger, pAtVisit / 100);
        drawRect(this.cells, TOWER_X, y, CELL_W, cellH, tint, 0.6);
      } else {
        // Unvisited: very dim.
        drawRect(this.cells, TOWER_X, y, CELL_W, cellH, p.dim, 0.3);
      }

      // Node floors get an extra outline.
      if (isNode && !isCurrent) {
        drawRectOutline(
          this.cells,
          TOWER_X - 1,
          y - 1,
          CELL_W + 2,
          cellH + 2,
          p.primary,
          0.3
        );
      }

      y += cellH + GAP;
    }
  }
}
