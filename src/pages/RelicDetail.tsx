import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Landmark, 
  MapPin, 
  Calendar, 
  BookOpen, 
  ArrowLeft, 
  ExternalLink,
  Navigation
} from "lucide-react";
import { getRelicById, RelicVO } from "@/services/relic";
import { useToast } from "@/hooks/use-toast";

const RelicDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [relic, setRelic] = useState<RelicVO | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchRelicDetail(parseInt(id));
    }
  }, [id]);

  const fetchRelicDetail = async (relicId: number) => {
    try {
      setLoading(true);
      const response = await getRelicById(relicId);
      if (response.code === 0) {
        setRelic(response.data);
      } else {
        toast({
          title: "获取数据失败",
          description: response.msg,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "网络错误",
        description: "无法连接到服务器",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openInMap = () => {
    if (relic) {
      window.open(
        `https://www.amap.com/search?query=${encodeURIComponent(relic.name)}&city=全国`,
        '_blank'
      );
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-8 w-32 mb-8" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!relic) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">遗迹不存在</h1>
          <Button onClick={() => navigate('/historical-sites')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回遗迹列表
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* 返回按钮 */}
        <Button
          variant="ghost"
          className="mb-8"
          onClick={() => navigate('/historical-sites')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回遗迹列表
        </Button>

        {/* 主要内容 */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="font-serif text-3xl flex items-center gap-3">
                    <Landmark className="h-8 w-8 text-primary" />
                    {relic.name}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-3 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {relic.location}
                    </span>
                  </div>
                </div>
                {relic.dynastyName && (
                  <Badge variant="secondary" className="text-base px-4 py-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    {relic.dynastyName}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 遗迹介绍 */}
              <div>
                <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  遗迹介绍
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {relic.description || "暂无详细介绍"}
                </p>
              </div>

              {/* 相关历史事件 */}
              {relic.relatedEventTitle && (
                <div>
                  <h3 className="font-medium text-lg mb-3">相关历史事件</h3>
                  <Link 
                    to={`/events/${relic.relatedEventId}`}
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <BookOpen className="h-4 w-4" />
                    {relic.relatedEventTitle}
                  </Link>
                </div>
              )}

              {/* 相关朝代 */}
              {relic.dynastyId && relic.dynastyName && (
                <div>
                  <h3 className="font-medium text-lg mb-3">相关朝代</h3>
                  <Link 
                    to={`/dynasties/${relic.dynastyId}`}
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <Calendar className="h-4 w-4" />
                    {relic.dynastyName}
                  </Link>
                </div>
              )}

              {/* 地图链接 */}
              {relic.coordinates && (
                <div className="pt-4 border-t">
                  <h3 className="font-medium text-lg mb-3 flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-primary" />
                    位置信息
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    坐标：{relic.coordinates}
                  </p>
                  <Button onClick={openInMap}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    在高德地图中查看
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default RelicDetail;
