/**
 * 古今地名相关API服务
 */
import { get, ApiResponse } from './api';

/**
 * 地名数据类型
 */
export interface PlaceNameVO {
  id: number;
  ancientName: string;
  modernName: string;
  modernLocation: string;
  description: string;
}

/**
 * 分页结果类型
 */
export interface PageResult<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 获取所有地名列表
 */
export async function getPlaceNameList(): Promise<ApiResponse<PlaceNameVO[]>> {
  return get<PlaceNameVO[]>('/place-name/list');
}

/**
 * 根据ID获取地名详情
 */
export async function getPlaceNameById(id: number): Promise<ApiResponse<PlaceNameVO>> {
  return get<PlaceNameVO>(`/place-name/${id}`);
}

/**
 * 搜索地名
 */
export async function searchPlaceNames(keyword: string): Promise<ApiResponse<PlaceNameVO[]>> {
  return get<PlaceNameVO[]>(`/place-name/search?keyword=${encodeURIComponent(keyword)}`);
}

/**
 * 分页查询地名
 */
export async function getPlaceNamePage(page: number, size: number): Promise<ApiResponse<PageResult<PlaceNameVO>>> {
  return get<PageResult<PlaceNameVO>>(`/place-name/page?page=${page}&size=${size}`);
}
