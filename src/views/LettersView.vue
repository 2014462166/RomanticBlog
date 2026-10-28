<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import letters from "@/data/letters.json";

const expanded = ref<string | null>(null);

function toggle(id: string) {
  expanded.value = expanded.value === id ? null : id;
}
</script>

<template>
  <div class="space-y-6 pb-10">
    <header class="text-center">
      <h2 class="font-display text-3xl text-gradient sm:text-4xl">手写情书</h2>
      <p class="mt-2 text-sm text-white/50">写给彼此的信，字字都是真心</p>
    </header>

    <div v-if="letters.letters.length" class="space-y-4">
      <article
        v-for="l in letters.letters"
        :key="l.id"
        class="glass cursor-pointer rounded-3xl p-6 transition duration-300 hover:border-star-gold/30"
        @click="toggle(l.id)"
      >
        <header class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-star-pink/10 text-lg">💌</span>
            <div>
              <h3 class="font-display text-xl text-white/95">{{ l.title }}</h3>
              <p class="text-xs text-white/45">{{ l.date }}</p>
            </div>
          </div>
          <Icon
            :icon="expanded === l.id ? 'ph:caret-up' : 'ph:caret-down'"
            class="h-5 w-5 shrink-0 text-white/50"
          />
        </header>
        <p
          v-if="expanded !== l.id"
          class="mt-4 line-clamp-2 text-sm leading-relaxed text-white/60"
        >
          {{ l.content }}
        </p>
        <div v-else class="mt-5 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p class="whitespace-pre-wrap font-hand text-lg leading-loose text-white/90">{{ l.content }}</p>
        </div>
      </article>
    </div>

    <div v-else class="glass flex flex-col items-center gap-3 rounded-3xl p-12 text-center text-white/45">
      <Icon icon="ph:envelope-open" class="h-10 w-10 text-star-gold/60" />
      还没有情书 💌
      <span class="text-xs text-white/30">编辑 src/data/letters.json 写下你的信</span>
    </div>
  </div>
</template>
