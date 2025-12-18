/**
 * AI助手服务
 */

import { API_BASE_URL } from './api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

/**
 * 流式聊天请求
 * @param request 聊天请求
 * @param onChunk 收到数据块时的回调
 * @param onError 错误回调
 * @param onDone 完成回调
 */
export async function chatStream(
  request: ChatRequest,
  onChunk: (content: string) => void,
  onError: (error: string) => void,
  onDone: () => void
): Promise<void> {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`${API_BASE_URL}/ai/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.msg || `请求失败: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法获取响应流');
    }

    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        onDone();
        break;
      }

      const text = decoder.decode(value, { stream: true });
      // 处理SSE格式数据
      const lines = text.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const content = line.substring(5).trim();
          if (content && content !== '[DONE]') {
            // 检查是否是错误消息
            if (content.startsWith('[ERROR]')) {
              onError(content.substring(7));
              return;
            }
            onChunk(content);
          }
        } else if (line.trim() && !line.startsWith(':')) {
          // 非SSE格式的直接内容
          if (line.startsWith('[ERROR]')) {
            onError(line.substring(7));
            return;
          }
          onChunk(line);
        }
      }
    }
  } catch (error) {
    console.error('AI聊天请求失败:', error);
    onError(error instanceof Error ? error.message : '请求失败');
  }
}
