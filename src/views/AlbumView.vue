<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";
import lightGallery from "lightgallery";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import "lightgallery/css/lightgallery-bundle.css";
import { useEntries } from "@/composables/useEntries";
import type { MediaItem, Entry } from "@/composables/useEntries";

interface GalleryImage extends MediaItem {
  entry: Entry;
}

const { images } = useEntries();
const galleryRef = ref<HTMLElement | null>(null);
let lg: ReturnType<typeof lightGallery> | null = null;

function caption(img: GalleryImage): string {
  const parts = [img.entry.title, img.entry.date];
  if (img.entry.location) parts.push(img.entry.location);
  return `<h4>${parts[0]}</h4><p>${parts.slice(1).join(" · ")}</p>`;
}

onMounted(() => {
  if (!galleryRef.value) return;
  lg = lightGallery(galleryRef.value, {
    selector: "a[data-src]",
    plugins: [lgZoom, lgThumbnail, lgFullscreen],
    download: false,
    speed: 400,
    hideBarsDelay: 2500,
  });
});

onBeforeUnmount(() => {
  lg?.destroy();
});
</script>

<template>
  <div class="space-y-6 pb-10">
    <header class="text-center">
      <h2 class="font-display text-3xl text-gradient sm:text-4xl">我们的相册</h2>
      <p class="mt-2 text-sm text-white/50">共 {{ images.length }} 张照片 · 点击放大浏览</p>
    </header>

    <div v-if="images.length" ref="galleryRef" class="columns-1 gap-4 sm:columns-2 lg:columns-3">
      <a
        v-for="img in images"
        :key="img.src"
        :data-src="img.src"
        :data-sub-html="caption(img)"
        class="group relative mb-4 block break-inside-avoid overflow-hidden rounded-3xl border border-white/10"
      >
        <img
          :src="img.thumb ?? img.src"
          :alt="img.entry.title"
          loading="lazy"
          class="w-full transition duration-500 group-hover:scale-105"
        />
        <div
          class="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-starry-950/70 via-transparent to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100"
        >
          <div>
            <p class="font-display text-white/95">{{ img.entry.title }}</p>
            <p class="text-xs text-white/60">{{ img.entry.date }}</p>
          </div>
        </div>
      </a>
    </div>

    <div v-else class="glass flex flex-col items-center gap-3 rounded-3xl p-12 text-center text-white/45">
      <Icon icon="ph:images" class="h-10 w-10 text-star-gold/60" />
      相册还是空的 📷
      <span class="text-xs text-white/30">把照片放到 public/m_b86324cdcc/photos/ 并在记录里引用</span>
    </div>
  </div>
</template>
