import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getAllEvents, EventVO } from "@/services/event";

const categoryLabels: Record<string, string> = {
  political: "政治",
  military: "军事",
  cultural: "文化",
  scientific: "科技",
  economic: "经济",
};

const categoryColors: Record<string, string> = {
  political: "bg-primary",
  military: "bg-destructive",
  cultural: "bg-accent",
  scientific: "bg-secondary",
  economic: "bg-green-500",
};

// 格式化年份显示
const formatYear = (year: number | null | undefined): string => {
  if (year === null || year === undefined) return "未知";
  return year < 0 ? `公元前${Math.abs(year)}年` : `公元${year}年`;
};

const Events = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventVO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/events" } });
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await getAllEvents();
        if (response.code === 0 && response.data) {
          // 按年份排序，null年份（远古事件）排在最前面
          const sorted = [...response.data].sort((a, b) => {
            // null 视为最早（负无穷）
            const yearA = a.startYear ?? -Infinity;
            const yearB = b.startYear ?? -Infinity;
            return yearA - yearB;
          });
          setEvents(sorted);
        }
      } catch (error) {
        console.error("获取事件列表失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [isAuthenticated, authLoading, navigate]);

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              历史事件时间轴
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              重大历史事件按时间排列，理清历史脉络
            </p>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-8">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="relative pl-12 md:pl-20 animate-pulse"
                >
                  <div className="absolute left-2 md:left-6 w-4 h-4 rounded-full bg-muted border-4 border-background" />
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="h-4 bg-muted rounded w-32 mb-3"></div>
                    <div className="h-5 bg-muted rounded w-48 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            历史事件时间轴
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            重大历史事件按时间排列，理清历史脉络
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-8">
            {events.map((event, index) => {
              const colorClass =
                categoryColors[event.category || ""] || "bg-primary";
              return (
                <div
                  key={event.id}
                  className="relative pl-12 md:pl-20 animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <div
                    className={`absolute left-2 md:left-6 w-4 h-4 rounded-full ${colorClass} border-4 border-background`}
                  />
                  <div className="bg-card border border-border rounded-lg p-6 card-hover">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="outline">
                        {formatYear(event.startYear)}
                        {event.endYear &&
                          event.endYear !== event.startYear &&
                          ` - ${formatYear(event.endYear)}`}
                      </Badge>
                      {event.category && (
                        <Badge>
                          {categoryLabels[event.category] || event.category}
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    {event.summary && (
                      <p className="text-sm text-foreground/80 line-clamp-3">
                        {event.summary}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Events;
