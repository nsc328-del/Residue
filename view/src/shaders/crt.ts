/**
 * Lightweight CRT filter: scanlines + vignette.
 * Always on, very subtle.
 */
import { Filter, GlProgram, UniformGroup } from "pixi.js";

// PixiJS v8 uses GLSL 300 es. The vertex shader must use `in`/`out`,
// and the fragment shader must declare `out vec4 finalColor`.

const vertex = /* glsl */ `
in vec2 aPosition;
out vec2 vTextureCoord;

uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

vec4 filterVertexPosition(void) {
  vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
  position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
  position.y = position.y * (2.0 * uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;
  return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord(void) {
  return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

void main(void) {
  gl_Position = filterVertexPosition();
  vTextureCoord = filterTextureCoord();
}
`;

const fragment = /* glsl */ `
in vec2 vTextureCoord;
out vec4 finalColor;

uniform sampler2D uTexture;
uniform float uScanlineIntensity;
uniform float uVignetteIntensity;
uniform float uTime;
uniform vec4 uInputSize;

void main(void) {
  vec4 color = texture(uTexture, vTextureCoord);

  // Scanlines: darken every other pixel row.
  float screenY = vTextureCoord.y * uInputSize.y;
  float scanline = 1.0 - uScanlineIntensity * (0.5 + 0.5 * sin(screenY * 3.14159));

  // Vignette: darken edges.
  vec2 uv = vTextureCoord;
  float dist = distance(uv, vec2(0.5, 0.5));
  float vignette = 1.0 - uVignetteIntensity * smoothstep(0.4, 0.75, dist);

  color.rgb *= scanline * vignette;
  finalColor = color;
}
`;

export class CrtFilter extends Filter {
  constructor() {
    const glProgram = GlProgram.from({ vertex, fragment, name: "crt-filter" });
    super({
      glProgram,
      resources: {
        crtUniforms: new UniformGroup({
          uScanlineIntensity: { value: 0.06, type: "f32" },
          uVignetteIntensity: { value: 0.3, type: "f32" },
          uTime: { value: 0, type: "f32" },
        }),
      },
    });
  }

  get scanlineIntensity(): number {
    return this.resources.crtUniforms.uniforms.uScanlineIntensity as number;
  }
  set scanlineIntensity(v: number) {
    this.resources.crtUniforms.uniforms.uScanlineIntensity = v;
  }

  get vignetteIntensity(): number {
    return this.resources.crtUniforms.uniforms.uVignetteIntensity as number;
  }
  set vignetteIntensity(v: number) {
    this.resources.crtUniforms.uniforms.uVignetteIntensity = v;
  }

  get time(): number {
    return this.resources.crtUniforms.uniforms.uTime as number;
  }
  set time(v: number) {
    this.resources.crtUniforms.uniforms.uTime = v;
  }
}
