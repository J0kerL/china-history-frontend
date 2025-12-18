import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMemo } from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

/**
 * 预处理Markdown内容，修复常见格式问题
 */
function preprocessMarkdown(content: string): string {
  let processed = content;
  
  // 修复 "---###" 或 "---##" 这种格式（分隔线和标题连在一起）
  processed = processed.replace(/---+(#{1,6})/g, '\n\n$1');
  
  // 修复标题前没有换行的情况
  processed = processed.replace(/([^\n])(#{1,6}\s)/g, '$1\n\n$2');
  
  // 修复 "-" 开头的列表项前没有换行
  processed = processed.replace(/([^\n])(\n-\s)/g, '$1\n$2');
  
  // 确保标题后有换行
  processed = processed.replace(/(#{1,6}\s[^\n]+)(\n)([^#\n-])/g, '$1\n\n$3');
  
  return processed;
}

/**
 * 聊天消息组件 - 支持Markdown渲染
 */
export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";
  
  // 预处理内容
  const processedContent = useMemo(() => {
    return isUser ? content : preprocessMarkdown(content);
  }, [content, isUser]);

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* 头像 */}
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
          isUser 
            ? "bg-gradient-to-br from-slate-700 to-slate-800" 
            : "bg-gradient-to-br from-primary to-primary/70"
        }`}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Bot className="h-4 w-4 text-primary-foreground" />
        )}
      </div>

      {/* 消息内容 */}
      <div
        className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? "bg-gradient-to-br from-slate-700 to-slate-800 text-white"
            : "bg-card border border-border"
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="prose prose-sm prose-slate dark:prose-invert max-w-none 
                          prose-p:my-2 prose-p:leading-relaxed
                          prose-headings:mt-4 prose-headings:mb-2 prose-headings:first:mt-0
                          prose-ul:my-2 prose-ol:my-2
                          prose-li:my-0.5
                          prose-blockquote:my-2
                          prose-pre:my-2">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className="my-2 leading-relaxed text-sm">{children}</p>
                ),
                h1: ({ children }) => (
                  <h1 className="text-lg font-bold mt-4 mb-2 first:mt-0 text-foreground">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-bold mt-4 mb-2 first:mt-0 text-foreground">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-bold mt-3 mb-2 first:mt-0 text-foreground">{children}</h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-sm font-semibold mt-3 mb-1 first:mt-0 text-foreground">{children}</h4>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-5 my-2 space-y-1 text-sm">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-5 my-2 space-y-1 text-sm">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed text-sm">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-primary">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic">{children}</em>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-3 border-primary/40 pl-3 my-2 text-muted-foreground italic text-sm">
                    {children}
                  </blockquote>
                ),
                code: ({ className, children }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono text-primary">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="block bg-muted p-3 rounded-lg text-xs font-mono overflow-x-auto">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-muted rounded-lg overflow-x-auto my-2 text-xs">{children}</pre>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-2">
                    <table className="min-w-full border-collapse text-sm">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-border bg-muted px-2 py-1.5 text-left font-semibold text-sm">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-border px-2 py-1.5 text-sm">{children}</td>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:no-underline"
                  >
                    {children}
                  </a>
                ),
                hr: () => <hr className="my-3 border-border" />,
              }}
            >
              {processedContent}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
