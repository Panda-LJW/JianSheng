export interface LocationData {
  id: string
  name: string
  era: string
  subtitle: string
  archiveNote: string
  presentYear: number
  pastYear: number
  presentImage: string
  pastImage: string
  imagePosition?: string
  marbleVideo?: string
  bgmAudio: string
  pipeline?: {
    status: 'ready' | 'partial' | 'missing'
    analysisPath?: string
    restoredImagePath?: string
    worldManifestPath?: string
    notes: string[]
  }
  ai?: {
    restorationPrompt?: string
    musicStyle?: string
    musicSearchKeywords?: string[]
  }
  narration?: {
    estimatedMinutes: number
    chapters: {
      id: string
      title: string
      durationLabel: string
      body: string
      imageFocus?: string
      soundCue?: string
    }[]
  }
  imageHotspots?: {
    id: string
    x: number
    y: number
    title: string
    description: string
  }[]
  story: {
    paragraphs: string[]
    highlightQuote?: string
    soundscape: string[]
  }
}

export const locations: LocationData[] = [
  {
    id: 'jinmen',
    name: '津门故里',
    era: '清末民初 · 1910',
    subtitle: '天津 · 宫南大街',
    archiveNote: '银号、钱铺与黄包车交错的旧城街面',
    presentYear: 2026,
    pastYear: 1910,
    presentImage: '/images/jinmen_present.jpg',
    pastImage: '/images/jinmen_past.jpg',
    imagePosition: 'center 42%',
    bgmAudio: '/audio/jinmen_bgm.mp3',
    pipeline: {
      status: 'ready',
      analysisPath: 'workflow/output/demo-analyses.json#jinmen',
      restoredImagePath: 'public/images/jinmen_past.jpg',
      worldManifestPath: 'public/worlds/jinmen/world.json',
      notes: [
        '前端展示数据来自静态 manifest，字段已对齐 workflow 的 analysis/restored/world 产物。',
        '津门故里已有离线 Marble world manifest，可作为未来 3D 入口依据。',
      ],
    },
    ai: {
      musicStyle: '古风民乐，二胡与琵琶，略带沧桑',
      musicSearchKeywords: ['chinese folk erhu pipa historical street ambience', 'old Tianjin archive music'],
    },
    narration: {
      estimatedMinutes: 7,
      chapters: [
        {
          id: 'opening',
          title: '从牌楼下醒来',
          durationLabel: '0:00-0:45',
          body: '先不要急着看招牌，站在牌楼阴影里听一会儿。清晨的宫南大街还带着潮气，木门板被一块块卸下，钱铺掌柜把算盘推到柜台前，整条街像刚刚开嗓。',
          imageFocus: '复原图中央的旧式木质牌楼，比今天的旅游入口更朴素，也更接近清末街口的尺度。',
          soundCue: '木门板、算盘珠、远处晨钟',
        },
        {
          id: 'commerce',
          title: '钱街的生意声',
          durationLabel: '0:45-2:10',
          body: '这里被叫作钱街，不是因为它宽阔，而是因为银号、钱铺、金店密集。生意人从牌楼下穿过，长袍下摆擦过石板路，黄包车在旁边慢下来，等一个刚谈完账的客人。',
          imageFocus: '观察街道两侧低矮铺面和竖向招牌，它们决定了这条街的商业密度。',
          soundCue: '银元碰撞、账房低语、车轮压过石板',
        },
        {
          id: 'transition',
          title: '旧城与租界之间',
          durationLabel: '2:10-3:35',
          body: '清末的天津正在换气。洋行和银行慢慢往租界移动，旧城里的买卖却没有停。街上的人或许还不知道，自己每天经过的地方，正在被时代一点点推到历史的门槛上。',
          imageFocus: '复原图的色调保持灰褐和暗红，不强调繁华，而强调旧城转身前的沉稳。',
          soundCue: '远处车铃、商铺吆喝、骡马脚步',
        },
        {
          id: 'people',
          title: '路过这里的人',
          durationLabel: '3:35-5:05',
          body: '挑担的苦力、戴瓜皮帽的店伙计、赶车的车夫、刚从银号出来的商人，都在同一条窄街上相遇。见声想让用户听见的，不只是地标本身，而是这些细小的日常。',
          imageFocus: '把视线放到人物尺度上，会发现复原图真正的主角不是建筑，而是城市生活。',
          soundCue: '脚步、衣料摩擦、短促招呼',
        },
        {
          id: 'today',
          title: '今天再看见它',
          durationLabel: '5:05-7:00',
          body: '今天的津门故里更像一个文旅入口，牌楼更完整，游客更多。但当复原图和声音叠在一起，用户会明白：所谓穿越，不是看一张旧照片，而是重新理解脚下这条街曾经怎样运转。',
          imageFocus: '回看现状图与复原图的差异，旅游符号背后仍保留着街口、商铺和人流的空间关系。',
          soundCue: '音乐渐弱，街声回到现代',
        },
      ],
    },
    imageHotspots: [
      {
        id: 'pailou',
        x: 50,
        y: 31,
        title: '木质牌楼',
        description: '复原为清末街口尺度，少了现代景区装饰，多了风化木构和灰瓦顶。',
      },
      {
        id: 'money-street',
        x: 65,
        y: 58,
        title: '钱街铺面',
        description: '银号、钱铺和杂货铺沿街展开，竖招与木门板形成密集商业界面。',
      },
      {
        id: 'rickshaw',
        x: 38,
        y: 70,
        title: '黄包车与行人',
        description: '人物和车流让画面从建筑复原变成可听见的市井现场。',
      },
    ],
    story: {
      paragraphs: [
        '清末宣统年间。这里还不叫「津门故里」，人们唤它「宫南大街」——因为它在天后宫的南边。',
        '街道不宽，但两侧银号钱铺鳞次栉比，被人称作「钱街」。彼时八国联军刚刚撤走，洋行开始从这条街迁往租界。',
        '但天津人的生意照做——银子照收，元宝照铸，牌楼下的黄包车照跑。',
        '这是一条正在告别旧时代、走向新世界的街。只是街上的人，还不知道。',
      ],
      highlightQuote: '先有天后宫，后有天津卫',
      soundscape: [
        '银号开门卸下木门板的声响',
        '算盘珠子噼里啪啦拨动',
        '黄包车车夫穿过牌楼的吆喝',
        '远处天后宫传来的晨钟',
        '骡马大车碾过石板路',
      ],
    },
  },
  {
    id: 'tianhou',
    name: '天后宫山门',
    era: '元泰定三年 · 1326',
    subtitle: '天津 · 三岔河口',
    archiveNote: '比城市名更早出现的河口庙宇',
    presentYear: 2026,
    pastYear: 1326,
    presentImage: '/images/tianhou_present.jpg',
    pastImage: '/images/tianhou_past.jpg',
    imagePosition: 'center center',
    bgmAudio: '/audio/tianhou_bgm.mp3',
    pipeline: {
      status: 'partial',
      analysisPath: 'workflow/output/demo-analyses.json#tianhou',
      restoredImagePath: 'public/images/tianhou_past.jpg',
      notes: [
        '已有离线分析与历史复原图，可直接用于前端演示。',
        '当前没有本地 Marble world manifest，前端应展示为复原图探索而非 3D 场景。',
      ],
    },
    ai: {
      musicStyle: '古琴空灵，庄重悠远',
      musicSearchKeywords: ['ancient chinese temple guqin river ambience', 'yuan dynasty ritual music'],
    },
    narration: {
      estimatedMinutes: 6,
      chapters: [
        {
          id: 'river-mouth',
          title: '先听见三岔河口',
          durationLabel: '0:00-0:50',
          body: '天后宫的故事要从水声开始。三岔河口不是安静的背景，而是天津形成以前最重要的交通节点。船只靠岸、货担上肩，香客和船工在同一个山门前停下脚步。',
          imageFocus: '复原图把山门放在河口与码头之间，强调它不是孤立景点，而是漕运生活的一部分。',
          soundCue: '水声、木船摩擦、船工号子',
        },
        {
          id: 'temple-gate',
          title: '山门不是入口，是灯塔',
          durationLabel: '0:50-2:05',
          body: '山门前的幡杆和气死风灯，在夜里会成为船只辨认方向的标志。对于回来的船工来说，这里既是庙门，也是风浪之后终于抵达天津的信号。',
          imageFocus: '留意山门前高耸幡杆，它们把宗教空间和航运功能连在一起。',
          soundCue: '灯杆旗绳、晚风、远处钟磬',
        },
        {
          id: 'ritual',
          title: '船工的第一炷香',
          durationLabel: '2:05-3:20',
          body: '漕船靠岸后，船工们会带着一路风浪的疲惫来到庙前。焚香不是表演，而是一种朴素的确认：船平安到了，人也平安到了。',
          imageFocus: '人物姿态要看得慢一些，庙祝、香客、船工构成了山门前的社会关系。',
          soundCue: '香火、低声祈愿、脚步停驻',
        },
        {
          id: 'older-than-city',
          title: '比城市名更早',
          durationLabel: '3:20-4:45',
          body: '今天人们熟悉的是天津这座城市，但天后宫的历史比“天津卫”的名字还要早。它不是城市的装饰，而是城市从水路贸易、漕运和信仰里长出来的证据。',
          imageFocus: '土色墙面和灰瓦屋顶让建筑显得朴素，避免把元代庙宇做成过度华丽的景观。',
          soundCue: '低沉鼓点、河面风声',
        },
        {
          id: 'today',
          title: '从景点回到河口',
          durationLabel: '4:45-6:20',
          body: '当用户今天站在天后宫山门前，最容易看到的是景区牌匾和游客动线。复原图和声音要帮他重新看见河口、船只、灯杆和香火，理解这个入口曾经如何保护一座水上城市。',
          imageFocus: '对照现状图，现代街区消失后，河口和庙门的关系重新变得清楚。',
          soundCue: '现代人声退后，水声重新出现',
        },
      ],
    },
    imageHotspots: [
      {
        id: 'gate',
        x: 52,
        y: 39,
        title: '元代山门',
        description: '山门尺度克制，灰瓦、木梁和土色墙面强调早期庙宇的朴素庄重。',
      },
      {
        id: 'flagpole',
        x: 73,
        y: 27,
        title: '幡杆与气死风灯',
        description: '它们既是庙前仪式物，也是海河夜航船只识别方向的标志。',
      },
      {
        id: 'dock',
        x: 27,
        y: 66,
        title: '漕运码头',
        description: '船工、货担和木栈桥说明天后宫与水运生活紧密相连。',
      },
    ],
    story: {
      paragraphs: [
        '元泰定三年，皇帝下旨在海河三岔河口修建天妃宫。彼时海河上漕船络绎，船工们冒着风浪归来，第一件事便是到此拜谢天妃护佑平安。',
        '山门前两根幡杆高悬气死风灯，是夜航船只的灯塔。',
        '这座庙宇，比这座城市的名字还要古老。',
      ],
      highlightQuote: '先有天后宫，后有天津卫',
      soundscape: [
        '船桨划过河面的水声',
        '纤夫拉纤的号子',
        '庙前集市的叫卖',
        '钟磬声穿过回廊',
        '幡杆旗帜猎猎作响',
        '远处，海鸥掠过水面',
      ],
    },
  },
  {
    id: 'jiefang',
    name: '解放桥',
    era: '民国 · 1930s',
    subtitle: '天津 · 海河',
    archiveNote: '钢铁桁架、汽笛与租界灯火',
    presentYear: 2026,
    pastYear: 1930,
    presentImage: '/images/jiefang_present.jpg',
    pastImage: '/images/jiefang_past.jpg',
    imagePosition: 'center center',
    bgmAudio: '/audio/jiefang_bgm.mp3',
    pipeline: {
      status: 'partial',
      analysisPath: 'workflow/output/demo-analyses.json#jiefang',
      restoredImagePath: 'public/images/jiefang_past.jpg',
      notes: [
        '已有离线分析与历史复原图，适合作为上传示例默认结果。',
        '当前没有本地 Marble world manifest，前端只呈现复原图探索与章节叙事。',
      ],
    },
    ai: {
      musicStyle: '怀旧爵士与钢琴，民国都会氛围',
      musicSearchKeywords: ['1930s Shanghai Tianjin jazz instrumental river bridge', 'vintage city gramophone piano'],
    },
    narration: {
      estimatedMinutes: 8,
      chapters: [
        {
          id: 'bridge-open',
          title: '桥先从钢铁里发声',
          durationLabel: '0:00-0:55',
          body: '解放桥的旧名是万国桥。听这段声音时，先把注意力放到钢桁架上：铆钉、轨道、开启桥跨，每一个结构都在告诉用户，这不是一座只供拍照的桥，而是一台曾经真正运转的城市机器。',
          imageFocus: '复原图中央的钢结构是视觉主轴，桥面轨道让交通功能变得清晰。',
          soundCue: '钢铁低鸣、河水、远处汽笛',
        },
        {
          id: 'traffic',
          title: '电车、黄包车和行人',
          durationLabel: '0:55-2:20',
          body: '1930年代的桥面不安静。电车铃声从一端传来，黄包车贴着人群穿过，穿长衫的人和穿西装的人在桥中央擦肩。见声要让这座桥重新拥有人流，而不是只剩一个地标轮廓。',
          imageFocus: '观察桥面上的交通层次，它是民国天津国际都会感的关键。',
          soundCue: '电车铃、车轮、皮鞋与布鞋脚步',
        },
        {
          id: 'riverbanks',
          title: '两岸的洋行与银行',
          durationLabel: '2:20-3:55',
          body: '桥的两侧，是银行、洋行、饭店和码头。海河在这里不只是自然水面，更像一条金融与贸易的走廊。船只经过，货箱上岸，城市的野心沿着河岸铺开。',
          imageFocus: '远处欧式建筑立面与河面反光共同构成租界时代的空间背景。',
          soundCue: '货箱落地、码头喊声、河面回音',
        },
        {
          id: 'opening-span',
          title: '可以开启的桥',
          durationLabel: '3:55-5:20',
          body: '万国桥最迷人的地方，是它中段可以开启。大型船只通过时，桥不再只是路面，而会变成一次城市仪式：人们停下，钢结构抬起，河道重新成为主角。',
          imageFocus: '复原图需要强调开启桥跨结构，这也是它区别于普通城市桥梁的记忆点。',
          soundCue: '机械传动、桥面停顿、汽笛拉长',
        },
        {
          id: 'rename',
          title: '名字改了，河水还在',
          durationLabel: '5:20-6:45',
          body: '后来万国桥改名为解放桥。名字变化背后，是城市历史的翻页。但桥面上的钢铁、河里的水声、两岸的建筑尺度，还保留着那段复杂的现代化记忆。',
          imageFocus: '在现状和复原图之间切换时，桥体结构是最稳定的时间锚点。',
          soundCue: '音乐从爵士转为低缓弦乐',
        },
        {
          id: 'today',
          title: '今天为什么还要听它',
          durationLabel: '6:45-8:00',
          body: '今天的解放桥很容易被当成城市打卡点。长音频和图像探索要做的，是让用户在听完之前不断发现细节：桥为什么这样建，谁从这里经过，两岸为什么会这样繁忙。',
          imageFocus: '复原图放大探索会让用户把等待音频的时间变成发现细节的时间。',
          soundCue: '桥声渐弱，现代海河夜景浮现',
        },
      ],
    },
    imageHotspots: [
      {
        id: 'steel',
        x: 50,
        y: 38,
        title: '钢桁架结构',
        description: '铆钉和桥梁骨架保留万国桥作为近代工程设施的硬朗气质。',
      },
      {
        id: 'tram',
        x: 42,
        y: 62,
        title: '桥面电车',
        description: '电车轨道把桥从观景地标还原为真实交通节点。',
      },
      {
        id: 'riverbank',
        x: 76,
        y: 53,
        title: '海河两岸',
        description: '银行、洋行与码头共同塑造民国天津的国际都会感。',
      },
      {
        id: 'boats',
        x: 23,
        y: 72,
        title: '河面船只',
        description: '船只和货运让海河成为贸易走廊，而不只是桥下风景。',
      },
    ],
    story: {
      paragraphs: [
        '民国十六年。法国工程师设计的万国桥正式通车。钢铁桁架横跨海河，中段可以向上开启，让大型船只通过。',
        '桥上有电车轨道，黄包车和行人穿梭其间。两岸是银行、洋行和饭店，海河在这里成了一条流淌着财富与野心的河。',
        '后来它改名叫解放桥。但河水依旧，桥面上的钢铁依旧记得那些脚步声。',
      ],
      highlightQuote: '万国桥上，万国来往',
      soundscape: [
        '河水拍打桥墩',
        '电车铃声叮当',
        '码头搬运工的吆喝',
        '桥面钢铁的低沉共鸣',
        '远处汽笛长鸣',
      ],
    },
  },
]

export function getLocation(id: string) {
  return locations.find((location) => location.id === id)
}
