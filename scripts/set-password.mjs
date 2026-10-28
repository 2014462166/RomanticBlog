import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const password = process.argv[2];
if (!password) {
  console.log("用法: npm run set-password -- <你的新密码>");
  process.exit(1);
}

const hash = createHash("sha256").update(password).digest("hex");
const file = fileURLToPath(new URL("../src/data/config.json", import.meta.url));
const config = JSON.parse(readFileSync(file, "utf8"));
config.passwordHash = hash;
writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`, "utf8");
console.log("✅ 密码已更新并写入 src/data/config.json（明文密码不会保存到仓库）");
