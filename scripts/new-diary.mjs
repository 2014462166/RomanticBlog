import { createInterface } from "node:readline/promises";
import { readFileSync, writeFileSync } from "node:fs";
import { stdin as input, stdout as output } from "node:process";
import { fileURLToPath } from "node:url";

const file = fileURLToPath(new URL("../src/data/entries.json", import.meta.url));
const rl = createInterface({ input, output });
const ask = async (text, dft = "") => (await rl.question(`${text}${dft ? `（${dft}）` : ""}：`)) || dft;

function localDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const date = await ask("日期 YYYY-MM-DD", localDate());
const title = await ask("标题（必填）");
if (!title) {
  console.log("标题不能为空，已取消。");
  rl.close();
  process.exit(1);
}
const mood = await ask("心情（如：开心/幸福/感动）", "开心");
const content = await ask("内容");
const location = await ask("地点（可留空）");
const tagsRaw = await ask("标签，逗号分隔（如：旅行,第一次）");
const mediaRaw = await ask("媒体文件相对路径，逗号分隔（如 m_b86324cdcc/photos/2026-10/001.webp，可留空）");
rl.close();

const data = JSON.parse(readFileSync(file, "utf8"));
const seq = data.entries.filter((e) => e.date === date).length + 1;
const entry = {
  id: `${date}-${String(seq).padStart(3, "0")}`,
  date,
  title,
  mood: mood || undefined,
  content,
  location: location || undefined,
  tags: tagsRaw
    ? tagsRaw
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined,
  media: mediaRaw
    ? mediaRaw
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((src) => (/\.(mp4|webm|mov|m4v)$/i.test(src) ? { type: "video", src } : { type: "image", src }))
    : [],
};
data.entries.push(entry);
writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`✅ 已添加记录 ${entry.id} → src/data/entries.json`);
console.log("   提示：媒体文件请放到 public/ 目录下对应路径，缩略图可用 npm run gen-thumb 生成。");
