<script setup lang="ts">
import { nextTick, ref } from "vue";
import { Icon } from "@iconify/vue";
import APlayer from "aplayer";
import "aplayer/dist/APlayer.min.css";
import music from "@/data/music.json";

const open = ref(false);
const containerRef = ref<HTMLElement | null>(null);
let player: APlayer | null = null;

async function toggle() {
  open.value = !open.value;
  if (open.value && !player) {
    await nextTick();
    player = new APlayer({
      container: containerRef.value as HTMLElement,
      fixed: false,
      autoplay: false,
      theme: "#f7d794",
      preload: "none",
      mutex: true,
      listFolded: true,
      listMaxHeight: "200px",
      audio: music.music,
    });
  }
}
</script>

<template>
  <div class="fixed bottom-5 right-5 z-[45] flex flex-col items-end gap-3">
    <Transition name="page">
      <div v-show="open" class="glass w-72 rounded-3xl p-3 sm:w-80">
        <div ref="containerRef"></div>
      </div>
    </Transition>
    <button
      class="glass flex h-12 w-12 items-center justify-center rounded-full text-star-gold transition hover:scale-105 active:scale-95"
      :title="open ? '收起音乐盒' : '音乐盒'"
      @click="toggle"
    >
      <Icon :icon="open ? 'ph:x' : 'ph:music-notes'" class="h-5 w-5" />
    </button>
  </div>
</template>
