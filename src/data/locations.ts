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
  marbleWorld?: {
    url: string
    manifestPath: string
    thumbnail?: string
    caption?: string
  }
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
  timelines?: {
    id: string
    yearLabel: string
    eraLabel: string
    title: string
    subtitle: string
    image: string
    summary: string
    styleShift: string
    soundCue?: string
  }[]
  relatedLocations?: {
    id: string
    label: string
    reason: string
    actionLabel: string
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
    marbleWorld: {
      url: 'https://marble.worldlabs.ai/world/65ffde31-7008-49be-970f-5dbcce5cff55',
      manifestPath: 'public/worlds/jinmen/world.json',
      thumbnail: '/worlds/jinmen/assets/thumbnail.jpg',
      caption: '走进清末民初的钱街牌楼，观察铺面、招幌和街面人流如何组成旧城商业现场。',
    },
    ai: {
      musicStyle: '古风民乐，二胡与琵琶，略带沧桑',
      musicSearchKeywords: ['chinese folk erhu pipa historical street ambience', 'old Tianjin archive music'],
    },
    narration: {
      estimatedMinutes: 3,
      chapters: [
        {
          id: 'river-origin',
          title: '城市从河口开始',
          durationLabel: '0:00-0:35',
          body: '今天我们站在津门故里，看到的是一条热闹的旅游街。但它的历史底层，要从三岔河口、大运河和海河讲起。天津不是凭空出现的，它是被码头、船只、货物和人流一点点养出来的城市。',
          imageFocus: '先看街口与人流的关系，牌楼不是孤立装饰，而是通向宫南、宫北市集的入口。',
          soundCue: '河水、船桨、远处人声',
        },
        {
          id: 'temple-market',
          title: '香火把街市点亮',
          durationLabel: '0:35-1:20',
          body: '元泰定三年，天妃宫正式敕建。船民、渔民、商旅来到这里祈求平安，香火带来人流，人流又带来买卖。宫前集慢慢长出来，宫南大街和宫北大街也从庙前的日常里变得热闹。',
          imageFocus: '留意街道两侧的铺面、布幌、灯笼和木门板，它们把宗教入口变成了市井空间。',
          soundCue: '上香低语、叫卖、木门板卸下',
        },
        {
          id: 'commerce',
          title: '清末民国的商贸层',
          durationLabel: '1:20-2:10',
          body: '到了清末民国，这里不只是庙前街。香蜡铺、茶叶商号、银钱铺、洋货招牌和人力车，把老天津的商业网络压缩在一条并不宽的街巷里。你听到的算盘声、车铃声和讨价还价，其实都是城市转身前的声音。',
          imageFocus: '观察复原图里的招牌密度、人物尺度和交通工具，它们决定了“津味”的真实感。',
          soundCue: '算盘、车铃、茶箱搬运声',
        },
        {
          id: 'today',
          title: '现代景区下的旧记忆',
          durationLabel: '2:10-3:00',
          body: '1985 年天津启动修缮复建，1986 年元旦，现代古文化街开街。今天的津门故里当然是一条景区街，但它脚下叠着码头、信仰、集市、民俗和天津城市起点的多层记忆。所谓穿越，就是把这些层重新看见。',
          imageFocus: '对照现状图与复原图，现代旅游符号背后仍保留着街口、铺面和人流的空间关系。',
          soundCue: '音乐收束，现代人声慢慢回来',
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
    timelines: [
      {
        id: 'yuan-river-market',
        yearLabel: '1326',
        eraLabel: '元代',
        title: '河口信仰的起点',
        subtitle: '天妃宫敕建，街市还只是水运节点旁的雏形。',
        image: '/images/timelines/jinmen-1326.jpg',
        summary: '这一层不是今天的旅游街，而是三岔河口、船货、香火和早期聚落共同形成的城市底色。',
        styleShift: '从疏朗河口与土路摊棚，进入以宫庙为核心的早期市集空间。',
        soundCue: '船桨、水声、上岸脚步',
      },
      {
        id: 'late-qing-commerce',
        yearLabel: '20世纪初',
        eraLabel: '清末民初',
        title: '宫南钱街的商业密度',
        subtitle: '银号、茶铺、香蜡铺和人力车压缩在窄街里。',
        image: '/images/timelines/jinmen-1910.jpg',
        summary: '清末民初的津门故里开始呈现高密度铺面，宗教入口、码头贸易和旧城商业叠在一起。',
        styleShift: '从早期庙前集，转向招幌密集、门脸连续的清末民初商业街。',
        soundCue: '算盘、车铃、叫卖声',
      },
      {
        id: 'culture-street-opening',
        yearLabel: '1986',
        eraLabel: '当代修缮期',
        title: '古文化街开街',
        subtitle: '修缮复建后，现代文旅街区正式出现。',
        image: '/images/timelines/jinmen-1986.jpg',
        summary: '1985 年修缮复建、1986 年元旦开街，津门故里从历史街巷记忆转为可游览、可展示的民俗文化街区。',
        styleShift: '从自发生长的旧街，转向更整齐、更可识别的复建街区和民俗旅游界面。',
        soundCue: '自行车铃、人群、摊位招呼',
      },
    ],
    relatedLocations: [
      {
        id: 'tianhou',
        label: '天后宫山门',
        reason: '天后宫是津门故里的信仰源点，也是宫南、宫北街区形成的关键建筑。',
        actionLabel: '进入天后宫',
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
      estimatedMinutes: 3,
      chapters: [
        {
          id: 'river-mouth',
          title: '先听见三岔河口',
          durationLabel: '0:00-0:35',
          body: '天后宫的故事要从水声开始。三岔河口不是风景背景，而是早期天津最重要的水陆节点。船只在这里停靠，货物在这里换手，人也在这里寻找风浪之后的平安。',
          imageFocus: '复原图把山门放在宫前空地和水运动线之间，强调它不是孤立景点，而是漕运生活的一部分。',
          soundCue: '水声、木船摩擦、船工号子',
        },
        {
          id: 'built',
          title: '1326 年的敕建节点',
          durationLabel: '0:35-1:20',
          body: '资料里，天后宫有一个更早的初建说，也有一个更稳的节点：元泰定三年，也就是 1326 年，天妃宫正式敕建。它原本服务的不是游客，而是船民、漕运工和商旅的祈愿。',
          imageFocus: '观察山门的灰砖、木梁、门额和朴素尺度，避免把早期宫庙想象成过度华丽的景观。',
          soundCue: '钟鼓、上香低语、脚步停驻',
        },
        {
          id: 'market',
          title: '香火变成街市',
          durationLabel: '1:20-2:10',
          body: '船民上岸进香，宫前有戏楼酬神，幡杆红灯成为水上来客的标记。香火、人流和货流不断聚集，宫前集、市井摊铺、宫南宫北大街，也就在这种日常里慢慢形成。',
          imageFocus: '山门外的人群、摊铺、香炉和旗幡，是理解天津民俗生活的关键。',
          soundCue: '戏楼唱腔、锣钹、庙会叫卖',
        },
        {
          id: 'today',
          title: '从庙门回到城市入口',
          durationLabel: '2:10-3:00',
          body: '1985 年大规模重建后，天后宫与天津市民俗博物馆结合，成为展示天津民俗记忆的公共空间。今天站在山门前，我们看到的不只是一座庙门，而是天津从河口、码头、信仰到城市文化的入口。',
          imageFocus: '对照现状图，现代街区背后的河口、码头、宫前空地与山门动线重新变得清楚。',
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
        description: '船工和货担说明天后宫与水运生活紧密相连，但码头关系更适合理解为空间动线而非庙门贴河。',
      },
    ],
    timelines: [
      {
        id: 'yuan-decree',
        yearLabel: '1326',
        eraLabel: '元代',
        title: '敕建天妃宫',
        subtitle: '山门前是宫前空地与香火动线，水运关系退到背景里。',
        image: '/images/timelines/tianhou-1326.jpg',
        summary: '元泰定三年的节点适合表现“正式敕建”：庙宇服务船民、商旅和漕运生活，但不把山门画成紧贴河岸。',
        styleShift: '从河口交通节点，凝结出面向船民信仰的朴素宫庙建筑。',
        soundCue: '香火、脚步、远处船声',
      },
      {
        id: 'qing-temple-fair',
        yearLabel: '18世纪',
        eraLabel: '清代',
        title: '庙会与皇会',
        subtitle: '戏楼、旗幡、摊贩和花会让山门成为民俗中心。',
        image: '/images/timelines/tianhou-qing.jpg',
        summary: '清代到民国，天后宫不只是祭祀场所，也是天津皇会、戏曲、手艺和年货市集的重要现场。',
        styleShift: '从朴素祈愿空间，扩展为人流密集、仪式和市井并存的民俗场。',
        soundCue: '锣鼓、戏腔、庙会人声',
      },
      {
        id: 'folk-museum',
        yearLabel: '1985',
        eraLabel: '当代修复期',
        title: '民俗博物馆化',
        subtitle: '重建后的天后宫成为公共文化展示空间。',
        image: '/images/timelines/tianhou-1985.jpg',
        summary: '1985 年大规模重建后，天后宫与天津市民俗博物馆结合，宗教、民俗和城市记忆被重新组织成可展示的公共体验。',
        styleShift: '从民间信仰现场，转向修复后的城市民俗展陈空间。',
        soundCue: '自行车、讲解、人群回声',
      },
    ],
    relatedLocations: [
      {
        id: 'jinmen',
        label: '津门故里',
        reason: '从天后宫山门往外看，宫南、宫北街区就是围绕它生长出的津门故里。',
        actionLabel: '回到街区',
      },
    ],
    story: {
      paragraphs: [
        '元泰定三年，皇帝下旨在三岔河口水运区域敕建天妃宫。彼时漕船络绎，船工们从码头动线进入宫前，拜谢天妃护佑平安。',
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
      estimatedMinutes: 3,
      chapters: [
        {
          id: 'bridge-open',
          title: '桥先从钢铁里发声',
          durationLabel: '0:00-0:35',
          body: '解放桥的故事，先从钢铁里发声。它的旧名是万国桥，现桥在 1923 年开工，1927 年 10 月 18 日通车。桥合上时，车马和电车通行；桥打开时，船只从海河穿过。',
          imageFocus: '复原图中央的钢结构是视觉主轴，桥面轨道让交通功能变得清晰。',
          soundCue: '钢铁低鸣、河水、远处汽笛',
        },
        {
          id: 'traffic',
          title: '车站、租界和海河',
          durationLabel: '0:35-1:20',
          body: '这座桥的位置非常关键：一端连着天津站，一端通向解放北路和近代金融商业区。1930 年代，桥上有电车铃、人力车、早期汽车和车站旅客，桥下有船笛和码头号子。',
          imageFocus: '观察桥面上的交通层次，它是民国天津国际都会感的关键。',
          soundCue: '电车铃、车轮、皮鞋与布鞋脚步',
        },
        {
          id: 'riverbanks',
          title: '两岸的近代天津',
          durationLabel: '1:20-2:05',
          body: '桥的两侧，是租界建筑、银行、饭店、码头和车站人流。海河在这里不只是自然水面，更像一条把铁路、租界、商业和航运串起来的走廊。解放桥让天津的近代性变得可见。',
          imageFocus: '远处欧式建筑立面与河面反光共同构成租界时代的空间背景。',
          soundCue: '货箱落地、码头喊声、河面回音',
        },
        {
          id: 'opening-span',
          title: '开合之间的城市机器',
          durationLabel: '2:05-2:35',
          body: '万国桥最迷人的地方，是它作为双叶立转式开启钢桥的结构。大型船只通过时，桥面让出河道，钢梁、铆钉、齿轮和平衡重一起完成一次城市机器的动作。',
          imageFocus: '复原图需要强调开启桥跨结构，这也是它区别于普通城市桥梁的记忆点。',
          soundCue: '机械传动、桥面停顿、汽笛拉长',
        },
        {
          id: 'rename',
          title: '从万国桥到解放桥',
          durationLabel: '2:35-3:00',
          body: '1949 年天津解放后，万国桥更名为解放桥。2005 到 2007 年的大修，又让它重新具备开启能力。名字变了，城市功能变了，但桥面上的钢铁，仍然记得天津如何跨过海河，走向现代。',
          imageFocus: '在现状和复原图之间切换时，桥体结构是最稳定的时间锚点。',
          soundCue: '音乐从爵士转为低缓弦乐',
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
    timelines: [
      {
        id: 'wanguo-bridge',
        yearLabel: '1927',
        eraLabel: '民国',
        title: '万国桥通车',
        subtitle: '钢桁架、轨道和开启桥结构让海河成为城市机器的一部分。',
        image: '/images/timelines/jiefang-1927.jpg',
        summary: '1927 年万国桥通车，它连接车站、租界和金融商业区，是天津近代基础设施的强视觉节点。',
        styleShift: '从码头河岸交通，转向钢结构桥梁组织起来的近代都会空间。',
        soundCue: '电车铃、钢桥低鸣、汽笛',
      },
      {
        id: 'renamed-bridge',
        yearLabel: '1949',
        eraLabel: '新中国初期',
        title: '更名解放桥',
        subtitle: '城市叙事改变，钢桥成为新的公共记忆锚点。',
        image: '/images/timelines/jiefang-1949.jpg',
        summary: '1949 年天津解放后，万国桥更名为解放桥，桥的工程结构仍在，但它被放进了新的城市记忆里。',
        styleShift: '从租界交通设施，转向承载城市转折叙事的公共地标。',
        soundCue: '冬日脚步、低声交谈、远处号声',
      },
      {
        id: 'restored-opening',
        yearLabel: '2007',
        eraLabel: '当代修复期',
        title: '开启功能恢复',
        subtitle: '修复后的桥回到海河景观系统，成为现代城市封面。',
        image: '/images/timelines/jiefang-2007.jpg',
        summary: '2005-2007 年大修让解放桥重新具备开启能力，工业遗产、观光和城市夜景在同一座桥上重叠。',
        styleShift: '从交通桥和工业设施，转向可观看、可仪式化开启的海河地标。',
        soundCue: '游船、水面回声、景观灯亮起',
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
