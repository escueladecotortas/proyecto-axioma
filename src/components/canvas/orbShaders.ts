// Archivo: src/components/canvas/orbShaders.ts
export const ORB_VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export const ORB_FRAGMENT_SHADER = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_audio;
  uniform float u_pulse;

  // Pseudo-random noise function
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  // 3D Simplex-like noise approximation
  float noise(in vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z
    );
  }

  // Distance field with dynamic acoustic turbulence
  float map(vec3 p) {
    float displacement = noise(p * 2.5 + vec3(0.0, u_time * 0.4, 0.0)) * (0.08 + u_audio * 0.28);
    float pulseMod = sin(u_time * 2.0) * 0.03 * u_pulse;
    return length(p) - (0.85 + pulseMod + displacement);
  }

  vec3 calcNormal(vec3 p) {
    const float h = 0.001;
    const vec2 k = vec2(1.0, -1.0);
    return normalize(
      k.xyy * map(p + k.xyy * h) +
      k.yyx * map(p + k.yyx * h) +
      k.yxy * map(p + k.yxy * h) +
      k.xxx * map(p + k.xxx * h)
    );
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
    vec3 ro = vec3(0.0, 0.0, 2.5);
    vec3 rd = normalize(vec3(uv, -1.3));

    float t = 0.0;
    float d = 0.0;
    for(int i = 0; i < 48; i++) {
      vec3 p = ro + rd * t;
      d = map(p);
      if(d < 0.002 || t > 4.5) break;
      t += d * 0.75;
    }

    vec3 bg = vec3(0.02, 0.025, 0.035);
    vec3 col = bg;

    if(t < 4.5) {
      vec3 p = ro + rd * t;
      vec3 n = calcNormal(p);
      float fresnel = pow(clamp(1.0 + dot(rd, n), 0.0, 1.0), 2.8);
      
      // Laboratory grade bio-cyan palette transitioning to clinical teal
      vec3 coreColor = vec3(0.03, 0.12, 0.18);
      vec3 rimColor = mix(vec3(0.15, 0.85, 0.78), vec3(0.35, 0.65, 0.98), u_audio);
      
      col = mix(coreColor, rimColor, fresnel * (0.9 + u_audio * 0.6));
      col += rimColor * (fresnel * 1.4);
    } else {
      // Ambient atmospheric halo
      float halo = 1.0 - smoothstep(0.0, 0.9, length(uv));
      col += vec3(0.05, 0.25, 0.3) * (halo * (0.15 + u_audio * 0.35));
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;
