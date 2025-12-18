import { useState, useEffect, useCallback } from 'react';
import { ChatMessage } from '@/services/ai';

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'ai_chat_sessions';
const MAX_SESSIONS = 50;

/**
 * 生成会话标题（取第一条用户消息的前20个字符）
 */
function generateTitle(messages: ChatMessage[]): string {
  const firstUserMsg = messages.find(m => m.role === 'user');
  if (firstUserMsg) {
    return firstUserMsg.content.slice(0, 20) + (firstUserMsg.content.length > 20 ? '...' : '');
  }
  return '新对话';
}

/**
 * 生成唯一ID
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/**
 * AI聊天历史记录Hook
 */
export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // 从localStorage加载会话
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ChatSession[];
        setSessions(parsed);
        // 自动选择最近的会话
        if (parsed.length > 0) {
          setCurrentSessionId(parsed[0].id);
        }
      }
    } catch (e) {
      console.error('加载聊天历史失败:', e);
    }
  }, []);

  // 保存到localStorage
  const saveSessions = useCallback((newSessions: ChatSession[]) => {
    // 限制最大会话数
    const limited = newSessions.slice(0, MAX_SESSIONS);
    setSessions(limited);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
    } catch (e) {
      console.error('保存聊天历史失败:', e);
    }
  }, []);

  // 获取当前会话
  const currentSession = sessions.find(s => s.id === currentSessionId) || null;

  // 创建新会话
  const createSession = useCallback((): ChatSession => {
    const newSession: ChatSession = {
      id: generateId(),
      title: '新对话',
      messages: [
        { role: 'assistant', content: '您好！我是华夏历史AI助手。请问有什么关于中国历史的问题想要了解吗？' }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const newSessions = [newSession, ...sessions];
    saveSessions(newSessions);
    setCurrentSessionId(newSession.id);
    return newSession;
  }, [sessions, saveSessions]);

  // 更新会话消息
  const updateMessages = useCallback((sessionId: string, messages: ChatMessage[]) => {
    const newSessions = sessions.map(s => {
      if (s.id === sessionId) {
        return {
          ...s,
          messages,
          title: generateTitle(messages),
          updatedAt: Date.now(),
        };
      }
      return s;
    });
    // 将更新的会话移到最前面
    newSessions.sort((a, b) => b.updatedAt - a.updatedAt);
    saveSessions(newSessions);
  }, [sessions, saveSessions]);

  // 删除会话
  const deleteSession = useCallback((sessionId: string) => {
    const newSessions = sessions.filter(s => s.id !== sessionId);
    saveSessions(newSessions);
    // 如果删除的是当前会话，切换到第一个或创建新会话
    if (sessionId === currentSessionId) {
      if (newSessions.length > 0) {
        setCurrentSessionId(newSessions[0].id);
      } else {
        setCurrentSessionId(null);
      }
    }
  }, [sessions, currentSessionId, saveSessions]);

  // 清空所有会话
  const clearAllSessions = useCallback(() => {
    saveSessions([]);
    setCurrentSessionId(null);
  }, [saveSessions]);

  // 切换会话
  const switchSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId);
  }, []);

  return {
    sessions,
    currentSession,
    currentSessionId,
    createSession,
    updateMessages,
    deleteSession,
    clearAllSessions,
    switchSession,
  };
}
