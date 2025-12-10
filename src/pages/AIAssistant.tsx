import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Sparkles } from "lucide-react";

const suggestedQuestions = [
  "秦始皇为什么要统一六国？",
  "唐朝为什么被称为盛世？",
  "丝绸之路的历史意义是什么？",
  "明朝郑和下西洋有什么影响？"
];

const AIAssistant = () => {
  const [messages, setMessages] = useState<{role: "user" | "assistant"; content: string}[]>([
    { role: "assistant", content: "您好！我是华夏历史AI助手。请问有什么关于中国历史的问题想要了解吗？您可以询问任何朝代、人物、事件相关的问题。" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: input }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: `感谢您的提问："${input}"。这是一个很好的历史问题！连接后端AI服务后，我将能够为您提供详细的历史解答，包括相关的朝代背景、人物关系和历史影响等信息。` }]);
    }, 500);
    setInput("");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-2">AI 历史助手</h1>
          <p className="text-muted-foreground">智能问答，快速获取历史知识</p>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="h-[400px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-primary" : "bg-muted"}`}>
                  {msg.role === "user" ? <User className="h-4 w-4 text-primary-foreground" /> : <Bot className="h-4 w-4 text-foreground" />}
                </div>
                <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border p-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestedQuestions.map((q, i) => (
                <Button key={i} variant="outline" size="sm" className="text-xs" onClick={() => setInput(q)}>{q}</Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input value={input} onChange={e => setInput(e.target.value)} placeholder="输入您的历史问题..." onKeyDown={e => e.key === "Enter" && handleSend()} />
              <Button onClick={handleSend}><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIAssistant;
