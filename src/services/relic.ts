/**
 * 历史遗迹相关API服务
 */
import { get, ApiResponse } from './api';
import { PageResult } from './placeName';

/**
 * 遗迹数据类型
 */
export interface RelicVO {
  id: number;
  name: string;
  location: string;
  dynastyId: number | null;
  dynastyName: string | null;
  relatedEventId: number | null;
  relatedEventTitle: string | null;
  description: string;
  coordinates: string | null;
}

/**
 * 获取所有遗迹列表
 */
export async function getRelicList(): Promise<ApiResponse<RelicVO[]>> {
  return get<RelicVO[]>('/relic/list');
}

/**
 * 根据ID获取遗迹详情
 */
export async function getRelicById(id: number): Promise<ApiResponse<RelicVO>> {
  return get<RelicVO>(`/relic/${id}`);
}

/**
 * 根据朝代ID获取遗迹列表
 */
export async function getRelicsByDynastyId(dynastyId: number): Promise<ApiResponse<RelicVO[]>> {
  return get<RelicVO[]>(`/relic/dynasty/${dynastyId}`);
}

/**
 * 搜索遗迹
 */
export async function searchRelics(keyword: string): Promise<ApiResponse<RelicVO[]>> {
  return get<RelicVO[]>(`/relic/search?keyword=${encodeURIComponent(keyword)}`);
}

/**
 * 分页查询遗迹
 */
export async function getRelicPage(page: number, size: number): Promise<ApiResponse<PageResult<RelicVO>>> {
  return get<PageResult<RelicVO>>(`/relic/page?page=${page}&size=${size}`);
}
