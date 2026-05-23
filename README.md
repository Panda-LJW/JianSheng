# 见声 JianSheng

> 看见过去的样子，听见过去的声音。

见声是一个 AI 文旅时光穿越 Web 应用。用户可以浏览天津地标，或从上传照片入口进入离线 AI workflow 演示；页面会把现状照片、历史复原图、声音、章节叙事和图像探索组合成一次沉浸式文旅体验。

## 当前状态

当前 `UIUX002` 版本重点完成前端体验与离线 workflow 契约对齐：

- 前端体验已可本地运行：见声首页、上传入口、分析演示、地标选择、详情滚动叙事、复原图探索、章节轮播和音频播放。
- 后端尚未实时接入前端：上传照片不会真实发送到 API server。
- AI 能力目前在 `workflow/` 中以离线 Node pipeline 形式存在，可手动运行分析、历史复原图和 Marble world 生成。
- 前端数据已预留 `pipeline / ai / narration / imageHotspots` 等字段，方便后续接入任务队列或 API。

## 体验流程

```text
见声首页
  ├─ 上传照片
  │   └─ 离线 workflow demo 分析页
  │       └─ 已生成示例结果详情页
  └─ 浏览地标
      └─ 地标详情页
          ├─ 现状图 Hero
          ├─ 滚动时光转场
          ├─ 历史复原图 + 音频播放器
          ├─ 复原图全屏探索
          └─ Archive Voice 章节轮播
```

## 主要功能

- **沉浸式首页**：以“见声”作为首屏入口，提供“上传照片”和“浏览地标”双入口。
- **上传/分析演示**：展示离线 AI workflow 的前端契约，不假装已经有实时后端。
- **地标选择**：当前内置津门故里、天后宫山门、解放桥三个天津地点。
- **时光转场**：滚动过程中现状图逐渐切换为历史复原图，年份随滚动变化。
- **音频体验**：基于 Web Audio API 的 BGM 播放、静音和进度展示。
- **复原图探索**：历史复原图支持全屏查看、缩放、拖拽、重置和热点标注。
- **章节轮播**：为 6-8 分钟 TTS/音频场景准备章节式内容，减少纵向滚动负担。
- **工作流契约展示**：在详情页展示当前离线产物状态，区分 ready、partial、missing。

## 技术架构

- 前端：React + TypeScript + Vite + Tailwind CSS
- 动效：GSAP + ScrollTrigger、滚动进度、CSS 动效
- 音频：Web Audio API + HTMLAudioElement
- 图像与叙事数据：静态 manifest，集中在 `src/data/locations.ts`
- AI 工作流：`workflow/` 下的离线 Node pipeline
- AI 模型：GPT-4o 多模态识别与文案生成，gpt-image-2 历史复原图生成
- 3D 世界模型：World Labs / Marble API，可将复原图生成可探索 world

## 快速启动

```bash
npm install
npm run dev
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

需要的变量：

```text
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=http://127.0.0.1:8080/v1
WORLDLABS_API_KEY=your_world_labs_api_key_here
WORLDLABS_MODEL=marble-1.1
```

说明：

- `OPENAI_BASE_URL` 只在使用本地或第三方 OpenAI 兼容网关时需要。
- 不跑 World Labs / Marble 时，可以先不配置 `WORLDLABS_API_KEY`，并在 workflow 中使用 `--skip-world true`。

## AI 工作流

`workflow/` 不是实时 API server，而是离线生成管线。

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

当前前端不会自动调用这些脚本。要真正端到端打通，需要新增 API/job queue：上传图片 -> 创建任务 -> 跑 workflow -> 保存产物 -> 前端轮询状态 -> 展示结果。

## Demo 地点

| 地点 | 穿越年代 | 当前状态 | 亮点 |
| --- | --- | --- | --- |
| 津门故里 | 清末民初 1910 | 离线产物 ready | 现代仿古牌坊 -> 朴素木质牌楼，钱街银号 |
| 天后宫山门 | 元泰定三年 1326 | 离线产物 partial | 旅游景点 -> 海河漕运精神灯塔 |
| 解放桥 | 民国 1930s | 离线产物 partial | 城市地标 -> 万国桥，电车、洋行与海河码头 |

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
src/
  components/       # 页面组件、音频组件、复原图探索等
  data/             # 地点数据与前端 workflow 契约
  hooks/            # 滚动进度、BGM 播放等 hooks
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

## 当前限制

- 还没有实时后端 API。
- 上传图片只进入前端 demo 流程，不会真实发起 AI 处理。
- TTS 尚未接入，当前以 BGM + 章节文字承载长音频体验。
- Marble/3D world 当前只保留津门故里的离线 manifest，前端主体验仍以复原图探索为主。

## 后续路线

建议按稳定性优先推进：

1. 增加本地 API server 与任务状态模型。
2. 接入上传图片、任务创建、状态轮询和失败兜底。
3. 将 `workflow/pipeline.js` 封装为可被 job queue 调用的服务。
4. 接入 TTS，并把 `narration.chapters` 映射到音频章节。
5. 扩展更多地标与 Marble world 资产。
6. 增加移动端真实机型与桌面宽屏回归截图。

## 团队与赛事

Hack the Future 天津站 · AI+文旅特别单元
