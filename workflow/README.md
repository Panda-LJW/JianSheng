# 见声 · AI工作流

## 功能

输入一张地点照片 + 目标年代，AI 自动生成历史文案、基于“原图 + 文本”的历史复原图，并把复原图送入 World Labs / Marble 生成 3D world。

## 使用

```bash
cp ../.env.example ../.env
# 填入 OPENAI_API_KEY 和 WORLDLABS_API_KEY；如果使用本地 OpenAI 兼容服务，同时设置 OPENAI_BASE_URL。
node pipeline.js --input photo.jpg --era "目标年代描述" --output ./output/
```

输出：

- `output/analysis.json`：GPT-4o 生成的地点识别、复原提示词、故事文案和音乐建议。
- `output/restored.jpg`：gpt-image-2 基于原图 + 复原 prompt 生成的历史复原图。
- `output/world/world.json`：World Labs / Marble 生成的 3D world 元数据。
- `output/world/assets/`：下载到本地的 thumbnail、pano、SPZ、mesh 等世界模型资产（取决于 API 返回内容）。

## 单步运行

```bash
# 第 2 步默认 restore-mode=auto：先尝试 image edit，若网关上游失败则回退 text-only generate。
node pipeline.js --input photo.jpg --era "目标年代描述" --restore-mode auto --skip-world true

# 只做图生图复原
node step2-restore.js --image photo.jpg --prompt-file prompt.txt --output restored.jpg

# 只把复原图送入 World Labs
node step3-world.js --image restored.jpg --analysis analysis.json --output ./output/world
```

`--restore-mode edit` 会强制使用“文本 + 图片”编辑；如果网关 `/images/edits` 上游失败，流程会直接失败，便于排查。`--restore-mode generate` 会只用文本生成复原图。

## 技术栈

- GPT-4o：多模态识别 + 历史文案生成。
- gpt-image-2：基于历史描述和原始照片生成复原图。
- World Labs / Marble：基于复原图生成可探索 3D world。
- Node.js：命令行管线与文件落盘。
