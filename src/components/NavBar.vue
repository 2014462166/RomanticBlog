<script setup lang="ts">
import { Icon } from "@iconify/vue";
import config from "@/data/config.json";
import { useAuth } from "@/composables/useAuth";

const { lock } = useAuth();

const links = [
  { to: "/calendar", label: "日历", icon: "ph:calendar-heart" },
  { to: "/diary", label: "日记", icon: "ph:notebook" },
  { to: "/album", label: "相册", icon: "ph:images" },
  { to: "/videos", label: "视频", icon: "ph:video-camera" },
  { to: "/dates", label: "日子", icon: "ph:gift" },
  { to: "/story", label: "故事", icon: "ph:book-open-text" },
  { to: "/letters", label: "情书", icon: "ph:envelope-open" },
  { to: "/wishes", label: "心愿", icon: "ph:list-checks" },
  { to: "/map", label: "足迹", icon: "ph:map-trifold" },
  { to: "/capsule", label: "胶囊", icon: "ph:clock-clockwise" },
];
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-40 flex justify-center px-3 pt-3">
    <nav class="glass flex max-w-full items-center gap-1 overflow-x-auto rounded-full px-3 py-2">
      <RouterLink
        to="/"
        class="mr-2 flex shrink-0 items-center gap-1.5 font-display text-base text-star-gold"
      >
        <Icon icon="ph:planet" class="h-5 w-5" />
        {{ config.siteName }}
      </RouterLink>
      <template v-for="l in links" :key="l.to">
        <RouterLink
          :to="l.to"
          class="flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-sm text-white/70 transition hover:bg-white/10 hover:text-star-gold"
          active-class="bg-white/10 text-star-gold"
        >
          <Icon :icon="l.icon" class="h-4 w-4" />
          <span class="hidden sm:inline">{{ l.label }}</span>
        </RouterLink>
      </template>
      <button
        class="ml-1 shrink-0 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-star-pink"
        title="重新锁定"
        @click="lock"
      >
        <Icon icon="ph:lock-simple" class="h-4 w-4" />
      </button>
    </nav>
  </header>
</template>
