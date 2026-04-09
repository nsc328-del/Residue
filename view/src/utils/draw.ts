import { Graphics } from "pixi.js";

/** Draw a filled rectangle. */
export function drawRect(
  g: Graphics,
  x: number,
  y: number,
  w: number,
  h: number,
  color: number,
  alpha = 1
): void {
  g.rect(x, y, w, h);
  g.fill({ color, alpha });
}

/** Draw a single pixel. */
export function drawPixel(
  g: Graphics,
  x: number,
  y: number,
  color: number,
  alpha = 1
): void {
  drawRect(g, Math.floor(x), Math.floor(y), 1, 1, color, alpha);
}

/** Draw a horizontal line. */
export function drawHLine(
  g: Graphics,
  x: number,
  y: number,
  length: number,
  color: number,
  alpha = 1
): void {
  drawRect(g, x, y, length, 1, color, alpha);
}

/** Draw a vertical line. */
export function drawVLine(
  g: Graphics,
  x: number,
  y: number,
  length: number,
  color: number,
  alpha = 1
): void {
  drawRect(g, x, y, 1, length, color, alpha);
}

/** Draw a rectangle outline (1px border). */
export function drawRectOutline(
  g: Graphics,
  x: number,
  y: number,
  w: number,
  h: number,
  color: number,
  alpha = 1
): void {
  drawHLine(g, x, y, w, color, alpha);           // top
  drawHLine(g, x, y + h - 1, w, color, alpha);   // bottom
  drawVLine(g, x, y, h, color, alpha);            // left
  drawVLine(g, x + w - 1, y, h, color, alpha);   // right
}

/**
 * Interpolate between two hex colors.
 * t=0 returns `a`, t=1 returns `b`.
 */
export function lerpColor(a: number, b: number, t: number): number {
  const clamp = Math.max(0, Math.min(1, t));
  const ar = (a >> 16) & 0xff, ag = (a >> 8) & 0xff, ab = a & 0xff;
  const br = (b >> 16) & 0xff, bg = (b >> 8) & 0xff, bb = b & 0xff;
  const r = Math.round(ar + (br - ar) * clamp);
  const g = Math.round(ag + (bg - ag) * clamp);
  const bl = Math.round(ab + (bb - ab) * clamp);
  return (r << 16) | (g << 8) | bl;
}
