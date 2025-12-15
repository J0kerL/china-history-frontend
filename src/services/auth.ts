/**
 * 认证相关API服务
 */
import { post, get } from './api';

/**
 * 用户注册DTO
 */
export interface RegisterDTO {
  username: string;
  password: string;
  email: string;
}

/**
 * 用户登录DTO
 */
export interface LoginDTO {
  username: string;
  password: string;
}

/**
 * 用户VO
 */
export interface UserVO {
  id: number;
  username: string;
  email: string;
  createdAt: string;
}

/**
 * 登录成功返回VO
 */
export interface LoginVO {
  token: string;
  userId: number;
  username: string;
}

/**
 * 用户注册
 */
export async function register(data: RegisterDTO) {
  return post<UserVO>('/auth/register', data);
}

/**
 * 用户登录
 */
export async function login(data: LoginDTO) {
  return post<LoginVO>('/auth/login', data);
}

/**
 * 用户退出登录
 */
export async function logout() {
  return post<void>('/auth/logout');
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser() {
  return get<UserVO>('/auth/me');
}
