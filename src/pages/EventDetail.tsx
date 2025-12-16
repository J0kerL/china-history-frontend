import { Layout } from "@/components/layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getEventById, EventVO } from "@/services/event";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, FileText } from "lucide-react";

// 格式化年份显示
const formatYear = (year: number | null | undefined): string => {
  if (year === null || year === undefined) return "未知";
  return year < 0 ? `公元前${Math.abs(year)}年` : `公元${year}年`;
};

const categoryLabels: Record<string, string> = {
  political: "政治",
  military: "军事",
  cultural: "文化",
  scientific: "科技",
  economic: "经济",
};

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventVO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/events/${id}` } });
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await getEventById(Number(id));
        if (response.code === 0 && response.data) {
          setEvent(response.data);
        } else {
          setError("事件不存在");
        }
      } catch (err) {
        console.error("获取事件详情失败:", err);
        setError("获取事件详情失败");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, isAuthenticated, authLoading, navigate]);

  if (authLoading || loading) {
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

  if (error || !event) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-destructive mb-4">{error || "事件不存在"}</p>
            <Button onClick={() => navigate(-1)}>返回</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>

        {/* 事件头部信息 */}
        <div className="bg-card border border-border rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Calendar className="h-14 w-14 text-primary" />
              </div>
              {event.category && (
                <Badge variant="secondary">
                  {categoryLabels[event.category] || event.category}
                </Badge>
              )}
            </div>

            <div className="flex-1">
              <h1 className="font-serif text-4xl font-bold text-foreground mb-4">
                {event.title}
              </h1>

              <div className="flex flex-wrap gap-6 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">时间：</span>
                  <span className="text-foreground font-medium">
                    {formatYear(event.startYear)}
                    {event.endYear && event.endYear !== event.startYear && (
                      <> — {formatYear(event.endYear)}</>
                    )}
                  </span>
                </div>
              </div>

              {event.summary && (
                <p className="text-foreground/90 leading-relaxed">
                  {event.summary}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 事件详情 */}
        {event.details && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                事件详情
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {event.details}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default EventDetail;
