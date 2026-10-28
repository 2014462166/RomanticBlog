<script setup lang="ts">
import { computed, ref } from "vue";
import { Icon } from "@iconify/vue";
import EntryCard from "@/components/EntryCard.vue";
import { useEntries } from "@/composables/useEntries";

const { byDate } = useEntries();
const today = new Date();
const viewYear = ref(today.getFullYear());
const viewMonth = ref(today.getMonth() + 1);
const selected = ref(localDateStr(today));

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

function fmt(n: number) {
  return String(n).padStart(2, "0");
}

function localDateStr(d: Date) {
  return `${d.getFullYear()}-${fmt(d.getMonth() + 1)}-${fmt(d.getDate())}`;
}

const cells = computed(() => {
  const first = new Date(viewYear.value, viewMonth.value - 1, 1);
  const offset = (first.getDay() + 6) % 7; // 周一开始
  const daysInMonth = new Date(viewYear.value, viewMonth.value, 0).getDate();
  const list: ({ day: number; date: string } | null)[] = Array.from({ length: offset }, () => null);
  for (let d = 1; d <= daysInMonth; d++) {
    list.push({ day: d, date: `${viewYear.value}-${fmt(viewMonth.value)}-${fmt(d)}` });
  }
  return list;
});

const monthLabel = computed(() => `${viewYear.value} 年 ${viewMonth.value} 月`);
const selectedEntries = computed(() => byDate.value.get(selected.value) ?? []);
const hasEntries = (date: string) => byDate.value.has(date);
const isToday = (date: string) => date === localDateStr(today);
const isSelected = (date: string) => date === selected.value;

function prev() {
  if (viewMonth.value === 1) {
    viewMonth.value = 12;
    viewYear.value--;
  } else {
    viewMonth.value--;
  }
}

function next() {
  if (viewMonth.value === 12) {
    viewMonth.value = 1;
    viewYear.value++;
  } else {
    viewMonth.value++;
  }
}

function goToday() {
  viewYear.value = today.getFullYear();
  viewMonth.value = today.getMonth() + 1;
  selected.value = localDateStr(today);
}
</script>

<template>
  <div class="space-y-6 pb-10">
    <section class="glass rounded-3xl p-5 sm:p-7">
      <div class="mb-5 flex items-center justify-between">
        <button
          class="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-star-gold"
          title="上个月"
          @click="prev"
        >
          <Icon icon="ph:caret-left" class="h-5 w-5" />
        </button>
        <div class="text-center">
          <h2 class="font-display text-2xl text-gradient sm:text-3xl">{{ monthLabel }}</h2>
          <button class="mt-1 text-xs text-white/45 underline-offset-2 hover:text-star-cyan hover:underline" @click="goToday">
            回到今天
          </button>
        </div>
        <button
          class="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-star-gold"
          title="下个月"
          @click="next"
        >
          <Icon icon="ph:caret-right" class="h-5 w-5" />
        </button>
      </div>

      <div class="grid grid-cols-7 gap-1 text-center">
        <div v-for="w in WEEKDAYS" :key="w" class="py-1.5 text-xs text-white/40">周{{ w }}</div>
        <template v-for="(cell, i) in cells" :key="i">
          <div v-if="!cell" class="py-1.5"></div>
          <button
            v-else
            class="relative flex aspect-square flex-col items-center justify-center rounded-2xl text-sm transition sm:text-base"
            :class="[
              isSelected(cell.date)
                ? 'bg-white/10 text-star-gold shadow-[inset_0_0_0_1px_rgba(247,215,148,0.45)]'
                : 'text-white/80 hover:bg-white/5',
              hasEntries(cell.date) && !isSelected(cell.date) ? 'bg-star-gold/5' : '',
            ]"
            @click="selected = cell.date"
          >
            <span :class="isToday(cell.date) ? 'font-bold text-star-pink' : ''">{{ cell.day }}</span>
            <span
              v-if="hasEntries(cell.date)"
              class="absolute bottom-1.5 h-1.5 w-1.5 rounded-full"
              :class="isSelected(cell.date) ? 'bg-star-gold' : 'bg-star-gold/70 animate-pulse-soft'"
            ></span>
          </button>
        </template>
      </div>
      <p class="mt-3 text-center text-xs text-white/35">✨ 发光的日期都有回忆，点开看看</p>
    </section>

    <section>
      <h3 class="mb-4 flex items-center gap-2 font-display text-xl text-white/90">
        <Icon icon="ph:calendar-dot" class="h-5 w-5 text-star-gold" />
        {{ selected }} · {{ selectedEntries.length ? `${selectedEntries.length} 条记录` : "这一天还没有记录" }}
      </h3>
      <div v-if="selectedEntries.length" class="space-y-4">
        <EntryCard v-for="e in selectedEntries" :key="e.id" :entry="e" />
      </div>
      <div v-else class="glass rounded-3xl p-10 text-center text-white/45">
        把这一天的故事记下来吧 💫<br />
        <span class="text-xs text-white/30">用 npm run new:diary 添加记录</span>
      </div>
    </section>
  </div>
</template>
