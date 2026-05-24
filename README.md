# 见声 JianSheng

> 看见过去的样子，听见过去的声音。

见声是一个 AI 文旅时光穿越 Web 应用。它把天津地标的现状照片、历史复原图、声音叙事、图像探索和 3D 场景入口组合在一起，让用户从“打卡一个地点”进入“理解一段城市时间”。

## 项目亮点

- **AI 文旅体验闭环**：从首页、上传入口、地标选择到沉浸式详情页，形成完整体验路径。
- **时光穿越视觉**：滚动中从现状图过渡到历史复原图，强化“看见过去”的第一印象。
- **长音频友好 UX**：详情页提供章节轮播、声音线索、图像观察任务和复原图放大探索，让 6-8 分钟旁白有足够内容承载。
- **Marble World 入口**：津门故里已接入 World Labs / Marble 生成结果，可从地标详情进入 3D 场景。
- **AI 能力分层**：前端体验、Node API、离线 workflow 分层组织，便于逐步接入上传、TTS、历史资料检索和 3D world 生成。

## 体验流程

```text
见声首页
  ├─ 上传照片
  │   └─ 创建体验任务
  │       └─ 进入匹配地标详情页
  └─ 浏览地标
      └─ 地标详情页
          ├─ 现状图 Hero
          ├─ 滚动时光转场
          ├─ 历史复原图 + 音频播放器
          ├─ 复原图全屏探索
          ├─ Marble / 3D 场景入口
          └─ Archive Voice 章节轮播
```

## 主要功能

- **沉浸式首页**：以“见声”作为首屏入口，提供“上传照片”和“浏览地标”双入口。
- **上传体验任务**：上传或示例图会进入任务状态流程，承接后端 job 模型。
- **地标选择**：当前内置津门故里、天后宫山门、解放桥三个天津地点。
- **时光转场**：滚动过程中现状图逐渐切换为历史复原图，年份随滚动变化。
- **音频体验**：基于 Web Audio API 的 BGM 播放、静音和进度展示。
- **复原图探索**：历史复原图支持全屏查看、缩放、拖拽、重置和热点标注。
- **Archive Voice**：章节式长旁白体验，支持后端 TTS 生成与历史资料检索增强。
- **Marble 场景**：已有 Marble world 的地标会显示 3D 入口，用户可以走进复原后的历史现场。

## 技术架构

- 前端：React + TypeScript + Vite + Tailwind CSS
- 动效：GSAP + ScrollTrigger、滚动进度、CSS 动效
- 音频：Web Audio API + HTMLAudioElement，章节 TTS 通过 API 接入
- 本地 API：Node.js 原生 HTTP server，提供 health、job、TTS、research 接口
- 图像与叙事数据：静态 manifest，集中在 `src/data/locations.ts`
- AI 工作流：`workflow/` 下的 Node pipeline，负责地点分析、历史复原图和 World Labs / Marble world 生成
- AI 模型：GPT 多模态识别与文案生成、gpt-image-2 历史复原图生成、OpenAI TTS、Responses API Web Search
- 3D 世界模型：World Labs / Marble API，可将复原图生成可探索 world

## 快速启动

安装依赖：

```bash
npm install
```

启动前端：

```bash
npm run dev
```

启动本地 API：

```bash
npm run api
```

本地访问：

```text
http://localhost:5173
```

常用命令：

```bash
npm run lint
npm run build
npm run preview
```

## 环境变量

复制 `.env.example`：

```bash
cp .env.example .env
```

可配置变量：

```text
JIANSHENG_API_PORT=8787
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=http://127.0.0.1:8080/v1
JIANSHENG_TTS_MODEL=gpt-4o-mini-tts
JIANSHENG_TTS_VOICE=verse
JIANSHENG_RESEARCH_MODEL=gpt-4.1-mini
JIANSHENG_WEB_SEARCH_TOOL=web_search
WORLDLABS_API_KEY=your_world_labs_api_key_here
WORLDLABS_MODEL=marble-1.1
GEMINI_API_KEY=your_gemini_api_key_here
JIANSHENG_MUSIC_PROVIDER=gemini
JIANSHENG_MUSIC_MODEL=lyria-3-pro-preview
```

说明：

- `OPENAI_API_KEY` 用于 TTS、历史资料检索和 workflow 中的模型调用。
- `OPENAI_BASE_URL` 仅在使用 OpenAI 兼容网关时需要。
- `WORLDLABS_API_KEY` 用于生成新的 Marble world；已有离线 manifest 可以直接用于前端展示。
- `GEMINI_API_KEY` 用于后续接入 Lyria 纯音乐生成，现有 Suno BGM 可继续作为体验素材。

## 本地 API

```text
GET  /api/health       # 能力健康检查
POST /api/jobs         # 创建体验任务
GET  /api/jobs/:id     # 查询任务状态
POST /api/tts          # 生成章节旁白音频
POST /api/research     # 使用 Web Search 检索历史资料
```

任务状态模型：

```text
queued -> analyzing -> researching -> restoring -> narrating -> worlding -> completed
```

这个模型用于承接长耗时 AI 任务：上传图片后先创建 job，前端通过 job id 查询状态，再根据状态展示进度、失败兜底和最终结果。

## AI 工作流

`workflow/` 是可复用的 Node 生成管线，可以被本地 API 或后续 job queue 调用。

```bash
node workflow/pipeline.js \
  --input public/images/jinmen_present.jpg \
  --era "清末民初1910年" \
  --output ./workflow/output/
```

常用参数：

- `--restore-mode auto`：默认，先尝试“原图 + 文本”编辑，失败时回退文本生成。
- `--restore-mode edit`：强制“原图 + 文本”编辑。
- `--restore-mode generate`：只用文本生成复原图。
- `--skip-world true`：跳过 World Labs / Marble，只跑到分析与复原图。
- `--no-wait true`：启动 world 生成后不等待完成。

输出：

- `workflow/output/analysis.json`
- `workflow/output/restored.jpg`
- `workflow/output/world/world.json`
- `workflow/output/world/assets/`

## Demo 地点

| 地点 | 穿越年代 | 体验状态 | 亮点 |
| --- | --- | --- | --- |
| 津门故里 | 清末民初 1910 | 复原图 + Marble world | 现代仿古牌坊 -> 朴素木质牌楼，钱街银号 |
| 天后宫山门 | 元泰定三年 1326 | 复原图 + 章节旁白 | 河口庙宇、漕运码头、船工信仰 |
| 解放桥 | 民国 1930s | 复原图 + 章节旁白 | 万国桥、电车、洋行与海河码头 |

## 素材来源与生成方式

- `public/images/jinmen_present.jpg`：用户提供的津门故里现状照片。
- `public/images/tianhou_present.jpg`：Wikimedia Commons, `Gate of Tianjin Tianhou Temple 2.jpg`。
- `public/images/jiefang_present.jpg`：Wikimedia Commons, `French Concession International Bridge 1927 IMG 4671 Jiefang Bridge.jpg`。
- `public/images/*_past.jpg`：通过 `gpt-image-2` 按历史复原提示词生成。
- `public/audio/*.mp3`：本地已有免费音乐素材，复制为三个地点的 BGM。
- `public/worlds/jinmen/world.json`：津门故里 Marble world 的离线 manifest。

更详细的素材记录见 `docs/asset-sources.md`。

## 目录结构

```text
public/
  audio/            # BGM 音频
  images/           # 现状图与历史复原图
  worlds/           # Marble world manifest 与资产
server/
  index.js          # 本地 API：job、TTS、research
src/
  components/       # 页面组件、音频组件、复原图探索等
  data/             # 地点数据与前端 workflow 契约
  hooks/            # 滚动进度、BGM 播放等 hooks
  lib/              # 前端 API client
  pages/            # 首页、上传页、分析页、详情页
workflow/
  prompts/          # AI 分析提示词
  output/           # demo 分析结果与生成产物
  pipeline.js       # 离线管线入口
  step1-analyze.js
  step2-restore.js
  step3-world.js
docs/
  *.png             # UI/UX 评审截图
```

## 后续拓展

建议按体验闭环继续推进：

1. 将上传图片保存到任务目录，并把 `workflow/pipeline.js` 纳入 job queue。
2. 为每个章节生成持久化 TTS 音频，并做章节高亮同步。
3. 把 Web Search 结果沉淀为地点资料卡和复原提示词引用。
4. 扩展天后宫、解放桥的 Marble world 资产。
5. 增加移动端真实机型与桌面宽屏回归截图。

## 团队与赛事

Hack the Future 天津站 · AI+文旅特别单元
