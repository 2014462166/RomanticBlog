<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import { useLocalStorage } from "@vueuse/core";
import confetti from "canvas-confetti";
import wishes from "@/data/wishes.json";

const doneMap = useLocalStorage<Record<string, boolean>>("rs-wishes-done-v1", {});
const celebrated = ref(false);

const doneCount = computed(() => wishes.wishes.filter((w) => doneMap.value[w.id]).length);
const total = wishes.wishes.length;
const percent = computed(() => (total ? Math.round((doneCount.value / total) * 100) : 0));
const allDone = computed(() => total > 0 && doneCount.value === total);

function toggle(id: string) {
  doneMap.value = { ...doneMap.value, [id]: !doneMap.value[id] };
}

watch(allDone, (v) => {
  if (v && !celebrated.value) {
    celebrated.value = true;
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.65 }, colors: ["#f7d794", "#f9b8d6", "#8fd3ff"] });
  }
});
</script>

<template>
  <div class="space-y-6 pb-10">
    <header class="text-center">
      <h2 class="font-display text-3xl text-gradient sm:text-4xl">心愿清单</h2>
      <p class="mt-2 text-sm text-white/50">一起要做的事，慢慢打勾完成</p>
    </header>

    <section v-if="total" class="glass rounded-3xl p-6">
      <div class="flex items-center justify-between text-sm text-white/70">
        <span>已完成 {{ doneCount }} / {{ total }}</span>
        <span class="text-star-gold">{{ percent }}%</span>
      </div>
      <div class="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
        <div
          class="h-full rounded-full bg-gradient-to-r from-star-gold via-star-pink to-star-cyan transition-all duration-500"
          :style="{ width: percent + '%' }"
        ></div>
      </div>
    </section>

    <div v-if="total" class="space-y-3">
      <button
        v-for="w in wishes.wishes"
        :key="w.id"
        class="glass flex w-full items-start gap-4 rounded-3xl p-5 text-left transition duration-300 hover:border-star-gold/30"
        @click="toggle(w.id)"
      >
        <span
          class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm transition"
          :class="doneMap[w.id] ? 'border-star-gold bg-star-gold text-starry-950' : 'border-white/25 text-transparent'"
        >
          <Icon icon="ph:check" class="h-4 w-4" />
        </span>
        <span class="min-w-0">
          <span class="block font-display text-lg transition" :class="doneMap[w.id] ? 'text-white/40 line-through' : 'text-white/95'">
            {{ w.title }}
          </span>
          <span v-if="w.note" class="mt-1 block text-xs text-white/45">{{ w.note }}</span>
        </span>
      </button>
      <p v-if="allDone" class="text-center font-display text-lg text-star-gold animate-float">
        🎉 全部心愿都实现啦！
      </p>
    </div>

    <div v-else class="glass flex flex-col items-center gap-3 rounded-3xl p-12 text-center text-white/45">
      <Icon icon="ph:list-checks" class="h-10 w-10 text-star-gold/60" />
      还没有心愿 ✨
      <span class="text-xs text-white/30">编辑 src/data/wishes.json 写下你们想一起做的事</span>
    </div>
  </div>
</template>
