import { useState, useRef, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  Bot,
  Sparkles,
  Loader2,
  Square,
  Plus,
  Trash2,
  MessageSquare,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { chatStream, ChatMessage as ChatMessageType } from "@/services/ai";
import { useChatHistory } from "@/hooks/useChatHistory";
import { ChatMessage } from "@/components/chat/ChatMessage";

const suggestedQuestions = [
  "秦始皇统一六国的原因？",
  "唐朝为何称为盛世？",
  "丝绸之路的历史意义",
  "郑和下西洋的影响",
];

const AIAssistant = () => {
  const {
    sessions,
    currentSession,
    currentSessionId,
    createSession,
    updateMessages,
    deleteSession,
    clearAllSessions,
    switchSession,
  } = useChatHistory();

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true); // 桌面端默认展开
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // 移动端侧边栏
  const [userScrolled, setUserScrolled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messages = currentSession?.messages || [
    {
      role: "assistant" as const,
      content: "您好！我是华夏历史AI助手，有什么关于中国历史的问题想要了解吗？",
    },
  ];

  const scrollToBottom = useCallback(() => {
    if (!userScrolled && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [userScrolled]);

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    if (isAtBottom) {
      setUserScrolled(false);
    } else if (isLoading) {
      setUserScrolled(true);
    }
  }, [isLoading]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse, scrollToBottom]);

  useEffect(() => {
    if (isLoading) setUserScrolled(false);
  }, [isLoading]);

  useEffect(() => {
    if (sessions.length === 0) createSession();
  }, [sessions.length, createSession]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  // 关闭移动端侧边栏
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setUserScrolled(false);

    let sessionId = currentSessionId;
    if (!sessionId) {
      const newSession = createSession();
      sessionId = newSession.id;
    }

    const newMessages: ChatMessageType[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    updateMessages(sessionId, newMessages);
    setIsLoading(true);
    setCurrentResponse("");

    const history = messages.slice(1).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    try {
      let fullResponse = "";
      await chatStream(
        { message: userMessage, history },
        (content) => {
          fullResponse += content;
          setCurrentResponse(fullResponse);
        },
        (error) => {
          updateMessages(sessionId!, [
            ...newMessages,
            { role: "assistant", content: `抱歉，发生了错误：${error}` },
          ]);
          setIsLoading(false);
          setCurrentResponse("");
        },
        () => {
          if (fullResponse) {
            updateMessages(sessionId!, [
              ...newMessages,
              { role: "assistant", content: fullResponse },
            ]);
          }
          setIsLoading(false);
          setCurrentResponse("");
        }
      );
    } catch {
      updateMessages(sessionId, [
        ...newMessages,
        { role: "assistant", content: "抱歉，连接AI服务失败，请稍后重试。" },
      ]);
      setIsLoading(false);
      setCurrentResponse("");
    }
  };

  const handleStop = () => {
    if (currentResponse && currentSessionId) {
      updateMessages(currentSessionId, [
        ...messages,
        { role: "assistant", content: currentResponse },
      ]);
    }
    setIsLoading(false);
    setCurrentResponse("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    createSession();
    setMobileSidebarOpen(false);
  };

  const handleSwitchSession = (sessionId: string) => {
    switchSession(sessionId);
    setMobileSidebarOpen(false);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <Navbar />

      <div className="flex-1 flex pt-16 overflow-hidden relative">
        {/* 移动端遮罩 */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* 侧边栏 */}
        <aside
          className={`
            fixed md:relative inset-y-0 left-0 z-50 md:z-0
            w-72 bg-card border-r border-border
            transform transition-all duration-300 ease-in-out
            ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            ${sidebarOpen ? "md:translate-x-0 md:w-64" : "md:-translate-x-full md:w-0 md:border-r-0"}
            pt-16 md:pt-0 flex flex-col
          `}
        >
          {/* 侧边栏头部 */}
          <div className="p-4 border-b border-border">
            <Button
              onClick={handleNewChat}
              className="w-full gap-2 bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              新建对话
            </Button>
          </div>

          {/* 会话列表 */}
          <div className="flex-1 overflow-y-auto p-2">
            {sessions.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-8">
                暂无历史记录
              </div>
            ) : (
              <div className="space-y-1">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => handleSwitchSession(session.id)}
                    className={`
                      group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer
                      transition-all duration-200
                      ${
                        session.id === currentSessionId
                          ? "bg-primary/10 shadow-sm"
                          : "hover:bg-muted/80"
                      }
                    `}
                  >
                    <MessageSquare
                      className={`h-4 w-4 flex-shrink-0 ${
                        session.id === currentSessionId
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {session.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(session.updatedAt)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 清空按钮 */}
          {sessions.length > 0 && (
            <div className="p-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={clearAllSessions}
              >
                <Trash2 className="h-4 w-4" />
                清空记录
              </Button>
            </div>
          )}
        </aside>

        {/* 主聊天区域 */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* 顶部栏 */}
          <header className="h-14 border-b border-border flex items-center px-4 gap-3 bg-background/80 backdrop-blur-sm flex-shrink-0">
            {/* 移动端菜单按钮 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="h-9 w-9 p-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            {/* 桌面端侧边栏切换按钮 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-9 w-9 p-0 hidden md:flex"
            >
              {sidebarOpen ? (
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeft className="h-5 w-5" />
              )}
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-base">AI 历史助手</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  探索五千年华夏文明
                </p>
              </div>
            </div>
          </header>

          {/* 消息区域 */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto"
          >
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {/* 欢迎区域 - 仅在没有用户消息时显示 */}
              {messages.length === 1 && messages[0].role === "assistant" && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Sparkles className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">华夏历史AI助手</h2>
                  <p className="text-muted-foreground text-sm mb-6">
                    有什么关于中国历史的问题想要了解吗？
                  </p>
                  <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                    {suggestedQuestions.map((q, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="h-auto py-3 px-4 text-sm text-left justify-start rounded-xl hover:bg-primary/5 hover:border-primary/30"
                        onClick={() => setInput(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* 消息列表 */}
              {(messages.length > 1 ||
                messages[0]?.role !== "assistant" ||
                isLoading) && (
                <>
                  {messages.map((msg, i) => (
                    <ChatMessage key={i} role={msg.role} content={msg.content} />
                  ))}

                  {isLoading && currentResponse && (
                    <ChatMessage role="assistant" content={currentResponse} />
                  )}

                  {isLoading && !currentResponse && (
                    <div className="flex gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="rounded-2xl px-4 py-3 bg-card border border-border shadow-sm">
                        <div className="flex items-center gap-3">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">
                            正在思考...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* 输入区域 */}
          <div className="border-t border-border bg-background/80 backdrop-blur-sm flex-shrink-0">
            <div className="max-w-3xl mx-auto px-4 py-4">
              {/* 快捷问题 - 仅在有对话时显示 */}
              {messages.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {suggestedQuestions.slice(0, 2).map((q, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 rounded-full hover:bg-primary/5 hover:border-primary/30"
                      onClick={() => setInput(q)}
                      disabled={isLoading}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              )}

              {/* 输入框 */}
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="输入历史问题，Enter 发送..."
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="min-h-[56px] max-h-[120px] resize-none text-sm rounded-2xl pr-4 py-4 bg-muted/50 border-muted-foreground/20 focus:border-primary/50 focus:bg-background transition-colors"
                    rows={1}
                  />
                </div>
                {isLoading ? (
                  <Button
                    onClick={handleStop}
                    variant="destructive"
                    className="h-14 w-14 rounded-2xl p-0 shadow-sm"
                  >
                    <Square className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="h-14 w-14 rounded-2xl p-0 shadow-sm bg-primary hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                )}
              </div>

              <p className="text-xs text-muted-foreground text-center mt-3">
                Shift + Enter 换行 · AI回答仅供参考
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AIAssistant;
