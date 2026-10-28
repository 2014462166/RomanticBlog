<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Icon } from "@iconify/vue";

interface Meta {
  title?: string;
  icon?: string;
  desc?: string;
}

const route = useRoute();
const meta = computed(() => (route.meta ?? {}) as Meta);
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-6 py-24 text-center">
    <div class="glass flex h-24 w-24 items-center justify-center rounded-3xl animate-float">
      <Icon :icon="meta.icon ?? 'ph:sparkle'" class="h-12 w-12 text-star-gold" />
    </div>
    <h2 class="font-display text-4xl text-gradient">{{ meta.title ?? "建设中" }}</h2>
    <p class="max-w-md px-4 text-white/60">{{ meta.desc ?? "这一页正在星空下搭建中，敬请期待 ✨" }}</p>
    <RouterLink to="/" class="glass rounded-full px-6 py-3 text-white/80 transition hover:text-star-gold">
      返回首页
    </RouterLink>
  </div>
</template>
