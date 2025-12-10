export interface Dynasty {
  id: string;
  name: string;
  period: string;
  startYear: number;
  endYear: number;
  capital: string;
  description: string;
  emperors: string[];
  events: string[];
  color: string;
}

export const dynasties: Dynasty[] = [
  {
    id: "xia",
    name: "夏朝",
    period: "约前2070年 - 约前1600年",
    startYear: -2070,
    endYear: -1600,
    capital: "阳城（今河南登封）",
    description: "中国历史上第一个世袭制朝代，标志着中国从原始社会进入奴隶社会。",
    emperors: ["禹", "启", "太康", "少康", "桀"],
    events: ["大禹治水", "夏启建国", "少康中兴"],
    color: "hsl(35 60% 50%)"
  },
  {
    id: "shang",
    name: "商朝",
    period: "约前1600年 - 约前1046年",
    startYear: -1600,
    endYear: -1046,
    capital: "殷（今河南安阳）",
    description: "甲骨文和青铜器文明的鼎盛时期，是中国有文字记载的最早朝代。",
    emperors: ["成汤", "盘庚", "武丁", "纣王"],
    events: ["成汤灭夏", "盘庚迁殷", "武丁中兴"],
    color: "hsl(38 70% 50%)"
  },
  {
    id: "zhou",
    name: "周朝",
    period: "约前1046年 - 前256年",
    startYear: -1046,
    endYear: -256,
    capital: "镐京、洛邑",
    description: "中国历史上最长的朝代，分为西周和东周，确立了封建宗法制度。",
    emperors: ["周武王", "周成王", "周穆王", "周幽王"],
    events: ["武王伐纣", "周公东征", "平王东迁", "百家争鸣"],
    color: "hsl(220 55% 45%)"
  },
  {
    id: "qin",
    name: "秦朝",
    period: "前221年 - 前207年",
    startYear: -221,
    endYear: -207,
    capital: "咸阳（今陕西咸阳）",
    description: "中国历史上第一个统一的中央集权制国家，统一文字、货币、度量衡。",
    emperors: ["秦始皇", "秦二世"],
    events: ["统一六国", "修建长城", "焚书坑儒", "陈胜吴广起义"],
    color: "hsl(5 75% 45%)"
  },
  {
    id: "han",
    name: "汉朝",
    period: "前202年 - 220年",
    startYear: -202,
    endYear: 220,
    capital: "长安、洛阳",
    description: "中国历史上最强盛的朝代之一，开辟了丝绸之路，奠定了汉族的基础。",
    emperors: ["汉高祖", "汉武帝", "汉光武帝", "汉献帝"],
    events: ["楚汉之争", "文景之治", "张骞出使西域", "王莽篡汉"],
    color: "hsl(38 70% 50%)"
  },
  {
    id: "tang",
    name: "唐朝",
    period: "618年 - 907年",
    startYear: 618,
    endYear: 907,
    capital: "长安（今陕西西安）",
    description: "中国历史上最繁荣的朝代之一，文化艺术达到巅峰，是世界性大国。",
    emperors: ["唐太宗", "唐玄宗", "武则天", "唐宪宗"],
    events: ["玄武门之变", "贞观之治", "开元盛世", "安史之乱"],
    color: "hsl(280 50% 45%)"
  },
  {
    id: "song",
    name: "宋朝",
    period: "960年 - 1279年",
    startYear: 960,
    endYear: 1279,
    capital: "开封、临安",
    description: "经济文化高度发达，出现了活字印刷、火药、指南针等重大发明。",
    emperors: ["宋太祖", "宋仁宗", "宋徽宗", "宋高宗"],
    events: ["陈桥兵变", "杯酒释兵权", "靖康之耻", "岳飞抗金"],
    color: "hsl(170 45% 40%)"
  },
  {
    id: "yuan",
    name: "元朝",
    period: "1271年 - 1368年",
    startYear: 1271,
    endYear: 1368,
    capital: "大都（今北京）",
    description: "中国历史上首个由少数民族建立的大一统王朝，疆域空前辽阔。",
    emperors: ["元世祖忽必烈", "元成宗", "元武宗", "元顺帝"],
    events: ["建立元朝", "马可·波罗来华", "红巾军起义"],
    color: "hsl(200 50% 45%)"
  },
  {
    id: "ming",
    name: "明朝",
    period: "1368年 - 1644年",
    startYear: 1368,
    endYear: 1644,
    capital: "南京、北京",
    description: "汉族建立的最后一个大一统王朝，郑和下西洋开创了航海新纪元。",
    emperors: ["明太祖", "明成祖", "明神宗", "崇祯帝"],
    events: ["朱元璋建明", "郑和下西洋", "土木堡之变", "李自成起义"],
    color: "hsl(220 55% 45%)"
  },
  {
    id: "qing",
    name: "清朝",
    period: "1636年 - 1912年",
    startYear: 1636,
    endYear: 1912,
    capital: "北京",
    description: "中国最后一个封建王朝，康乾盛世达到封建社会的巅峰。",
    emperors: ["康熙帝", "雍正帝", "乾隆帝", "慈禧太后"],
    events: ["清军入关", "康乾盛世", "鸦片战争", "辛亥革命"],
    color: "hsl(35 60% 50%)"
  }
];

export const getDynastyById = (id: string): Dynasty | undefined => {
  return dynasties.find(d => d.id === id);
};
