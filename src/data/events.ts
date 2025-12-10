export interface HistoricalEvent {
  id: string;
  name: string;
  year: number;
  yearDisplay: string;
  dynasty: string;
  category: "political" | "military" | "cultural" | "scientific";
  description: string;
  impact: string;
  figures: string[];
}

export const events: HistoricalEvent[] = [
  {
    id: "dayu-flood",
    name: "大禹治水",
    year: -2100,
    yearDisplay: "约前2100年",
    dynasty: "夏朝",
    category: "political",
    description: "大禹带领人民治理洪水，采用疏导的方法成功控制了水患。",
    impact: "奠定了夏朝建立的基础，大禹因治水功绩被推举为部落联盟首领。",
    figures: ["禹"]
  },
  {
    id: "wu-wang-fa-zhou",
    name: "武王伐纣",
    year: -1046,
    yearDisplay: "约前1046年",
    dynasty: "周朝",
    category: "military",
    description: "周武王率领诸侯联军在牧野击败商纣王，推翻了商朝统治。",
    impact: "结束了商朝的暴政，建立了西周王朝，确立了封建宗法制度。",
    figures: ["周武王", "姜子牙"]
  },
  {
    id: "unify-china",
    name: "秦统一六国",
    year: -221,
    yearDisplay: "前221年",
    dynasty: "秦朝",
    category: "political",
    description: "秦王嬴政先后消灭韩、赵、魏、楚、燕、齐六国，统一天下。",
    impact: "建立了中国历史上第一个统一的中央集权国家，统一了文字、货币、度量衡。",
    figures: ["秦始皇", "李斯", "王翦"]
  },
  {
    id: "silk-road",
    name: "张骞出使西域",
    year: -138,
    yearDisplay: "前138年",
    dynasty: "汉朝",
    category: "cultural",
    description: "汉武帝派遣张骞出使西域，开辟了丝绸之路。",
    impact: "打通了东西方贸易和文化交流的通道，促进了中外文明的交融。",
    figures: ["张骞", "汉武帝"]
  },
  {
    id: "three-kingdoms",
    name: "三国鼎立",
    year: 220,
    yearDisplay: "220年",
    dynasty: "三国",
    category: "political",
    description: "东汉灭亡后，魏、蜀、吴三国并立，形成三足鼎立的局面。",
    impact: "中国进入分裂时期，但也促进了各地区的开发和文化发展。",
    figures: ["曹操", "刘备", "孙权", "诸葛亮"]
  },
  {
    id: "zhenguan-zhizhi",
    name: "贞观之治",
    year: 627,
    yearDisplay: "627年 - 649年",
    dynasty: "唐朝",
    category: "political",
    description: "唐太宗李世民在位期间，政治清明、经济繁荣、社会安定。",
    impact: "奠定了唐朝盛世的基础，成为中国封建社会的典范盛世。",
    figures: ["唐太宗", "魏征", "房玄龄"]
  },
  {
    id: "an-shi-rebellion",
    name: "安史之乱",
    year: 755,
    yearDisplay: "755年 - 763年",
    dynasty: "唐朝",
    category: "military",
    description: "安禄山、史思明发动的叛乱，历时八年，唐朝由盛转衰。",
    impact: "唐朝国力大损，中央集权削弱，藩镇割据局面形成。",
    figures: ["安禄山", "史思明", "郭子仪"]
  },
  {
    id: "printing-invention",
    name: "活字印刷术发明",
    year: 1041,
    yearDisplay: "约1041年",
    dynasty: "宋朝",
    category: "scientific",
    description: "毕昇发明活字印刷术，大大提高了印刷效率。",
    impact: "推动了知识传播和文化普及，对世界文明产生深远影响。",
    figures: ["毕昇"]
  },
  {
    id: "zheng-he-voyages",
    name: "郑和下西洋",
    year: 1405,
    yearDisplay: "1405年 - 1433年",
    dynasty: "明朝",
    category: "cultural",
    description: "郑和率领船队七次远航，访问了亚非30多个国家和地区。",
    impact: "展示了中华文明的强大，促进了中外友好往来和文化交流。",
    figures: ["郑和", "明成祖"]
  },
  {
    id: "opium-war",
    name: "鸦片战争",
    year: 1840,
    yearDisplay: "1840年 - 1842年",
    dynasty: "清朝",
    category: "military",
    description: "英国为打开中国市场发动的侵略战争，中国战败签订《南京条约》。",
    impact: "中国开始沦为半殖民地半封建社会，标志着中国近代史的开端。",
    figures: ["林则徐", "道光帝"]
  }
];

export const getEventById = (id: string): HistoricalEvent | undefined => {
  return events.find(e => e.id === id);
};

export const getEventsByDynasty = (dynasty: string): HistoricalEvent[] => {
  return events.filter(e => e.dynasty === dynasty);
};

export const getEventsByCategory = (category: string): HistoricalEvent[] => {
  return events.filter(e => e.category === category);
};
