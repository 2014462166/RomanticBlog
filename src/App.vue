<script setup lang="ts">
import { watch } from "vue";
import { useRoute } from "vue-router";
import StarfieldBackground from "@/components/StarfieldBackground.vue";
import HeartCursor from "@/components/HeartCursor.vue";
import PasswordGate from "@/components/PasswordGate.vue";
import NavBar from "@/components/NavBar.vue";
import MusicBox from "@/components/MusicBox.vue";
import { useAuth } from "@/composables/useAuth";
import { useSmoothScroll } from "@/composables/useSmoothScroll";
import { useCelebrate } from "@/composables/useCelebrate";
import config from "@/data/config.json";

const route = useRoute();
const { unlocked } = useAuth();
const { banner } = useCelebrate();
useSmoothScroll();

watch(
  () => route.meta.title as string | undefined,
  (t) => {
    document.title = `${t ? `${t} · ` : ""}${config.siteName} · 我们的情侣空间`;
  },
  { immediate: true },
);
</script>

<template>
  <StarfieldBackground />
  <div class="relative z-10 min-h-screen">
    <template v-if="unlocked">
      <NavBar />
      <main class="mx-auto w-full max-w-5xl px-4 pb-16 pt-24 sm:px-6">
        <RouterView v-slot="{ Component, route: r }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="r.path" />
          </Transition>
        </RouterView>
      </main>
      <MusicBox />
    </template>
    <PasswordGate v-else />
  </div>
  <HeartCursor />
  <Transition name="page">
    <div v-if="banner" class="fixed bottom-6 left-1/2 z-[80] w-max max-w-[92vw] -translate-x-1/2">
      <button class="glass rounded-full px-6 py-3 font-display text-lg text-star-gold" @click="banner = null">
        {{ banner }}
      </button>
    </div>
  </Transition>
</template>
