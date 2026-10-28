<script setup lang="ts">
import { onMounted } from "vue";
import { Icon } from "@iconify/vue";
import gsap from "gsap";
import timeline from "@/data/timeline.json";

const milestones = [...timeline.milestones].sort((a, b) => (a.date < b.date ? -1 : 1));

onMounted(() => {
  gsap.to(".reveal", {
    opacity: 1,
    y: 0,
    duration: 0.7,
    stagger: 0.1,
    ease: "power3.out",
  });
});
</script>

<template>
  <div class="space-y-6 pb-10">
    <header class="text-center">
      <h2 class="font-display text-3xl text-gradient sm:text-4xl">我们的故事</h2>
      <p class="mt-2 text-sm text-white/50">从相遇到现在，每一个里程碑都值得记住</p>
    </header>

    <div v-if="milestones.length" class="relative ml-4 border-l-2 border-star-gold/20 pl-8">
      <article v-for="m in milestones" :key="m.id" class="reveal relative pb-10 last:pb-0">
        <div
          class="absolute -left-[21px] top-0 flex h-10 w-10 items-center justify-center rounded-full border border-star-gold/30 bg-starry-900 text-lg"
        >
          {{ m.icon }}
        </div>
        <div class="glass rounded-3xl p-6">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="font-display text-xl text-white/95">{{ m.title }}</h3>
            <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-star-cyan">{{ m.date }}</span>
          </div>
          <p class="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/70">{{ m.content }}</p>
        </div>
      </article>
    </div>

    <div v-else class="glass flex flex-col items-center gap-3 rounded-3xl p-12 text-center text-white/45">
      <Icon icon="ph:book-open-text" class="h-10 w-10 text-star-gold/60" />
      故事还没有开始写 📖
      <span class="text-xs text-white/30">编辑 src/data/timeline.json 记录你们的里程碑</span>
    </div>
  </div>
</template>
