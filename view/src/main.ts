import { Application, Graphics, TextureStyle } from "pixi.js";
import { StatePoller } from "./state-poller.js";
import { resolvePalette } from "./palettes.js";
import { BackgroundLayer } from "./layers/background.js";
import { TowerLayer } from "./layers/tower.js";
import { PressureLayer } from "./layers/pressure.js";
import { CostsLayer } from "./layers/costs.js";
import { WorldLineLayer } from "./layers/world-line.js";
import { RoomMoodLayer } from "./layers/room-mood.js";
import { StorylineLayer } from "./layers/storyline.js";

// ── Constants ──
const INTERNAL_W = 320;
const INTERNAL_H = 240;
const SCALE = 3;

// ── Bootstrap ──
async function main() {
  TextureStyle.defaultOptions.scaleMode = "nearest";

  const app = new Application();
  await app.init({
    width: INTERNAL_W,
    height: INTERNAL_H,
    antialias: false,
    roundPixels: true,
    backgroundColor: 0x000000,
    resolution: 1,
    preference: "webgl",
  });

  console.log("[residue-view] renderer ready");

  const canvas = app.canvas as HTMLCanvasElement;
  canvas.style.width = `${INTERNAL_W * SCALE}px`;
  canvas.style.height = `${INTERNAL_H * SCALE}px`;
  document.body.appendChild(canvas);

  // ── Layers (back to front) ──
  const backgroundLayer = new BackgroundLayer();
  const roomMoodLayer = new RoomMoodLayer();
  const costsLayer = new CostsLayer();
  const worldLineLayer = new WorldLineLayer();
  const storylineLayer = new StorylineLayer();
  const towerLayer = new TowerLayer();
  const pressureLayer = new PressureLayer();

  // Flash overlay for perma-token consumption and ended state.
  const flashOverlay = new Graphics();
  flashOverlay.rect(0, 0, INTERNAL_W, INTERNAL_H);
  flashOverlay.fill({ color: 0xffffff });
  flashOverlay.alpha = 0;

  // Ended overlay.
  const endedOverlay = new Graphics();
  endedOverlay.alpha = 0;

  app.stage.addChild(backgroundLayer.container);
  app.stage.addChild(roomMoodLayer.container);
  app.stage.addChild(costsLayer.container);
  app.stage.addChild(worldLineLayer.container);
  app.stage.addChild(storylineLayer.container);
  app.stage.addChild(towerLayer.container);
  // Pressure overlay is drawn on top of everything (except flash/ended).
  app.stage.addChild(pressureLayer.container);
  app.stage.addChild(endedOverlay);
  app.stage.addChild(flashOverlay);

  // No shader filters — all effects are pure Graphics overlays.

  // ── Transition state ──
  let flashTimer = 0;
  let isEnded = false;
  let endedTimer = 0;

  // ── State polling ──
  const poller = new StatePoller();

  poller.onStateChange(({ next, changes }) => {
    const palette = resolvePalette(
      next.world_line.current,
      next.meta.storyline
    );

    backgroundLayer.setPalette(palette);
    towerLayer.setPalette(palette);
    towerLayer.setFloor(next.meta.floor, next.partner_state.cost_pressure);
    costsLayer.setPalette(palette);
    costsLayer.setCosts(next.costs);
    pressureLayer.setPressure(next.partner_state.cost_pressure);
    worldLineLayer.setPalette(palette, next.world_line.current);
    roomMoodLayer.setPalette(palette);
    roomMoodLayer.setRoom(
      next.current_room.template_id,
      next.partner_state.cost_pressure
    );
    storylineLayer.setStoryline(next.meta.storyline);
    storylineLayer.setPalette(palette);
    storylineLayer.setState(
      next.meta.floor,
      next.meta.turn,
      next.partner_state.cost_pressure
    );

    if (changes.has("perma_token")) {
      flashTimer = 18;
    }

    if (changes.has("ended") && next.meta.ended) {
      isEnded = true;
      endedTimer = 0;
    }
  });

  poller.start();

  // ── Render loop ──
  app.ticker.add((ticker) => {
    const dt = ticker.deltaTime;

    backgroundLayer.update(dt);
    towerLayer.update(dt);
    costsLayer.update(dt);
    pressureLayer.update(dt);
    worldLineLayer.update(dt);
    roomMoodLayer.update(dt);
    storylineLayer.update(dt);

    // ── Flash overlay ──
    if (flashTimer > 0) {
      flashTimer -= dt;
      flashOverlay.alpha = Math.max(0, flashTimer / 18) * 0.7;
    } else {
      flashOverlay.alpha = 0;
    }

    // ── Ended overlay ──
    if (isEnded) {
      endedTimer += dt;
      const progress = Math.min(1, endedTimer / 180);

      endedOverlay.clear();

      const crackW = Math.floor(8 + progress * 80);
      const crackH = Math.floor(2 + progress * 15);
      const crackX = Math.floor(INTERNAL_W / 2 - crackW / 2);

      endedOverlay.rect(crackX, 0, crackW, crackH);
      endedOverlay.fill({ color: 0xffffff });

      const glowH = Math.floor(crackH * 3);
      endedOverlay.rect(crackX - 4, 0, crackW + 8, glowH);
      endedOverlay.fill({ color: 0xffffff, alpha: 0.1 * progress });

      const rayCount = Math.floor(progress * 8);
      for (let i = 0; i < rayCount; i++) {
        const rx = crackX + Math.floor(Math.random() * crackW);
        const ry = crackH + Math.floor(Math.random() * 40 * progress);
        endedOverlay.rect(rx, ry, 1, Math.floor(3 + Math.random() * 8));
        endedOverlay.fill({ color: 0xffffff, alpha: 0.15 });
      }

      endedOverlay.alpha = Math.min(1, progress * 1.5);

      if (progress > 0.5) {
        flashOverlay.alpha = (progress - 0.5) * 0.4;
      }
    }
  });
}

main().catch(console.error);
