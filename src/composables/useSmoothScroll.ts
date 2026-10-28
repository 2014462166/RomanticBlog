import { onBeforeUnmount, onMounted } from "vue";
import Lenis from "lenis";

export function useSmoothScroll() {
  let lenis: Lenis | null = null;
  let raf = 0;

  onMounted(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ lerp: 0.09 });
    const loop = (time: number) => {
      lenis?.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  });

  onBeforeUnmount(() => {
    cancelAnimationFrame(raf);
    lenis?.destroy();
  });
}
