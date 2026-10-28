import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

/**
 * 照片隐私与体积优化：
 * 1. 转 WebP（质量 80，最长边 ≤1920px）
 * 2. 剥离 EXIF（含 GPS 定位信息）
 * 3. 同时生成 -thumb.webp 缩略图（480px）
 * 原图不删除，确认无误后可手动清理（原图不会部署上线，只有 webp 会被引用）。
 */

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
    else if (/\.(jpe?g|png|webp|tiff?)$/i.test(it.name) && !/-thumb\.webp$/i.test(it.name)) out.push(full);
  }
  return out;
}

const files = await walk(photosRoot);
let converted = 0;
for (const f of files) {
  const ext = path.extname(f);
  const webp = `${f.slice(0, -ext.length)}.webp`;
  const thumb = `${f.slice(0, -ext.length)}-thumb.webp`;

  // 原图 → 压缩 WebP（sharp 默认丢弃全部元数据，含 EXIF/GPS）
  await sharp(f)
    .rotate() // 依据 EXIF 方向摆正（随后元数据即被丢弃）
    .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(webp);

  // 生成缩略图
  await sharp(f)
    .rotate()
    .resize({ width: 480, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(thumb);

  converted++;
  console.log(`✅ ${path.relative(photosRoot, f)} → .webp + -thumb.webp`);
}

console.log("");
console.log(`处理完成：${converted} 张照片已转 WebP 并剥离 EXIF 定位信息。`);
console.log("记录中请引用 .webp 与 -thumb.webp 文件；原图可本地留存，无需提交仓库。");
