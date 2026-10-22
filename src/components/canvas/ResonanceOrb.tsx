// Archivo: src/components/canvas/ResonanceOrb.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { ORB_VERTEX_SHADER, ORB_FRAGMENT_SHADER } from './orbShaders';

interface ResonanceOrbProps {
  audioLevel?: number;
  pulseActive?: boolean;
}

export const ResonanceOrb: React.FC<ResonanceOrbProps> = ({
  audioLevel = 0,
  pulseActive = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'high-performance' });
    if (!gl) return;

    const createShader = (glCtx: WebGLRenderingContext, type: number, source: string) => {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl, gl.VERTEX_SHADER, ORB_VERTEX_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, ORB_FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, 'position');
    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uAudio = gl.getUniformLocation(program, 'u_audio');
    const uPulse = gl.getUniformLocation(program, 'u_pulse');

    let animId: number;
    const startTime = performance.now();

    const render = () => {
      const now = performance.now();
      const elapsed = (now - startTime) * 0.001;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayW = Math.floor(canvas.clientWidth * dpr);
      const displayH = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== displayW || canvas.height !== displayH) {
        canvas.width = displayW;
        canvas.height = displayH;
        gl.viewport(0, 0, displayW, displayH);
      }

      gl.useProgram(program);
      gl.enableVertexAttribArray(posAttr);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uAudio, audioLevel);
      gl.uniform1f(uPulse, pulseActive ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [audioLevel, pulseActive]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-neutral-950">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default ResonanceOrb;
