<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";
import { useSessionStorage } from "@vueuse/core";
import { useEntries } from "@/composables/useEntries";
import type { Entry } from "@/composables/useEntries";
import { moodEmoji } from "@/utils/mood";

const { entries } = useEntries();
const dismissed = useSessionStorage("rs-memory-dismissed-v1", false);
const visible = ref(false);
const current = ref<Entry | null>(null);
let timer = 0;

const firstImage = computed(() => current.value?.media?.find((m) => m.type === "image"));

function pick() {
  if (!entries.value.length) return;
  current.value = entries.value[Math.floor(Math.random() * entries.value.length)];
}

function show() {
  if (!dismissed.value && entries.value.length) {
    pick();
    visible.value = true;
  }
}

function again() {
  pick();
}

function close() {
  visible.value = false;
  dismissed.value = true;
}

onMounted(() => {
  timer = window.setTimeout(show, 1400);
});

onBeforeUnmount(() => window.clearTimeout(timer));
</script>

<template>
  <Teleport to="body">
    <Transition name="page">
      <div v-if="visible" class="fixed inset-0 z-[65] flex items-center justify-center bg-starry-950/70 p-6 backdrop-blur-sm">
        <div class="glass w-full max-w-lg rounded-3xl p-7 text-center">
          <p class="text-xs tracking-widest text-star-pink">💫 回忆胶囊 · 随机掉落</p>
          <h3 class="mt-3 font-display text-2xl text-gradient">
            <span v-if="current?.mood" class="mr-1">{{ moodEmoji(current.mood) }}</span>
            {{ current?.title }}
          </h3>
          <p class="mt-1 text-xs text-white/45">{{ current?.date }}</p>
          <img
            v-if="firstImage"
            :src="firstImage.thumb ?? firstImage.src"
            :alt="current?.title"
            class="mt-4 max-h-56 w-full rounded-2xl object-cover"
          />
          <p v-if="current?.content" class="mt-4 line-clamp-4 whitespace-pre-wrap text-sm leading-relaxed text-white/75">
            {{ current.content }}
          </p>
          <div class="mt-6 flex items-center justify-center gap-3">
            <button
              class="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm text-white/80 transition hover:border-star-gold/50 hover:text-star-gold"
              @click="again"
            >
              🔀 再换一个
            </button>
            <button
              class="rounded-full bg-gradient-to-r from-star-gold/90 via-star-pink/80 to-star-cyan/80 px-6 py-2.5 text-sm font-display text-starry-950 transition hover:brightness-110"
              @click="close"
            >
              收下这份回忆
            </button>
          </div>
          <button class="mt-4 text-xs text-white/35 underline-offset-2 hover:underline" @click="close">今天不再弹出</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
