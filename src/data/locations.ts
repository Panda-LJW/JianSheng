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
