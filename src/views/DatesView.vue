<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useDates } from "@/composables/useDates";
import type { UpcomingDate } from "@/composables/useDates";

const { dates, nearest, countdown } = useDates();

const TYPE_STYLES: Record<string, string> = {
  纪念日: "bg-star-gold/15 text-star-gold",
  生日: "bg-star-pink/15 text-star-pink",
  节日: "bg-star-cyan/15 text-star-cyan",
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function dateStr(d: UpcomingDate) {
  return `${d.next.getFullYear()}-${pad(d.next.getMonth() + 1)}-${pad(d.next.getDate())}`;
}

function badgeText(d: UpcomingDate) {
  return d.isToday ? "就是今天 🎉" : `还有 ${d.daysUntil} 天`;
}
</script>

<template>
  <div class="space-y-6 pb-10">
    <header class="text-center">
      <h2 class="font-display text-3xl text-gradient sm:text-4xl">重要日子</h2>
      <p class="mt-2 text-sm text-white/50">每一个值得纪念的日子，我们都不错过</p>
    </header>

    <section v-if="nearest" class="glass rounded-3xl border-star-gold/20 p-8 text-center">
      <p class="text-sm tracking-widest text-star-cyan">
        {{ nearest.isToday ? "🎉 今天就是" : "距离" }}
      </p>
      <h3 class="mt-2 font-display text-3xl text-gradient">「{{ nearest.title }}」</h3>
      <p v-if="nearest.isToday" class="mt-3 font-display text-6xl text-gradient animate-float">🎉</p>
      <template v-else>
        <p class="mt-3 font-display text-7xl text-gradient">{{ countdown?.d ?? nearest.daysUntil }}</p>
        <p class="mt-1 text-sm text-white/60">天</p>
        <p class="mt-2 font-mono text-lg text-white/70">
          {{ pad(countdown?.h ?? 0) }} : {{ pad(countdown?.m ?? 0) }} : {{ pad(countdown?.s ?? 0) }}
        </p>
      </template>
      <p class="mt-3 text-xs text-white/40">{{ dateStr(nearest) }} · {{ nearest.type }}</p>
      <p v-if="nearest.note" class="mt-1 text-xs text-white/35">{{ nearest.note }}</p>
    </section>

    <section v-if="dates.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="d in dates"
        :key="d.id"
        class="glass rounded-3xl p-6 transition duration-300 hover:-translate-y-1.5"
        :class="d.isToday ? 'border-star-gold/50 shadow-[0_12px_40px_rgba(247,215,148,0.2)]' : ''"
      >
        <div class="flex items-center justify-between">
          <span class="rounded-full px-3 py-1 text-xs" :class="TYPE_STYLES[d.type] ?? 'bg-star-lavender/15 text-star-lavender'">
            {{ d.type }}
          </span>
          <Icon
            v-if="d.isToday"
            icon="ph:sparkle"
            class="h-5 w-5 text-star-gold animate-pulse-soft"
          />
        </div>
        <h4 class="mt-3 font-display text-xl text-white/95">{{ d.title }}</h4>
        <p class="mt-1 text-xs text-white/45">{{ dateStr(d) }}</p>
        <p
          class="mt-3 inline-block rounded-full px-4 py-1.5 text-sm"
          :class="d.isToday ? 'bg-star-gold/20 text-star-gold' : 'bg-white/5 text-white/70'"
        >
          {{ badgeText(d) }}
        </p>
        <p v-if="d.note" class="mt-3 text-xs leading-relaxed text-white/40">{{ d.note }}</p>
      </div>
    </section>

    <div v-else class="glass flex flex-col items-center gap-3 rounded-3xl p-12 text-center text-white/45">
      <Icon icon="ph:gift" class="h-10 w-10 text-star-gold/60" />
      还没有添加重要日子 🎁
      <span class="text-xs text-white/30">编辑 src/data/dates.json 添加纪念日、生日与节日</span>
    </div>
  </div>
</template>
