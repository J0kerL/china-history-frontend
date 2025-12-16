/**
 * 朝代相关API服务
 */
import { get, ApiResponse } from './api';

/**
 * 后端返回的朝代数据类型
 */
export interface DynastyVO {
  id: number;
  name: string;
  startYear: number;
  endYear: number;
  capital: string;
  description: string;
}

/**
 * 前端展示用的朝代数据类型（包含计算字段）
 */
export interface DynastyDisplay extends DynastyVO {
  period: string;
  color: string;
}

/**
 * 格式化年份
 */
function formatYear(year: number | null): string {
  if (year === null || year === undefined) {
    return "未知";
  }
  if (year < 0) {
    return `约公元前${Math.abs(year)}年`;
  }
  return `公元${year}年`;
}

/**
 * 格式化时间段
 */
export function formatPeriod(startYear: number, endYear: number): string {
  return `${formatYear(startYear)} - ${formatYear(endYear)}`;
}

/**
 * 生成随机HSL颜色
 */
export function generateRandomColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = 45 + Math.floor(Math.random() * 30); // 45-75%
  const lightness = 40 + Math.floor(Math.random() * 15);  // 40-55%
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

/**
 * 转换为前端展示数据
 */
export function toDynastyDisplay(dynasty: DynastyVO): DynastyDisplay {
  return {
    ...dynasty,
    period: formatPeriod(dynasty.startYear, dynasty.endYear),
    color: generateRandomColor(),
  };
}

/**
 * 历史人物数据类型
 */
export interface PersonVO {
  id: number;
  name: string;
  styleName: string | null;
  dynastyId: number;
  birthYear: number | null;
  deathYear: number | null;
  summary: string;
  imageUrl: string | null;
}

/**
 * 历史事件数据类型
 */
export interface EventVO {
  id: number;
  title: string;
  startYear: number | null;
  endYear: number | null;
  dynastyId: number;
  category: string;
  summary: string;
  details: string;
}

/**
 * 朝代详情数据类型（包含相关人物和事件）
 */
export interface DynastyDetailVO {
  dynasty: DynastyVO;
  persons: PersonVO[];
  events: EventVO[];
}

/**
 * 获取所有朝代列表
 */
export async function getDynastyList(): Promise<ApiResponse<DynastyVO[]>> {
  return get<DynastyVO[]>('/dynasty/list');
}

/**
 * 根据ID获取朝代详情（包含相关人物和事件）
 */
export async function getDynastyDetail(id: number): Promise<ApiResponse<DynastyDetailVO>> {
  return get<DynastyDetailVO>(`/dynasty/${id}`);
}
