<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import capsule from "@/data/capsule.json";

function localDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const today = localDateStr(new Date());

const items = computed(() =>
  capsule.capsules
    .map((c) => {
      const unlocked = c.unlockDate <= today;
      const diff = new Date(`${c.unlockDate}T00:00:00`).getTime() - new Date(`${today}T00:00:00`).getTime();
      const daysUntil = Math.max(0, Math.round(diff / 86_400_000));
      return { ...c, unlocked, daysUntil };
    })
    .sort((a, b) => Number(a.unlocked) - Number(b.unlocked) || a.unlockDate.localeCompare(b.unlockDate)),
);
</script>

<template>
  <div class="space-y-6 pb-10">
    <header class="text-center">
      <h2 class="font-display text-3xl text-gradient sm:text-4xl">时间胶囊</h2>
      <p class="mt-2 text-sm text-white/50">给未来某天的我们留一封信，到时间才能打开</p>
    </header>

    <div v-if="items.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <article
        v-for="c in items"
        :key="c.id"
        class="glass rounded-3xl p-6 transition duration-300 hover:-translate-y-1.5"
        :class="c.unlocked ? 'border-star-gold/30' : 'border-white/10'"
      >
        <div class="flex items-center justify-between">
          <span
            class="rounded-full px-3 py-1 text-xs"
            :class="c.unlocked ? 'bg-star-gold/15 text-star-gold' : 'bg-white/5 text-white/50'"
          >
            {{ c.unlocked ? "已解锁 🎁" : `🔒 还有 ${c.daysUntil} 天解锁` }}
          </span>
          <span class="text-xs text-white/40">{{ c.unlockDate }}</span>
        </div>
        <h3 class="mt-3 font-display text-xl" :class="c.unlocked ? 'text-white/95' : 'select-none text-white/50 blur-sm'">
          {{ c.title }}
        </h3>
        <p v-if="c.unlocked" class="mt-4 whitespace-pre-wrap font-hand text-lg leading-loose text-white/90">
          {{ c.content }}
        </p>
        <p v-else class="mt-4 text-sm leading-relaxed text-white/30">
          ✉️ 这封信还在时光里沉睡，等到 {{ c.unlockDate }} 就可以打开……
        </p>
        <p v-if="c.unlocked" class="mt-3 text-xs text-white/40">封存于 {{ c.date }}</p>
      </article>
    </div>

    <div v-else class="glass flex flex-col items-center gap-3 rounded-3xl p-12 text-center text-white/45">
      <Icon icon="ph:clock-clockwise" class="h-10 w-10 text-star-gold/60" />
      还没有时间胶囊 ⏳
      <span class="text-xs text-white/30">编辑 src/data/capsule.json 给未来写封信</span>
    </div>
  </div>
</template>
