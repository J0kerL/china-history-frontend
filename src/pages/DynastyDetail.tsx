import { Layout } from "@/components/layout/Layout";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDynastyDetail, DynastyDetailVO, formatPeriod, generateRandomColor } from "@/services/dynasty";
import { ChevronLeft, Crown, Users, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const DynastyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<DynastyDetailVO | null>(null);
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        const response = await getDynastyDetail(Number(id));
        if (response.code === 0 && response.data) {
          setDetail(response.data);
          setColor(generateRandomColor());
        }
      } catch (error) {
        console.error("获取朝代详情失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  // 格式化年份显示
  const formatYear = (year: number | null): string => {
    if (year === null || year === undefined) return "未知";
    if (year < 0) return `公元前${Math.abs(year)}年`;
    return `公元${year}年`;
  };

  if (loading) {
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

  if (!detail) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-muted-foreground">朝代不存在</p>
            <Link to="/dynasties">
              <Button variant="outline" className="mt-4">
                返回朝代列表
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const { dynasty, persons, events } = detail;
  const period = formatPeriod(dynasty.startYear, dynasty.endYear);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <Link to="/dynasties" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" />
          返回朝代列表
        </Link>

        {/* 朝代头部信息 */}
        <div className="bg-card border border-border rounded-lg overflow-hidden mb-8">
          <div className="h-3" style={{ backgroundColor: color }} />
          <div className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: color }}>
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
                  {dynasty.name}
                </h1>
                <p className="text-primary mt-1">{period}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <MapPin className="h-4 w-4" />
              <span>都城：{dynasty.capital || "未知"}</span>
            </div>
            
            <p className="text-foreground/80 leading-relaxed">
              {dynasty.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 历史人物 */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-xl font-bold text-foreground">
                历史人物
              </h2>
              <span className="text-sm text-muted-foreground">
                ({persons.length}人)
              </span>
            </div>

            {persons.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                暂无相关历史人物记录
              </p>
            ) : (
              <div className="space-y-4">
                {persons.map((person) => (
                  <div
                    key={person.id}
                    className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/figures/${person.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                          {person.name}
                          {person.styleName && (
                            <span className="text-muted-foreground font-normal ml-2">
                              ({person.styleName})
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatYear(person.birthYear)} - {formatYear(person.deathYear)}
                        </p>
                      </div>
                    </div>
                    {person.summary && (
                      <p className="text-sm text-foreground/70 mt-2 line-clamp-3">
                        {person.summary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 历史事件 */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="font-serif text-xl font-bold text-foreground">
                历史事件
              </h2>
              <span className="text-sm text-muted-foreground">
                ({events.length}件)
              </span>
            </div>

            {events.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                暂无相关历史事件记录
              </p>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                            {event.title}
                          </h3>
                          {event.category && (
                            <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                              {event.category}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatYear(event.startYear)}
                          {event.endYear && event.endYear !== event.startYear && (
                            <> - {formatYear(event.endYear)}</>
                          )}
                        </p>
                      </div>
                    </div>
                    {event.summary && (
                      <p className="text-sm text-foreground/70 mt-2 line-clamp-3">
                        {event.summary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DynastyDetail;
