<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "@/composables/useAuth";
import config from "@/data/config.json";

const { tryUnlock, error } = useAuth();
const input = ref("");
const shaking = ref(false);

async function submit() {
  const ok = await tryUnlock(input.value.trim());
  if (!ok) {
    shaking.value = true;
    window.setTimeout(() => (shaking.value = false), 500);
    input.value = "";
  }
}
</script>

<template>
  <div class="fixed inset-0 z-[60] flex items-center justify-center p-6">
    <div class="glass w-full max-w-md rounded-3xl p-8 text-center" :class="{ 'animate-shake': shaking }">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-star-pink/10 text-3xl animate-float">
        🔐
      </div>
      <h1 class="font-display text-4xl text-gradient">{{ config.siteName }}</h1>
      <p class="mt-2 text-sm text-white/60">这里只属于我们两个人 🌙</p>
      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <input
          v-model="input"
          type="password"
          placeholder="输入我们的密码"
          autocomplete="current-password"
          class="w-full rounded-2xl border border-white/15 bg-white/5 px-5 py-3.5 text-center text-white/90 placeholder-white/30 outline-none transition focus:border-star-gold/60 focus:bg-white/10"
        />
        <p v-if="error" class="text-sm text-star-pink">密码不对哦，再想想 💭</p>
        <button
          type="submit"
          class="w-full rounded-2xl bg-gradient-to-r from-star-gold/90 via-star-pink/80 to-star-cyan/80 px-5 py-3.5 font-display text-lg text-starry-950 transition hover:brightness-110 active:scale-95"
        >
          打开我们的星空 ✨
        </button>
        <p v-if="config.passwordHint" class="pt-1 text-xs text-white/35">{{ config.passwordHint }}</p>
      </form>
    </div>
  </div>
</template>
