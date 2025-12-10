import { Link } from "react-router-dom";
import { Calendar, Users, Map, MessageCircle, Clock, BookOpen } from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "朝代浏览",
    description: "从夏商周到清朝，系统学习各朝代的历史特点",
    link: "/dynasties",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Users,
    title: "人物百科",
    description: "帝王将相、文人墨客，了解历史人物的生平事迹",
    link: "/figures",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: Clock,
    title: "事件时间轴",
    description: "重大历史事件按时间排列，理清历史脉络",
    link: "/events",
    color: "bg-secondary/80 text-secondary-foreground",
  },
  {
    icon: Map,
    title: "疆域地图",
    description: "查看各朝代疆域变化，了解地理演变",
    link: "/dynasties",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: BookOpen,
    title: "古今地名",
    description: "古代地名与现代地名对照，穿越时空",
    link: "/dynasties",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: MessageCircle,
    title: "AI助手",
    description: "智能历史问答，快速获取历史知识",
    link: "/ai-assistant",
    color: "bg-secondary/80 text-secondary-foreground",
  },
];

export const FeatureCards = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            功能特色
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            多维度探索中国历史，沉浸式学习体验
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link
                key={index}
                to={feature.link}
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-card border border-border rounded-lg p-6 card-hover h-full text-center">
                  <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
