import { ref } from "vue";
import { useSessionStorage } from "@vueuse/core";
import config from "@/data/config.json";

const unlocked = useSessionStorage("rs-unlocked-v1", false);

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function useAuth() {
  const error = ref(false);

  async function tryUnlock(input: string): Promise<boolean> {
    const ok = (await sha256(input)) === config.passwordHash;
    error.value = !ok;
    unlocked.value = ok;
    return ok;
  }

  function lock() {
    unlocked.value = false;
  }

  return { unlocked, tryUnlock, lock, error };
}
