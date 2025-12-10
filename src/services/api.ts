/**
 * API 基础配置和请求封装
 */

// 后端API基础URL
// 开发环境使用代理，生产环境使用环境变量配置的地址
export const API_BASE_URL = import.meta.env.DEV 
  ? '/api' 
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api');

/**
 * 统一响应结构
 */
export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

/**
 * 封装的fetch请求
 */
export async function request<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 如果有token，添加到请求头
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    // 检查响应状态
    if (!response.ok) {
      throw new Error(data.msg || '请求失败');
    }

    return data;
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

/**
 * GET 请求
 */
export function get<T = any>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  return request<T>(url, { ...options, method: 'GET' });
}

/**
 * POST 请求
 */
export function post<T = any>(url: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
  return request<T>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT 请求
 */
export function put<T = any>(url: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
  return request<T>(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE 请求
 */
export function del<T = any>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  return request<T>(url, { ...options, method: 'DELETE' });
}
