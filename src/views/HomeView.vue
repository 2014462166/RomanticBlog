<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";
import gsap from "gsap";
import config from "@/data/config.json";
import quotes from "@/data/quotes.json";
import { useDaysTogether } from "@/composables/useDaysTogether";
import { useDates } from "@/composables/useDates";
import RandomMemory from "@/components/RandomMemory.vue";

const { days, hms, sinceText } = useDaysTogether();
const { nearest } = useDates();
const displayDays = ref(0);
const quoteText = ref("");
let qi = 0;
const timers: number[] = [];

const features = [
  { to: "/calendar", icon: "ph:calendar-heart", title: "日历回忆", desc: "点开任意一天，重温那天发生的事" },
  { to: "/diary", icon: "ph:notebook", title: "日记", desc: "按时间回看我们的每一条记录" },
  { to: "/album", icon: "ph:images", title: "相册", desc: "我们拍下的每一帧美好" },
  { to: "/videos", icon: "ph:video-camera", title: "视频", desc: "会动的回忆，都在这里" },
  { to: "/dates", icon: "ph:gift", title: "重要日子", desc: "纪念日与节日，一个都不错过" },
  { to: "/story", icon: "ph:book-open-text", title: "我们的故事", desc: "从相遇到现在的每一步" },
  { to: "/letters", icon: "ph:envelope-open", title: "情书", desc: "写给彼此的手写信" },
  { to: "/wishes", icon: "ph:list-checks", title: "心愿清单", desc: "一起要做的事，慢慢完成" },
  { to: "/map", icon: "ph:map-trifold", title: "足迹地图", desc: "一起去过的地方与故事" },
  { to: "/capsule", icon: "ph:clock-clockwise", title: "时间胶囊", desc: "给未来的我们留一封信" },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function typeLoop() {
  const current = quotes.quotes[qi % quotes.quotes.length];
  let i = 0;
  const type = () => {
    if (i <= current.length) {
      quoteText.value = current.slice(0, i);
      i++;
      timers.push(window.setTimeout(type, 90));
    } else {
      timers.push(window.setTimeout(erase, 3200));
    }
  };
  const erase = () => {
    if (i >= 0) {
      quoteText.value = current.slice(0, i);
      i--;
      timers.push(window.setTimeout(erase, 36));
    } else {
      qi++;
      timers.push(window.setTimeout(typeLoop, 500));
    }
  };
  type();
}

onMounted(() => {
  gsap.to(".reveal", {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.09,
    ease: "power3.out",
    delay: 0.05,
  });
  const counter = { v: 0 };
  gsap.to(counter, {
    v: days.value,
    duration: 1.8,
    ease: "power2.out",
    onUpdate: () => {
      displayDays.value = Math.floor(counter.v);
    },
  });
  typeLoop();
});

onBeforeUnmount(() => timers.forEach((t) => window.clearTimeout(t)));
</script>

<template>
  <div class="space-y-8 pb-10">
    <section class="reveal pt-10 text-center sm:pt-16">
      <p class="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm text-white/70">
        💞 欢迎回来，我的小星星
      </p>
      <h1 class="font-display text-5xl leading-tight text-gradient sm:text-6xl">{{ config.siteName }}</h1>
      <p class="mt-3 text-white/60">记录我们之间的点点滴滴 · 属于我们两个人的星空</p>
    </section>

    <section class="reveal glass rounded-3xl p-8 text-center">
      <p class="text-sm tracking-widest text-star-cyan">我们已经在一起</p>
      <p class="mt-2 font-display text-6xl text-gradient sm:text-7xl">
        {{ displayDays }}<span class="text-3xl"> 天</span>
      </p>
      <p class="mt-2 font-mono text-white/70">
        {{ pad(hms.h) }} : {{ pad(hms.m) }} : {{ pad(hms.s) }}
      </p>
      <p class="mt-3 text-xs text-white/40">自 {{ sinceText }} 起，每一天都算数 💫</p>
    </section>

    <section v-if="nearest" class="reveal">
      <RouterLink
        to="/dates"
        class="glass flex items-center justify-between gap-4 rounded-3xl p-6 transition duration-300 hover:-translate-y-1.5 hover:border-star-gold/40"
      >
        <div class="min-w-0">
          <p class="text-sm text-star-pink">🎁 最近的重要日子</p>
          <p class="mt-1 truncate font-display text-2xl text-white/95">「{{ nearest.title }}」</p>
          <p class="mt-1 text-xs text-white/45">
            {{ nearest.next.getFullYear() }}-{{ String(nearest.next.getMonth() + 1).padStart(2, "0") }}-{{
              String(nearest.next.getDate()).padStart(2, "0")
            }}
            · {{ nearest.type }}
          </p>
        </div>
        <div class="shrink-0 text-center">
          <p class="font-display text-5xl text-gradient">{{ nearest.isToday ? "🎉" : nearest.daysUntil }}</p>
          <p class="text-xs text-white/45">{{ nearest.isToday ? "就是今天" : "天后" }}</p>
        </div>
      </RouterLink>
    </section>

    <section class="reveal glass rounded-3xl p-6">
      <p class="mb-2 flex items-center gap-2 text-sm text-star-pink">💌 今日情话</p>
      <p class="min-h-[3.5rem] font-hand text-xl leading-relaxed text-white/90 sm:text-2xl">
        {{ quoteText }}<span class="animate-pulse-soft text-star-gold">▍</span>
      </p>
    </section>

    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        v-for="f in features"
        :key="f.to"
        :to="f.to"
        class="reveal group glass rounded-3xl p-6 transition duration-300 hover:-translate-y-1.5 hover:border-star-gold/40 hover:shadow-[0_12px_40px_rgba(247,215,148,0.15)]"
      >
        <div
          class="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-starry-700 to-starry-900 text-star-gold transition group-hover:scale-110"
        >
          <Icon :icon="f.icon" class="h-6 w-6" />
        </div>
        <h3 class="font-display text-xl text-white/95">{{ f.title }}</h3>
        <p class="mt-1.5 text-sm leading-relaxed text-white/55">{{ f.desc }}</p>
      </RouterLink>
    </section>

    <footer class="reveal pt-4 text-center text-xs text-white/35">
      Made with 💜 for us · {{ config.siteName }} · {{ new Date().getFullYear() }}
    </footer>

    <RandomMemory />
  </div>
</template>
