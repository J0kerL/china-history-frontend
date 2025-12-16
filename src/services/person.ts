/**
 * 历史人物相关API服务
 */
import { get, ApiResponse } from './api';

/**
 * 后端返回的人物数据类型
 */
export interface PersonVO {
  id: number;
  name: string;
  surname: string | null;        // 姓氏
  givenName: string | null;      // 名（本名）
  courtesyName: string | null;   // 字
  artName: string | null;        // 号
  posthumousName: string | null; // 谥号
  templeName: string | null;     // 庙号
  dynastyId: number;
  dynastyName: string | null;
  birthYear: number | null;
  deathYear: number | null;
  summary: string;
  achievements: string[];        // 主要成就列表
}

/**
 * 获取随机人物列表（用于首页展示）
 * @param count 需要获取的人物数量，默认6个
 */
export async function getRandomPersons(count: number = 6): Promise<ApiResponse<PersonVO[]>> {
  return get<PersonVO[]>(`/person/random?count=${count}`);
}

/**
 * 根据ID获取人物详情
 */
export async function getPersonById(id: number): Promise<ApiResponse<PersonVO>> {
  return get<PersonVO>(`/person/${id}`);
}

/**
 * 获取所有人物列表
 */
export async function getAllPersons(): Promise<ApiResponse<PersonVO[]>> {
  return get<PersonVO[]>('/person/list');
}
