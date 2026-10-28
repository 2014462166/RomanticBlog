import { computed, onUnmounted, ref } from "vue";
import config from "@/data/config.json";

export function useDaysTogether() {
  const start = new Date(`${config.togetherSince}T00:00:00`).getTime();
  const now = ref(Date.now());
  const timer = window.setInterval(() => {
    now.value = Date.now();
  }, 1000);
  onUnmounted(() => window.clearInterval(timer));

  const days = computed(() => Math.max(0, Math.floor((now.value - start) / 86_400_000)));
  const hms = computed(() => {
    const diff = Math.max(0, Math.floor((now.value - start) / 1000));
    const h = Math.floor((diff % 86_400) / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    return { h, m, s };
  });
  const sinceText = computed(() => config.togetherSince.replaceAll("-", "."));

  return { days, hms, sinceText };
}
