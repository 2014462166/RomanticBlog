<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { useEntries } from "@/composables/useEntries";
import type { MediaItem, Entry } from "@/composables/useEntries";

interface GalleryVideo extends MediaItem {
  entry: Entry;
}

const { videos } = useEntries();
const containerRef = ref<HTMLElement | null>(null);
let players: Plyr[] = [];

onMounted(() => {
  if (!containerRef.value) return;
  const els = Array.from(containerRef.value.querySelectorAll("video"));
  players = els.map(
    (el) =>
      new Plyr(el as HTMLVideoElement, {
        controls: ["play", "progress", "current-time", "mute", "volume", "fullscreen"],
      }),
  );
});

onBeforeUnmount(() => {
  players.forEach((p) => p.destroy());
  players = [];
});
</script>

<template>
  <div class="space-y-6 pb-10">
    <header class="text-center">
      <h2 class="font-display text-3xl text-gradient sm:text-4xl">视频集</h2>
      <p class="mt-2 text-sm text-white/50">会动的回忆，都在这里 · 共 {{ videos.length }} 段</p>
    </header>

    <div v-if="videos.length" ref="containerRef" class="grid grid-cols-1 gap-5 md:grid-cols-2">
      <figure v-for="v in videos" :key="v.src" class="glass overflow-hidden rounded-3xl p-3">
        <video
          :src="v.src"
          :data-poster="v.poster"
          playsinline
          preload="none"
          class="aspect-video w-full rounded-2xl bg-black/40"
        ></video>
        <figcaption class="flex items-center justify-between gap-2 px-2 pb-1.5 pt-3">
          <span class="truncate font-display text-white/90">{{ v.entry.title }}</span>
          <span class="shrink-0 text-xs text-star-cyan">{{ v.entry.date }}</span>
        </figcaption>
      </figure>
    </div>

    <div v-else class="glass flex flex-col items-center gap-3 rounded-3xl p-12 text-center text-white/45">
      <Icon icon="ph:video-camera" class="h-10 w-10 text-star-gold/60" />
      还没有视频记录 📹
      <span class="text-xs text-white/30">期待第一个一起拍的小视频</span>
    </div>
  </div>
</template>
