import { Application, Graphics, TextureStyle } from "pixi.js";

async function test() {
  console.log("[test] starting PixiJS...");

  TextureStyle.defaultOptions.scaleMode = "nearest";

  const app = new Application();

  // Try WebGL1 first (avoids WebGL2 shader compat issues on some macOS GPUs).
  // If that also fails, fall back to canvas.
  try {
    await app.init({
      width: 320,
      height: 240,
      antialias: false,
      roundPixels: true,
      backgroundColor: 0x0a0e1a,
      resolution: 1,
      preference: "webgl",
      webgl: {
        preferWebGLVersion: 1,
        context: null,
      } as Record<string, unknown>,
    });
    console.log("[test] WebGL1 init OK");
  } catch (e) {
    console.warn("[test] WebGL1 failed, trying canvas:", e);
    await app.init({
      width: 320,
      height: 240,
      antialias: false,
      roundPixels: true,
      backgroundColor: 0x0a0e1a,
      resolution: 1,
      preference: "canvas",
    });
    console.log("[test] Canvas init OK");
  }

  const canvas = app.canvas as HTMLCanvasElement;
  canvas.style.width = "960px";
  canvas.style.height = "720px";
  document.body.appendChild(canvas);

  console.log("[test] canvas appended, drawing rects...");

  const g = new Graphics();
  g.rect(100, 100, 50, 30);
  g.fill({ color: 0x4a7ccc });
  g.rect(160, 50, 24, 12);
  g.fill({ color: 0xb8d4ff });
  app.stage.addChild(g);

  console.log("[test] done. You should see two blue rectangles.");
  document.title = "PixiJS OK - " + (app.renderer.type === 0x02 ? "WebGL" : "Canvas");
}

test().catch((e) => {
  console.error("[test] FAILED:", e);
  document.title = "PixiJS FAILED - see console";
});
