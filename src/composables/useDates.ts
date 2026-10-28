import { computed, onUnmounted, ref } from "vue";
import raw from "@/data/dates.json";

export interface ImportantDate {
  id: string;
  title: string;
  type: string;
  date?: string;
  month?: number;
  day?: number;
  repeat?: string;
  note?: string;
}

export interface UpcomingDate extends ImportantDate {
  month: number;
  day: number;
  next: Date;
  daysUntil: number;
  isToday: boolean;
}

function localMidnight(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

const all = (raw.dates as ImportantDate[]).filter((d) => d && d.title);

export function useDates() {
  const now = ref(Date.now());
  const timer = window.setInterval(() => {
    now.value = Date.now();
  }, 1000);
  onUnmounted(() => window.clearInterval(timer));

  const dates = computed<UpcomingDate[]>(() => {
    const today = new Date(now.value);
    const midnight = localMidnight(today);
    const year = today.getFullYear();
    return all
      .map((d) => {
        let month: number;
        let day: number;
        if (d.month && d.day) {
          month = d.month;
          day = d.day;
        } else if (d.date) {
          const p = d.date.split("-").map(Number);
          month = p[1];
          day = p[2];
        } else {
          month = 1;
          day = 1;
        }
        let next = new Date(year, month - 1, day);
        if (next < midnight) next = new Date(year + 1, month - 1, day);
        const daysUntil = Math.round((next.getTime() - midnight.getTime()) / 86_400_000);
        return { ...d, month, day, next, daysUntil, isToday: daysUntil === 0 };
      })
      .sort((a, b) => {
        if (a.isToday !== b.isToday) return a.isToday ? -1 : 1;
        return a.daysUntil - b.daysUntil;
      });
  });

  const nearest = computed(() => dates.value[0] ?? null);
  const todayOnes = computed(() => dates.value.filter((d) => d.isToday));

  const countdown = computed(() => {
    const n = nearest.value;
    if (!n) return null;
    const diff = Math.max(0, n.next.getTime() - now.value);
    const d = Math.floor(diff / 86_400_000);
    const h = Math.floor((diff % 86_400_000) / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1000);
    return { d, h, m, s };
  });

  return { dates, nearest, countdown, todayOnes };
}
