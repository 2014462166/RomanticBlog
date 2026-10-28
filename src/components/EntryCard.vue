<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import type { Entry } from "@/composables/useEntries";
import { moodEmoji } from "@/utils/mood";

const props = defineProps<{ entry: Entry }>();

const images = computed(() => (props.entry.media ?? []).filter((m) => m.type === "image"));
const videos = computed(() => (props.entry.media ?? []).filter((m) => m.type === "video"));
const gridClass = computed(() => (images.value.length === 1 ? "grid-cols-1" : "grid-cols-2"));
</script>

<template>
  <article class="glass rounded-3xl p-6">
    <header class="flex flex-wrap items-start justify-between gap-2">
      <h3 class="font-display text-xl text-white/95">
        <span v-if="entry.mood" class="mr-1">{{ moodEmoji(entry.mood) }}</span>
        {{ entry.title }}
      </h3>
      <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-star-cyan">{{ entry.date }}</span>
    </header>

    <p v-if="entry.location" class="mt-2 flex items-center gap-1 text-xs text-white/45">
      <Icon icon="ph:map-pin" class="h-3.5 w-3.5" />
      {{ entry.location }}
    </p>

    <p v-if="entry.content" class="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/80 line-clamp-6">
      {{ entry.content }}
    </p>

    <div v-if="entry.tags?.length" class="mt-3 flex flex-wrap gap-2">
      <span
        v-for="t in entry.tags"
        :key="t"
        class="rounded-full bg-star-pink/10 px-3 py-1 text-xs text-star-pink"
      >
        #{{ t }}
      </span>
    </div>

    <div v-if="images.length" class="mt-4 grid gap-3" :class="gridClass">
      <img
        v-for="m in images"
        :key="m.src"
        :src="m.thumb ?? m.src"
        :alt="entry.title"
        loading="lazy"
        class="w-full rounded-2xl object-cover"
        :class="images.length === 1 ? 'aspect-[4/3]' : 'aspect-square'"
      />
    </div>

    <div v-if="videos.length" class="mt-4 space-y-3">
      <video
        v-for="m in videos"
        :key="m.src"
        :src="m.src"
        :poster="m.poster"
        controls
        playsinline
        preload="none"
        class="aspect-video w-full rounded-2xl bg-black/40"
      ></video>
    </div>
  </article>
</template>
