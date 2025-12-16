import { Layout } from "@/components/layout/Layout";
import { Crown, Sword, BookOpen, Palette, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getAllPersons, PersonVO } from "@/services/person";

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

const categoryIcons = { emperor: Crown, general: Sword, scholar: BookOpen, artist: Palette, scientist: BookOpen };
const categoryLabels = { emperor: "帝王", general: "将领", scholar: "学者", artist: "艺术家", scientist: "科学家" };

const Figures = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [figures, setFigures] = useState<PersonVO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/figures" } });
      return;
    }

    const fetchFigures = async () => {
      try {
        const response = await getAllPersons();
        if (response.code === 0 && response.data) {
          setFigures(response.data);
        }
      } catch (error) {
        console.error("获取人物列表失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFigures();
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
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">历史人物百科</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">探索影响中国历史进程的杰出人物</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-muted rounded w-24 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">历史人物百科</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">探索影响中国历史进程的杰出人物</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {figures.map((figure, index) => {
            const category = inferCategory(figure);
            const Icon = categoryIcons[category] || User;
            return (
              <div
                key={figure.id}
                className="group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => navigate(`/figures/${figure.id}`)}
              >
                <div className="bg-card border border-border rounded-lg p-6 card-hover h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {figure.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">{categoryLabels[category]}</Badge>
                      </div>
                      <p className="text-sm text-foreground/80 line-clamp-3">{figure.summary || "暂无简介"}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Figures;
