/**
 * Pressure-driven distortion filter.
 * At low pressure: nothing visible.
 * At high pressure: edge noise, pixel row displacement, color flash.
 */
import { Filter, GlProgram, UniformGroup } from "pixi.js";

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
uniform float uPressure;
uniform float uTime;
uniform float uShake;
uniform float uRowDisplace;
uniform float uEdgeNoise;
uniform vec4 uInputSize;

// Simple pseudo-random.
float hash(float n) {
  return fract(sin(n) * 43758.5453123);
}

void main(void) {
  vec2 uv = vTextureCoord;

  // ── Vertical shake ──
  uv.y += uShake * sin(uTime * 7.0 + uv.x * 20.0) * 0.003;

  // ── Row displacement: random horizontal shift per row ──
  if (uRowDisplace > 0.0) {
    float row = floor(uv.y * uInputSize.y);
    float rowRand = hash(row + floor(uTime * 3.0));
    // Only displace some rows (sparse glitch).
    if (rowRand > 0.97) {
      uv.x += uRowDisplace * (rowRand - 0.5) * 0.02;
    }
  }

  vec4 color = texture(uTexture, uv);

  // ── Edge noise: darken/brighten edges ──
  if (uEdgeNoise > 0.0) {
    float edgeDist = min(
      min(uv.x, 1.0 - uv.x),
      min(uv.y, 1.0 - uv.y)
    );
    float edgeMask = smoothstep(0.0, 0.08, edgeDist);
    float noise = hash(uv.y * 1000.0 + uTime * 100.0);
    float edgeEffect = mix(noise * uEdgeNoise, 0.0, edgeMask);
    color.rgb = mix(color.rgb, vec3(noise * 0.3), edgeEffect);
  }

  // ── Occasional color inversion flash at very high pressure ──
  if (uPressure > 0.78) {
    float flash = step(0.995, hash(floor(uTime * 15.0)));
    color.rgb = mix(color.rgb, 1.0 - color.rgb, flash * (uPressure - 0.78) * 4.0);
  }

  finalColor = color;
}
`;

export class DistortionFilter extends Filter {
  constructor() {
    const glProgram = GlProgram.from({
      vertex,
      fragment,
      name: "distortion-filter",
    });
    super({
      glProgram,
      resources: {
        distortionUniforms: new UniformGroup({
          uPressure: { value: 0, type: "f32" },
          uTime: { value: 0, type: "f32" },
          uShake: { value: 0, type: "f32" },
          uRowDisplace: { value: 0, type: "f32" },
          uEdgeNoise: { value: 0, type: "f32" },
        }),
      },
    });
  }

  private get u() {
    return this.resources.distortionUniforms.uniforms;
  }

  get time(): number {
    return this.u.uTime as number;
  }
  set time(v: number) {
    this.u.uTime = v;
  }

  /**
   * Map a 0..100 pressure value to shader parameters.
   */
  setPressure(pressure: number): void {
    const p = Math.max(0, Math.min(100, pressure)) / 100;
    this.u.uPressure = p;

    if (p < 0.2) {
      this.u.uShake = 0;
      this.u.uRowDisplace = 0;
      this.u.uEdgeNoise = 0;
    } else if (p < 0.4) {
      this.u.uShake = 0;
      this.u.uRowDisplace = 0;
      this.u.uEdgeNoise = (p - 0.2) * 2.5;
    } else if (p < 0.6) {
      this.u.uShake = (p - 0.4) * 2.5;
      this.u.uRowDisplace = 0;
      this.u.uEdgeNoise = 0.5 + (p - 0.4) * 1.0;
    } else if (p < 0.8) {
      this.u.uShake = 0.5 + (p - 0.6) * 2.0;
      this.u.uRowDisplace = (p - 0.6) * 5.0;
      this.u.uEdgeNoise = 0.7 + (p - 0.6) * 1.0;
    } else {
      this.u.uShake = 0.9 + (p - 0.8) * 0.5;
      this.u.uRowDisplace = 1.0;
      this.u.uEdgeNoise = 0.9 + (p - 0.8) * 0.5;
    }
  }
}
