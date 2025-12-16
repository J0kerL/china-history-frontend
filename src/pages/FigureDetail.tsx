import { Layout } from "@/components/layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getPersonById, PersonVO } from "@/services/person";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, Crown, Sword, BookOpen, Palette, User, 
  Calendar, MapPin, Award, ScrollText, Sparkles, Tag
} from "lucide-react";

// 根据人物简介和成就推断类别
const inferCategory = (person: PersonVO): "emperor" | "general" | "scholar" | "artist" | "scientist" => {
  const text = `${person.summary || ""} ${person.achievements?.join(" ") || ""}`;
  
  if (person.templeName || 
      person.posthumousName?.includes("皇帝") || 
      text.includes("皇帝") || text.includes("帝王") || 
      text.includes("开国") || text.includes("建立") || text.includes("称帝")) {
    return "emperor";
  }
  if (text.includes("将军") || text.includes("名将") || text.includes("军事") || 
      text.includes("抗") || text.includes("战") || text.includes("兵")) {
    return "general";
  }
  if (text.includes("诗") || text.includes("画") || text.includes("书法") || 
      text.includes("艺术") || text.includes("词") || text.includes("曲")) {
    return "artist";
  }
  if (text.includes("发明") || text.includes("科学") || text.includes("医") || 
      text.includes("数学") || text.includes("天文")) {
    return "scientist";
  }
  return "scholar";
};

const categoryConfig = {
  emperor: { icon: Crown, label: "帝王", color: "bg-yellow-500" },
  general: { icon: Sword, label: "将领", color: "bg-red-500" },
  scholar: { icon: BookOpen, label: "学者", color: "bg-blue-500" },
  artist: { icon: Palette, label: "艺术家", color: "bg-purple-500" },
  scientist: { icon: BookOpen, label: "科学家", color: "bg-green-500" },
};

// 格式化年份显示
const formatYear = (year: number | null | undefined): string => {
  if (year === null || year === undefined) return "未知";
  return year < 0 ? `公元前${Math.abs(year)}年` : `公元${year}年`;
};

const FigureDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [person, setPerson] = useState<PersonVO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/figures/${id}` } });
      return;
    }

    const fetchPerson = async () => {
      try {
        const response = await getPersonById(Number(id));
        if (response.code === 0 && response.data) {
          setPerson(response.data);
        } else {
          setError("人物不存在");
        }
      } catch (err) {
        console.error("获取人物详情失败:", err);
        setError("获取人物详情失败");
      } finally {
        setLoading(false);
      }
    };
    fetchPerson();
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

  if (error || !person) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-destructive mb-4">{error || "人物不存在"}</p>
            <Button onClick={() => navigate("/figures")}>返回人物列表</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const category = inferCategory(person);
  const { icon: CategoryIcon, label: categoryLabel } = categoryConfig[category];

  // 收集所有姓名字号信息
  const nameInfoItems = [
    { label: "姓", value: person.surname },
    { label: "名", value: person.givenName },
    { label: "字", value: person.courtesyName },
    { label: "号", value: person.artName },
    { label: "谥号", value: person.posthumousName },
    { label: "庙号", value: person.templeName },
  ].filter(item => item.value);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <Button variant="ghost" className="mb-6" onClick={() => navigate("/figures")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>

        {/* 人物头部信息 */}
        <div className="bg-card border border-border rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* 头像区域 */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <CategoryIcon className="h-14 w-14 text-primary" />
              </div>
              <Badge variant="secondary">{categoryLabel}</Badge>
            </div>

            {/* 基本信息 */}
            <div className="flex-1">
              <h1 className="font-serif text-4xl font-bold text-foreground mb-4">{person.name}</h1>

              {/* 朝代和生卒年 */}
              <div className="flex flex-wrap gap-6 text-sm mb-6">
                {person.dynastyName && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">朝代：</span>
                    <span className="text-foreground font-medium">{person.dynastyName}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">生卒：</span>
                  <span className="text-foreground font-medium">
                    {formatYear(person.birthYear)} — {formatYear(person.deathYear)}
                  </span>
                </div>
              </div>

              {/* 人物简介 */}
              <p className="text-foreground/90 leading-relaxed">
                {person.summary || "暂无简介"}
              </p>
            </div>
          </div>
        </div>

        {/* 详细信息卡片 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 姓名字号 */}
          {nameInfoItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  姓名字号
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {nameInfoItems.map((item, index) => (
                    <div key={index} className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                      <p className="text-foreground font-medium">{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 主要成就 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                主要成就
              </CardTitle>
            </CardHeader>
            <CardContent>
              {person.achievements && person.achievements.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {person.achievements.map((achievement, index) => (
                    <Badge key={index} variant="outline" className="text-sm py-1.5 px-3">
                      <Sparkles className="h-3 w-3 mr-1.5" />
                      {achievement}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">暂无成就记录</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 称号详解 */}
        {(person.posthumousName || person.templeName || person.artName) && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-primary" />
                称号详解
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {person.posthumousName && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">谥号</p>
                    <p className="text-lg font-medium text-foreground mb-2">{person.posthumousName}</p>
                    <p className="text-xs text-muted-foreground">
                      谥号是古代帝王、诸侯、大臣等死后，根据其生平事迹给予的称号，用以概括其一生功过
                    </p>
                  </div>
                )}
                {person.templeName && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">庙号</p>
                    <p className="text-lg font-medium text-foreground mb-2">{person.templeName}</p>
                    <p className="text-xs text-muted-foreground">
                      庙号是皇帝死后在太庙立室奉祀时特起的名号，如太祖、太宗、高宗等
                    </p>
                  </div>
                )}
                {person.artName && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">号</p>
                    <p className="text-lg font-medium text-foreground mb-2">{person.artName}</p>
                    <p className="text-xs text-muted-foreground">
                      号是古人自己取的别名，用以表达志趣、情怀或纪念某事
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default FigureDetail;
