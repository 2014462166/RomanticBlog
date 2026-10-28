# 星河与你 · 我们的情侣空间

GitHub Pages 静态站：记录日常（文字 / 照片 / 视频）、重要日子与节日、日历回忆，梦幻星空主题，仅本人可访问。

完整设计文档见 [开发文档.md](./开发文档.md)。

## 快速开始

```bash
npm install
npm run dev      # 本地预览（默认密码 5201314）
npm run build    # 构建到 dist/
```

## 修改密码

```bash
npm run set-password -- 你的新密码
```

密码以 SHA-256 哈希形式保存在 `src/data/config.json`，明文不会进入仓库。

## 内容维护

| 内容 | 文件 |
|------|------|
| 站点配置（站名 / 名字 / 在一起日期） | `src/data/config.json` |
| 每日情话 | `src/data/quotes.json` |
| 日常记录 | `src/data/entries.json` |
| 重要日子与节日 | `src/data/dates.json` |
| 故事里程碑 | `src/data/timeline.json` |
| 情书 | `src/data/letters.json` |
| 心愿清单 | `src/data/wishes.json` |
| 足迹地点 | `src/data/places.json` |
| 时间胶囊 | `src/data/capsule.json` |
| 音乐盒歌单 | `src/data/music.json` |

常用命令：

```bash
npm run new:diary    # 问答式新增一条日记
npm run gen-thumb    # 为 public/m_b86324cdcc/photos/ 下照片自动生成 -thumb.webp 缩略图
```

媒体文件放 `public/m_b86324cdcc/`（随机目录名用于防路人访问），在记录的 `media` 字段用相对路径引用（如 `m_b86324cdcc/photos/2026-10/001.webp`）。

## 部署

完整上线步骤（创建仓库、推送、开启 Pages、隐私检查清单）见 [部署指南.md](./部署指南.md)。

推送到 GitHub 仓库 `main` 分支后，`.github/workflows/deploy.yml` 自动构建并发布到 `gh-pages`；在仓库 Settings → Pages 中选择 `gh-pages` 分支即可。
