# 素材记录

## 现状照片

- 津门故里：用户提供照片，复制到 `public/images/jinmen_present.jpg`。
- 天后宫山门：Wikimedia Commons `Gate of Tianjin Tianhou Temple 2.jpg`，通过 `Special:Redirect/file/` 下载。
- 解放桥：Wikimedia Commons `French Concession International Bridge 1927 IMG 4671 Jiefang Bridge.jpg`，通过 `Special:Redirect/file/` 下载。

## 历史复原图

- `jinmen_past.jpg`：基于用户提供参考照片和清末宫南大街提示词，使用 `gpt-image-2` 生成。
- `tianhou_past.jpg`：基于元代天后宫初建、三岔河口、漕运与幡杆气死风灯提示词，使用 `gpt-image-2` 生成。
- `jiefang_past.jpg`：基于 1930 年代万国桥、钢结构开启桥、海河金融贸易中心提示词，使用 `gpt-image-2` 生成。

## 音频

- 三段 BGM 来自工作区已有 mp3 文件，复制到 `public/audio/` 并按地点命名。

## World Labs / Marble

- `workflow/output/world-check/`：World Labs API 真实生成结果。
- `public/worlds/jinmen/world.json`：Marble world 元数据。
- `public/worlds/jinmen/assets/`：本地下载的 thumbnail、pano、GLB mesh、SPZ splat 资产。
- Marble URL：`https://marble.worldlabs.ai/world/65ffde31-7008-49be-970f-5dbcce5cff55`
