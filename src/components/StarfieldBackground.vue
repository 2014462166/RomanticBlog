<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";

interface Star {
  x: number;
  y: number;
  r: number;
  base: number;
  speed: number;
  phase: number;
  vy: number;
}

interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

const canvasRef = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let raf = 0;
let meteorTimer = 0;
let stars: Star[] = [];
const meteors: Meteor[] = [];
let reduced = false;

function initStars() {
  const count = Math.min(240, Math.floor((window.innerWidth * window.innerHeight) / 7000));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 0.3 + Math.random() * 1.1,
    base: 0.25 + Math.random() * 0.6,
    speed: 0.4 + Math.random() * 1.6,
    phase: Math.random() * Math.PI * 2,
    vy: 0.005 + Math.random() * 0.02,
  }));
}

function resize() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
  initStars();
}

function spawnMeteor() {
  if (reduced) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const angle = Math.PI * (0.18 + Math.random() * 0.12);
  const speed = 7 + Math.random() * 6;
  meteors.push({
    x: w * (0.15 + Math.random() * 0.7),
    y: h * Math.random() * 0.3,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 0,
    maxLife: 60 + Math.random() * 40,
  });
}

function draw(t: number) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (!ctx) return;
  ctx.clearRect(0, 0, w, h);

  for (const s of stars) {
    const tw = reduced ? 1 : 0.55 + 0.45 * Math.sin(t * 0.001 * s.speed + s.phase);
    const alpha = s.base * tw;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(226,232,255,${alpha.toFixed(3)})`;
    ctx.fill();
    if (!reduced) {
      s.y += s.vy;
      if (s.y > h + 2) {
        s.y = -2;
        s.x = Math.random() * w;
      }
    }
  }

  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i];
    m.life++;
    m.x += m.vx;
    m.y += m.vy;
    const alpha = Math.sin(Math.PI * Math.min(m.life / m.maxLife, 1));
    const grad = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 6, m.y - m.vy * 6);
    grad.addColorStop(0, `rgba(247,215,148,${(alpha * 0.9).toFixed(3)})`);
    grad.addColorStop(1, "rgba(247,215,148,0)");
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(m.x - m.vx * 6, m.y - m.vy * 6);
    ctx.stroke();
    if (m.life >= m.maxLife || m.x > w + 40 || m.y > h + 40) meteors.splice(i, 1);
  }

  raf = requestAnimationFrame(draw);
}

onMounted(() => {
  reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  ctx = canvasRef.value?.getContext("2d") ?? null;
  resize();
  window.addEventListener("resize", resize);
  raf = requestAnimationFrame(draw);
  if (!reduced) {
    meteorTimer = window.setInterval(() => {
      if (meteors.length < 3 && Math.random() < 0.6) spawnMeteor();
    }, 2600);
  }
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  window.clearInterval(meteorTimer);
  window.removeEventListener("resize", resize);
});
</script>

<template>
  <canvas ref="canvasRef" class="pointer-events-none fixed inset-0 z-0" aria-hidden="true"></canvas>
</template>
