import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ThemeMode } from '../types';

interface ParticleCanvasProps {
  theme: ThemeMode;
  scrollProgress: number;
}

const VERTEX_SHADER = `
  #define PI 3.141592653589793
  #define PI2 6.283185307179586
  #define PHI 1.618033988749

  attribute float aIndex;
  attribute float aSize;
  attribute float aPhase;

  uniform float uCount;
  uniform float uFormA;
  uniform float uFormB;
  uniform float uMix;
  uniform float uTime;
  uniform vec3 uMouse;
  uniform float uMouseRadius;
  uniform float uPointSize;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uScrollVel;

  varying vec3 vColor;
  varying float vAlpha;

  float hash(float n) { return fract(sin(n + 0.1) * 43758.5453); }

  vec3 formSphere(float i, float n) {
      float p = acos(1.0 - 2.0 * (i + 0.5) / n);
      float t = PI2 * PHI * i;
      float r = 2.8 + hash(i * 6.7) * 0.4;
      return r * vec3(sin(p)*cos(t), sin(p)*sin(t), cos(p));
  }
  vec3 formHelix(float i, float n) {
      float t = i / n * PI2 * 4.0;
      float s = floor(mod(i, 3.0));
      float r = 1.2 + hash(i * 3.1) * 0.3;
      return vec3(r * cos(t + s * PI2 / 3.0), (i/n - 0.5) * 7.0, r * sin(t + s * PI2 / 3.0));
  }
  vec3 formGrid(float i, float n) {
      float side = ceil(sqrt(n));
      float x = (mod(i, side) / side - 0.5) * 7.0;
      float z = (floor(i / side) / side - 0.5) * 7.0;
      return vec3(x, sin(x * 1.2 + z * 0.8) * cos(z) * 0.6, z);
  }
  vec3 formTorus(float i, float n) {
      float t = i / n * PI2;
      float R = 2.2, r = 0.8 + hash(i * 2.9) * 0.2;
      return vec3((R + r * cos(3.0*t)) * cos(2.0*t), (R + r * cos(3.0*t)) * sin(2.0*t), r * sin(3.0*t));
  }
  vec3 formGalaxy(float i, float n) {
      float arm = floor(mod(i, 4.0));
      float t = i / n;
      float r = pow(t, 0.5) * 3.5;
      float a = t * 12.0 + arm * PI2 / 4.0;
      float sc = hash(i * 5.1) * 0.4;
      return vec3(r*cos(a)+(hash(i*2.3)-0.5)*sc, (hash(i*8.7)-0.5)*0.3, r*sin(a)+(hash(i*4.1)-0.5)*sc);
  }
  vec3 formVortex(float i, float n) {
      float t = i / n;
      float a = t * PI2 * 8.0;
      float r = (1.0 - t) * 3.5;
      return vec3(r * cos(a), (t - 0.5) * 5.0, r * sin(a));
  }
  vec3 getForm(float id, float i, float n) {
      if (id < 0.5) return formSphere(i, n);
      if (id < 1.5) return formHelix(i, n);
      if (id < 2.5) return formGrid(i, n);
      if (id < 3.5) return formTorus(i, n);
      if (id < 4.5) return formGalaxy(i, n);
      return formVortex(i, n);
  }

  void main() {
      vec3 posA = getForm(uFormA, aIndex, uCount);
      vec3 posB = getForm(uFormB, aIndex, uCount);
      float t = uMix * uMix * (3.0 - 2.0 * uMix);
      vec3 pos = mix(posA, posB, t);

      pos += vec3(sin(uTime*0.5+aPhase*PI2)*0.1, cos(uTime*0.4+aPhase*4.17)*0.1, sin(uTime*0.3+aPhase*5.03)*0.1);

      float vel = min(uScrollVel, 3.0);
      pos += vec3(sin(aPhase*20.0+uTime*2.0), cos(aPhase*15.0+uTime*1.5), sin(aPhase*25.0+uTime*1.8)) * vel * 0.06;

      vec3 diff = pos - uMouse;
      float dist = length(diff);
      if (dist < uMouseRadius && dist > 0.001) {
          float f = 1.0 - dist / uMouseRadius;
          pos += normalize(diff) * f * f * f * 1.0;
      }

      vColor = mix(uColorA, uColorB, t) * (0.7 + hash(aIndex * 7.3) * 0.3);
      if (dist < uMouseRadius) vColor += (1.0 - dist/uMouseRadius) * 0.2;

      // Center zone attenuation for headline legibility
      float centerDist = length(pos.xy * vec2(0.42, 0.7));
      float centerAttenuation = smoothstep(0.15, 2.2, centerDist);
      float centerAlphaFactor = mix(0.2, 1.0, centerAttenuation);
      float centerSizeFactor = mix(0.68, 1.0, centerAttenuation);

      vColor *= mix(0.55, 1.0, centerAttenuation);
      vAlpha = (0.28 + aSize * 0.12 + min(vel, 2.0) * 0.04) * centerAlphaFactor;

      vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = clamp(aSize * uPointSize * centerSizeFactor * (68.0 / -mv.z), 0.6, 18.0);
      gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT_SHADER = `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      float a = (1.0 - smoothstep(0.3, 0.5, d)) * vAlpha;
      gl_FragColor = vec4(vColor, a);
  }
`;

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ theme, scrollProgress }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const N = window.innerWidth < 769 ? 3000 : 5500;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 7);

    const scene = new THREE.Scene();

    const geo = new THREE.BufferGeometry();
    const idx = new Float32Array(N);
    const sizes = new Float32Array(N);
    const phases = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      idx[i] = i;
      sizes[i] = 0.4 + Math.random() * 1.0;
      phases[i] = Math.random();
    }
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    geo.setAttribute('aIndex', new THREE.BufferAttribute(idx, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const colorA = theme === 'dark' ? new THREE.Color(0.23, 0.51, 0.96) : new THREE.Color(0.15, 0.39, 0.92);
    const colorB = theme === 'dark' ? new THREE.Color(0.0, 0.72, 0.98) : new THREE.Color(0.2, 0.5, 0.85);

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uCount: { value: N },
        uFormA: { value: 0 },
        uFormB: { value: 0 },
        uMix: { value: 0 },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector3(100, 100, 100) },
        uMouseRadius: { value: 4.5 },
        uPointSize: { value: 0.95 },
        uColorA: { value: colorA },
        uColorB: { value: colorB },
        uScrollVel: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: theme === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending,
    });

    const points = new THREE.Points(geo, material);
    points.frustumCulled = false;
    scene.add(points);

    const mouseNDC = { x: -100, y: -100 };
    const mouse3D = new THREE.Vector3(100, 100, 100);
    const rayVec = new THREE.Vector3();
    const dirVec = new THREE.Vector3();

    const handleMouseMove = (e: MouseEvent) => {
      mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const keyframes = [
      { s: 0.00, f: 0, z: 7,   r: 0.23, g: 0.51, b: 0.96 },
      { s: 0.15, f: 1, z: 9,   r: 0.0,  g: 0.72, b: 0.98 },
      { s: 0.35, f: 2, z: 8,   r: 0.58, g: 0.64, b: 0.72 },
      { s: 0.55, f: 3, z: 7.5, r: 0.38, g: 0.35, b: 0.96 },
      { s: 0.75, f: 4, z: 10,  r: 0.15, g: 0.39, b: 0.92 },
      { s: 1.00, f: 5, z: 6,   r: 0.23, g: 0.51, b: 0.96 },
    ];

    let animationFrameId: number;

    const getState = (s: number) => {
      let i = 0;
      while (i < keyframes.length - 1 && keyframes[i + 1].s <= s) i++;
      const a = keyframes[i];
      const b = keyframes[Math.min(i + 1, keyframes.length - 1)];
      const range = b.s - a.s;
      const t = range > 0 ? Math.max(0, Math.min(1, (s - a.s) / range)) : 0;
      return {
        fA: a.f, fB: b.f, mix: a.f === b.f ? 0 : t,
        z: a.z + (b.z - a.z) * t,
        rA: a.r, gA: a.g, bA: a.b,
        rB: b.r, gB: b.g, bB: b.b,
      };
    };

    let targetCamZ = 7;

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      const time = performance.now() * 0.001;
      const state = getState(scrollProgress);

      material.uniforms.uFormA.value = state.fA;
      material.uniforms.uFormB.value = state.fB;
      material.uniforms.uMix.value = state.mix;
      material.uniforms.uTime.value = time;

      if (theme === 'dark') {
        material.uniforms.uColorA.value.setRGB(state.rA, state.gA, state.bA);
        material.uniforms.uColorB.value.setRGB(state.rB, state.gB, state.bB);
      } else {
        material.uniforms.uColorA.value.setRGB(state.rA * 0.6, state.gA * 0.6, state.bA * 0.6);
        material.uniforms.uColorB.value.setRGB(state.rB * 0.6, state.gB * 0.6, state.bB * 0.6);
      }

      // Unproject mouse NDC
      rayVec.set(mouseNDC.x, mouseNDC.y, 0.5).unproject(camera);
      dirVec.copy(rayVec).sub(camera.position).normalize();
      const dist = -camera.position.z / dirVec.z;
      mouse3D.copy(camera.position).addScaledVector(dirVec, dist);
      material.uniforms.uMouse.value.lerp(mouse3D, 0.05);

      // Camera motion & parallax
      targetCamZ += (state.z - targetCamZ) * 0.04;
      const mx = Math.max(-1, Math.min(1, mouseNDC.x));
      const my = Math.max(-1, Math.min(1, mouseNDC.y));
      camera.position.x += (mx * 0.35 - camera.position.x) * 0.02;
      camera.position.y += (my * 0.25 - camera.position.y) * 0.02;
      camera.position.z += (targetCamZ - camera.position.z) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      geo.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [theme, scrollProgress]);

  return (
    <div className="canvas-wrap">
      <canvas ref={canvasRef} />
    </div>
  );
};
