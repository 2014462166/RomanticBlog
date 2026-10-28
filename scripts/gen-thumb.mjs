import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const photosRoot = path.resolve("public/m_b86324cdcc/photos");

async function walk(dir) {
  const out = [];
  let items = [];
  try {
    items = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const it of items) {
    const full = path.join(dir, it.name);
    if (it.isDirectory()) out.push(...(await walk(full)));
    else if (/\.(jpe?g|png|webp)$/i.test(it.name) && !/-thumb\.webp$/i.test(it.name)) out.push(full);
  }
  return out;
}

const files = await walk(photosRoot);
let created = 0;
let skipped = 0;
for (const f of files) {
  const ext = path.extname(f);
  const thumb = `${f.slice(0, -ext.length)}-thumb.webp`;
  try {
    await fs.access(thumb);
    skipped++;
    continue;
  } catch {
    /* 缩略图不存在，继续生成 */
  }
  await sharp(f).resize({ width: 480, withoutEnlargement: true }).webp({ quality: 78 }).toFile(thumb);
  created++;
}

console.log(`✅ 缩略图处理完成：新建 ${created} 张，已存在 ${skipped} 张`);
console.log(`   目录：public/m_b86324cdcc/photos（缩略图命名 <原名>-thumb.webp）`);
