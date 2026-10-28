<script setup lang="ts">
import { computed, ref } from "vue";
import { Icon } from "@iconify/vue";
import EntryCard from "@/components/EntryCard.vue";
import { useEntries } from "@/composables/useEntries";
import type { Entry } from "@/composables/useEntries";

const { entries, tags } = useEntries();
const activeTag = ref<string | null>(null);

const filtered = computed(() =>
  activeTag.value ? entries.value.filter((e) => e.tags?.includes(activeTag.value as string)) : entries.value,
);

const groups = computed(() => {
  const map = new Map<string, Entry[]>();
  for (const e of filtered.value) {
    const arr = map.get(e.date) ?? [];
    arr.push(e);
    map.set(e.date, arr);
  }
  return Array.from(map.entries());
});
</script>

<template>
  <div class="space-y-6 pb-10">
    <header class="text-center">
      <h2 class="font-display text-3xl text-gradient sm:text-4xl">我们的日记</h2>
      <p class="mt-2 text-sm text-white/50">共 {{ entries.length }} 条记录 · {{ tags.length }} 个标签</p>
    </header>

    <div v-if="tags.length" class="flex flex-wrap justify-center gap-2">
      <button
        class="rounded-full border px-4 py-1.5 text-sm transition"
        :class="
          activeTag === null
            ? 'border-star-gold/60 bg-star-gold/10 text-star-gold'
            : 'border-white/10 bg-white/5 text-white/60 hover:text-white/90'
        "
        @click="activeTag = null"
      >
        全部
      </button>
      <button
        v-for="t in tags"
        :key="t"
        class="rounded-full border px-4 py-1.5 text-sm transition"
        :class="
          activeTag === t
            ? 'border-star-gold/60 bg-star-gold/10 text-star-gold'
            : 'border-white/10 bg-white/5 text-white/60 hover:text-white/90'
        "
        @click="activeTag = t"
      >
        #{{ t }}
      </button>
    </div>

    <div v-if="groups.length" class="space-y-8">
      <section v-for="[date, list] in groups" :key="date">
        <h3 class="mb-3 flex items-center gap-2 text-sm text-star-cyan">
          <Icon icon="ph:calendar-blank" class="h-4 w-4" />
          {{ date }} · {{ list.length }} 条
        </h3>
        <div class="space-y-4">
          <EntryCard v-for="e in list" :key="e.id" :entry="e" />
        </div>
      </section>
    </div>
    <div v-else class="glass rounded-3xl p-12 text-center text-white/45">
      还没有{{ activeTag ? "该标签的" : "" }}记录 📖<br />
      <span class="text-xs text-white/30">用 npm run new:diary 添加第一条吧</span>
    </div>
  </div>
</template>
