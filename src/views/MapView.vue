<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { Icon } from "@iconify/vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import places from "@/data/places.json";

const mapRef = ref<HTMLElement | null>(null);
const list = places.places;
let map: L.Map | null = null;

onMounted(() => {
  if (!mapRef.value || !list.length) return;
  map = L.map(mapRef.value).setView([35, 105], 4);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }).addTo(map);

  const markers: L.Marker[] = [];
  for (const p of list) {
    const icon = L.divIcon({
      className: "",
      html: '<div class="heart-pin">💗</div>',
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -22],
    });
    const m = L.marker([p.lat, p.lng], { icon }).addTo(map);
    m.bindPopup(`<b>${p.name}</b><br><span>${p.date}</span><br>${p.story ?? ""}`);
    markers.push(m);
  }

  if (markers.length === 1) {
    map.setView(markers[0].getLatLng(), 13);
  } else {
    map.fitBounds(L.latLngBounds(markers.map((m) => m.getLatLng())), { padding: [48, 48] });
  }
  window.setTimeout(() => map?.invalidateSize(), 300);
});

onBeforeUnmount(() => {
  map?.remove();
  map = null;
});
</script>

<template>
  <div class="space-y-6 pb-10">
    <header class="text-center">
      <h2 class="font-display text-3xl text-gradient sm:text-4xl">足迹地图</h2>
      <p class="mt-2 text-sm text-white/50">一起去过的地方，与当时的故事</p>
    </header>

    <section v-if="list.length" class="glass overflow-hidden rounded-3xl">
      <div ref="mapRef" class="h-[55vh] w-full"></div>
    </section>

    <div v-if="list.length" class="space-y-3">
      <article v-for="p in list" :key="p.id" class="glass rounded-3xl p-5">
        <div class="flex items-center justify-between gap-2">
          <h3 class="font-display text-lg text-white/95">💗 {{ p.name }}</h3>
          <span class="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-star-cyan">{{ p.date }}</span>
        </div>
        <p v-if="p.story" class="mt-2 text-sm leading-relaxed text-white/60">{{ p.story }}</p>
      </article>
    </div>

    <div v-else class="glass flex flex-col items-center gap-3 rounded-3xl p-12 text-center text-white/45">
      <Icon icon="ph:map-trifold" class="h-10 w-10 text-star-gold/60" />
      还没有足迹 🗺️
      <span class="text-xs text-white/30">编辑 src/data/places.json 添加一起去过的地方（经纬度）</span>
    </div>
  </div>
</template>
