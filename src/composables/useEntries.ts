import { computed } from "vue";
import raw from "@/data/entries.json";

export interface MediaItem {
  type: "image" | "video";
  src: string;
  thumb?: string;
  poster?: string;
}

export interface Entry {
  id: string;
  date: string;
  title: string;
  mood?: string;
  content: string;
  location?: string;
  tags?: string[];
  media: MediaItem[];
}

interface GalleryImage extends MediaItem {
  entry: Entry;
}

interface GalleryVideo extends MediaItem {
  entry: Entry;
}

const all = (raw.entries as Entry[]).filter((e) => e && e.date);

export function useEntries() {
  const entries = computed(() => [...all].sort((a, b) => (a.date < b.date ? 1 : -1)));

  const byDate = computed(() => {
    const map = new Map<string, Entry[]>();
    for (const e of all) {
      const arr = map.get(e.date) ?? [];
      arr.push(e);
      map.set(e.date, arr);
    }
    return map;
  });

  const dates = computed(() => Array.from(byDate.value.keys()));

  const tags = computed(() => {
    const set = new Set<string>();
    for (const e of all) e.tags?.forEach((t) => set.add(t));
    return Array.from(set);
  });

  const images = computed<GalleryImage[]>(() =>
    all.flatMap((e) =>
      (e.media ?? []).filter((m) => m.type === "image").map((m) => ({ ...m, entry: e })),
    ),
  );

  const videos = computed<GalleryVideo[]>(() =>
    all.flatMap((e) =>
      (e.media ?? []).filter((m) => m.type === "video").map((m) => ({ ...m, entry: e })),
    ),
  );

  return { entries, byDate, dates, tags, images, videos };
}
