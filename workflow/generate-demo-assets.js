import fs from 'node:fs/promises'
import path from 'node:path'
import { restoreImage } from './step2-restore.js'

const demoAnalyses = [
  {
    id: 'jinmen',
    name: '津门故里',
    era: '清末民初 1910',
    subtitle: '天津 · 宫南大街',
    restoration_prompt: '一幅高度写实的历史复原画，表现1910年左右清末宣统年间的天津宫南大街入口，也就是今天“津门故里”牌坊所在位置。画面采用正面略仰视横构图，一座朴素、风化的清代木质牌楼居中，四柱三间式结构，灰瓦顶，褪色红柱，木构件有斑驳漆面和岁月痕迹。透过牌楼可以看到狭窄繁忙的商业街，两侧是低矮的一二层清代商铺，灰瓦屋顶、木门板店面、木栏杆、竖向冲天招牌，重点表现银号、钱铺、金店、杂货铺的“钱街”气质。街上有穿长袍马褂的商人、戴瓜皮帽的店伙计、挑担苦力，一辆黄包车从牌楼下经过，远处隐约有骡马大车。北方冬日清晨，灰蒙蒙天空，侧面暖光照在木质牌楼和招牌上，青石板与碎砖路面略显坑洼潮旧。整体色调像精心上色的清末老照片：灰褐、木黄、暗红为主，写实、细节丰富，有市井烟火气。严格避免现代汽车、霓虹灯、塑料、现代广告牌、现代服装、手机、监控摄像头和水印。',
  },
  {
    id: 'tianhou',
    name: '天后宫山门',
    era: '元代 1326',
    subtitle: '天津 · 三岔河口',
    restoration_prompt: '一幅高度写实的历史复原画，表现元代泰定三年约1326年前后的天津三岔河口天后宫山门初建时期。画面为横构图，像一张严谨的历史场景复原照片。场景中心是一座新建不久但朴素庄严的天妃宫山门，灰瓦屋顶、木质梁架、土色墙面和红褐色木门，建筑尺度不夸张，带有元代北方庙宇的简朴气质。山门前有两根高高的幡杆，悬挂气死风灯，作为海河夜航船只的导航标志。背景可见海河漕运码头，木船、漕船和纤夫活动在水边，船工、香客、庙祝正在山门前焚香祈福。地面为泥土和石板混合，附近有木栈桥、绳索、货担、香烛摊。天空是北方清晨的薄雾，海河水面泛着冷光，山门和灯杆被柔和侧光照亮。整体色调沉稳古朴，土黄、灰瓦、木褐、暗红为主，质感真实，人物服饰符合元代市井和漕运人群。严格避免现代元素、现代游客、电线杆、汽车、塑料、现代广告牌、高楼和水印。',
  },
  {
    id: 'jiefang',
    name: '解放桥',
    era: '民国 1930s',
    subtitle: '天津 · 海河万国桥',
    restoration_prompt: '一幅高度写实的历史复原画，表现1930年代天津海河上的万国桥，也就是后来的解放桥。横构图，真实摄影质感，像精心上色的民国老照片。画面中心是法国设计的钢结构开启桥，铆钉、钢桁架、桥面轨道和可开启桥跨结构清晰可见。桥上有电车轨道，一辆民国时期电车缓慢通过，旁边有黄包车、穿长衫和西装的行人、戴礼帽的商人。海河两岸是近代天津金融和贸易中心，能看到银行、洋行、饭店等石材或砖砌欧式建筑立面，但不要现代玻璃幕墙。河面有小船和货船，码头上有搬运工和货箱。氛围为清晨或傍晚的暖灰色光线，钢桥带有历史使用痕迹，河面反射城市和桥梁。整体色调怀旧克制，灰蓝钢铁、米色石材、暗褐木箱和微暖阳光，画面有民国天津的国际都会感。严格避免现代汽车、现代广告、手机、塑料、现代服装、监控、霓虹灯和水印。',
  },
]

async function main() {
  const outDir = 'workflow/output'
  await fs.mkdir(outDir, { recursive: true })
  await fs.writeFile(path.join(outDir, 'demo-analyses.json'), JSON.stringify(demoAnalyses, null, 2), 'utf8')
  for (const item of demoAnalyses) {
    const output = `public/images/${item.id}_past.jpg`
    try {
      await fs.access(output)
      console.log(`exists ${output}`)
    } catch {
      console.log(`generating ${output}`)
      await restoreImage({ prompt: item.restoration_prompt, output, quality: 'medium' })
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
