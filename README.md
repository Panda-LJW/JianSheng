# 见声 JianSheng

> 看见过去的样子，听见过去的声音。

## 产品介绍

见声是一个 AI 文旅时光穿越 Web 应用。用户选择天津地标后，向下滚动页面，现状照片会渐变为历史复原图，纯音乐 BGM 随滚动逐渐响起，故事文字在后半段依次浮现。

## 技术架构

- 前端：React + TypeScript + Vite + Tailwind CSS
- 交互：Scroll progress + Intersection Observer + Web Audio API
- AI 工作流：GPT-4o 多模态识别与文案生成，gpt-image-2 基于“文本 + 图片”的历史复原图生成
- 3D 世界模型：World Labs / Marble API，把复原图上传为 media asset 后生成可探索 world

## 快速启动

```bash
npm install
npm run dev
```

本地访问：`http://localhost:5173`

## AI 工作流使用

```bash
cp .env.example .env
# 填入 OPENAI_API_KEY 和 WORLDLABS_API_KEY；如果使用本地 OpenAI 兼容网关，也设置 OPENAI_BASE_URL。
node workflow/pipeline.js --input public/images/jinmen_present.jpg --era "清末民初1910年" --output ./workflow/output/
```

常用参数：

- `--restore-mode auto`：默认，先尝试“原图 + 文本”编辑，失败时回退文本生成。
- `--restore-mode edit`：强制“原图 + 文本”编辑。
- `--skip-world true`：没有 World Labs key 时只跑到复原图。

输出：

- `workflow/output/analysis.json`
- `workflow/output/restored.jpg`
- `workflow/output/world/world.json`
- `workflow/output/world/assets/`

本次已成功生成一个津门故里 Marble world，并将资产复制到：

- `public/worlds/jinmen/world.json`
- `public/worlds/jinmen/assets/pano.jpg`
- `public/worlds/jinmen/assets/collider_mesh.glb`
- `public/worlds/jinmen/assets/splat-100k.spz`
- `public/worlds/jinmen/assets/splat-full_res.spz`

## Demo 地点

| 地点 | 穿越年代 | 亮点 |
| --- | --- | --- |
| 津门故里 | 清末民初 1910 | 现代仿古牌坊 → 朴素木质牌楼，钱街银号 |
| 天后宫山门 | 元代 1326 | 旅游景点 → 海河漕运精神灯塔 |
| 解放桥 | 民国 1930s | 城市地标 → 万国桥，电车与洋行 |

## 素材来源与生成方式

- `public/images/jinmen_present.jpg`：用户提供的津门故里现状照片。
- `public/images/tianhou_present.jpg`：Wikimedia Commons, `Gate of Tianjin Tianhou Temple 2.jpg`。
- `public/images/jiefang_present.jpg`：Wikimedia Commons, `French Concession International Bridge 1927 IMG 4671 Jiefang Bridge.jpg`。
- `public/images/*_past.jpg`：通过 `gpt-image-2` 按历史复原提示词生成。
- `public/audio/*.mp3`：本地已有免费音乐素材，复制为三个地点的 BGM。

## 目录结构

```text
public/
  audio/
  images/
  videos/
src/
  components/
  data/
  hooks/
  pages/
workflow/
  prompts/
  output/
  pipeline.js
  step1-analyze.js
  step2-restore.js
```

## 团队与赛事

Hack the Future 天津站 · AI+文旅特别单元
