export interface HistoricalFigure {
  id: string;
  name: string;
  courtesy: string;
  dynasty: string;
  birthYear: number;
  deathYear: number;
  title: string;
  description: string;
  achievements: string[];
  category: "emperor" | "general" | "scholar" | "artist" | "scientist";
}

export const figures: HistoricalFigure[] = [
  {
    id: "qin-shi-huang",
    name: "秦始皇",
    courtesy: "嬴政",
    dynasty: "秦朝",
    birthYear: -259,
    deathYear: -210,
    title: "始皇帝",
    description: "中国历史上第一位皇帝，统一六国，建立中央集权制度。",
    achievements: ["统一六国", "统一文字货币度量衡", "修建长城", "兵马俑"],
    category: "emperor"
  },
  {
    id: "han-wudi",
    name: "汉武帝",
    courtesy: "刘彻",
    dynasty: "汉朝",
    birthYear: -156,
    deathYear: -87,
    title: "孝武皇帝",
    description: "西汉最杰出的皇帝之一，开疆拓土，独尊儒术。",
    achievements: ["独尊儒术", "开辟丝绸之路", "设立太学", "击败匈奴"],
    category: "emperor"
  },
  {
    id: "tang-taizong",
    name: "唐太宗",
    courtesy: "李世民",
    dynasty: "唐朝",
    birthYear: 598,
    deathYear: 649,
    title: "天可汗",
    description: "开创贞观之治，被誉为千古一帝。",
    achievements: ["玄武门之变", "贞观之治", "创建三省六部", "编撰《贞观政要》"],
    category: "emperor"
  },
  {
    id: "confucius",
    name: "孔子",
    courtesy: "仲尼",
    dynasty: "春秋",
    birthYear: -551,
    deathYear: -479,
    title: "至圣先师",
    description: "儒家学派创始人，中国古代最伟大的思想家和教育家。",
    achievements: ["创立儒学", "编修《春秋》", "整理《诗》《书》", "周游列国"],
    category: "scholar"
  },
  {
    id: "zhuge-liang",
    name: "诸葛亮",
    courtesy: "孔明",
    dynasty: "三国",
    birthYear: 181,
    deathYear: 234,
    title: "武侯",
    description: "蜀汉丞相，杰出的政治家、军事家、发明家。",
    achievements: ["隆中对", "赤壁之战", "北伐中原", "发明木牛流马"],
    category: "scholar"
  },
  {
    id: "li-bai",
    name: "李白",
    courtesy: "太白",
    dynasty: "唐朝",
    birthYear: 701,
    deathYear: 762,
    title: "诗仙",
    description: "唐代最伟大的浪漫主义诗人，被誉为诗仙。",
    achievements: ["《静夜思》", "《将进酒》", "《蜀道难》", "《望庐山瀑布》"],
    category: "artist"
  },
  {
    id: "yue-fei",
    name: "岳飞",
    courtesy: "鹏举",
    dynasty: "宋朝",
    birthYear: 1103,
    deathYear: 1142,
    title: "武穆王",
    description: "南宋抗金名将，民族英雄的典范。",
    achievements: ["岳家军", "收复建康", "颍昌大捷", "《满江红》"],
    category: "general"
  },
  {
    id: "sima-qian",
    name: "司马迁",
    courtesy: "子长",
    dynasty: "汉朝",
    birthYear: -145,
    deathYear: -90,
    title: "太史公",
    description: "中国伟大的史学家和文学家，被称为中国史学之父。",
    achievements: ["《史记》", "纪传体史书", "究天人之际", "通古今之变"],
    category: "scholar"
  }
];

export const getFigureById = (id: string): HistoricalFigure | undefined => {
  return figures.find(f => f.id === id);
};

export const getFiguresByDynasty = (dynasty: string): HistoricalFigure[] => {
  return figures.filter(f => f.dynasty === dynasty);
};
