<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  char: string;
  rot: number;
  spin: number;
}

const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let raf = 0;
let last = 0;
const parts: Particle[] = [];
let enabled = false;
const glyphs = ["💗", "💜", "💙", "💛", "🤍"];

function onMove(e: PointerEvent) {
  const now = performance.now();
  if (now - last < 110) return;
  last = now;
  if (parts.length > 70) parts.shift();
  parts.push({
    x: e.clientX,
    y: e.clientY,
    vx: (Math.random() - 0.5) * 0.8,
    vy: -0.6 - Math.random() * 1.1,
    size: 12 + Math.random() * 10,
    alpha: 0.9,
    char: glyphs[Math.floor(Math.random() * glyphs.length)],
    rot: (Math.random() - 0.5) * 0.6,
    spin: (Math.random() - 0.5) * 0.05,
  });
}

function resize() {
  const c = canvasRef.value;
  if (!c) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  c.width = window.innerWidth * dpr;
  c.height = window.innerHeight * dpr;
  c.style.width = `${window.innerWidth}px`;
  c.style.height = `${window.innerHeight}px`;
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function draw() {
  if (!ctx) {
    raf = requestAnimationFrame(draw);
    return;
  }
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.spin;
    p.alpha -= 0.018;
    if (p.alpha <= 0) {
      parts.splice(i, 1);
      continue;
    }
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(p.alpha, 0);
    ctx.font = `${p.size}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(p.char, 0, 0);
    ctx.restore();
  }
  raf = requestAnimationFrame(draw);
}

onMounted(() => {
  enabled =
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!enabled) return;
  ctx = canvasRef.value?.getContext("2d") ?? null;
  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", onMove);
  raf = requestAnimationFrame(draw);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  window.removeEventListener("resize", resize);
  window.removeEventListener("pointermove", onMove);
});
</script>

<template>
  <canvas ref="canvasRef" class="pointer-events-none fixed inset-0 z-[70]" aria-hidden="true"></canvas>
</template>
