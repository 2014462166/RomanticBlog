import { computed, ref, watch } from "vue";
import confetti from "canvas-confetti";
import { useAuth } from "@/composables/useAuth";
import { useDates } from "@/composables/useDates";

/**
 * 纪念日 / 生日当天：解锁后触发全屏爱心与星星彩带特效，并弹出庆祝横幅。
 * 每个会话只触发一次。
 */
export function useCelebrate() {
  const { unlocked } = useAuth();
  const { todayOnes } = useDates();
  const celebrateOnes = computed(() => todayOnes.value.filter((d) => d.type !== "节日"));
  const banner = ref<string | null>(null);
  let fired = false;

  function fire() {
    const heart = confetti.shapeFromText({ text: "💗", scalar: 2 });
    const star = confetti.shapeFromText({ text: "⭐", scalar: 2 });
    const colors = ["#f7d794", "#f9b8d6", "#8fd3ff", "#c3b1f7"];
    const base = {
      spread: 75,
      ticks: 220,
      gravity: 0.9,
      decay: 0.94,
      startVelocity: 42,
      colors,
      origin: { y: 0.65 },
      scalar: 1.1,
    };
    confetti({ ...base, particleCount: 60, shapes: [heart], angle: 60 });
    confetti({ ...base, particleCount: 60, shapes: [heart], angle: 120 });
    window.setTimeout(() => {
      confetti({ ...base, particleCount: 90, shapes: [star, "circle"], angle: 90, spread: 100 });
    }, 700);
    window.setTimeout(() => {
      confetti({ ...base, particleCount: 60, shapes: [heart], angle: 60 });
      confetti({ ...base, particleCount: 60, shapes: [heart], angle: 120 });
    }, 1400);
  }

  watch(
    [unlocked, celebrateOnes],
    ([u, ones]) => {
      if (u && ones.length && !fired) {
        fired = true;
        banner.value = `🎉 今天是「${ones[0].title}」！`;
        window.setTimeout(fire, 600);
        window.setTimeout(() => (banner.value = null), 9000);
      }
    },
    { immediate: true },
  );

  return { banner };
}
