import { Layout } from "@/components/layout/Layout";
import { Crown, Sword, BookOpen, Palette, User, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getAllPersons, PersonVO } from "@/services/person";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 12;

const inferCategory = (person: PersonVO): "emperor" | "general" | "scholar" | "artist" | "scientist" => {
  const text = `${person.summary || ""} ${person.achievements?.join(" ") || ""}`;
  if (person.templeName || person.posthumousName?.includes("皇帝") || 
      text.includes("皇帝") || text.includes("帝王") || text.includes("开国") || text.includes("建立") || text.includes("称帝")) {
    return "emperor";
  }
  if (text.includes("将军") || text.includes("名将") || text.includes("军事") || text.includes("抗") || text.includes("战") || text.includes("兵")) {
    return "general";
  }
  if (text.includes("诗") || text.includes("画") || text.includes("书法") || text.includes("艺术") || text.includes("词") || text.includes("曲")) {
    return "artist";
  }
  if (text.includes("发明") || text.includes("科学") || text.includes("医") || text.includes("数学") || text.includes("天文")) {
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
  const [filteredFigures, setFilteredFigures] = useState<PersonVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredFigures.length / PAGE_SIZE);
  const paginatedData = filteredFigures.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
          setFilteredFigures(response.data);
        }
      } catch (error) {
        console.error("获取人物列表失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFigures();
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (figures.length === 0) return;
    setCurrentPage(1);
    if (!searchKeyword.trim()) {
      setFilteredFigures(figures);
      return;
    }
    const keyword = searchKeyword.toLowerCase();
    const filtered = figures.filter(
      (f) =>
        f.name.toLowerCase().includes(keyword) ||
        f.courtesyName?.toLowerCase().includes(keyword) ||
        f.artName?.toLowerCase().includes(keyword) ||
        f.dynastyName?.toLowerCase().includes(keyword) ||
        f.summary?.toLowerCase().includes(keyword)
    );
    setFilteredFigures(filtered);
  }, [searchKeyword, figures]);

  const clearSearch = () => {
    setSearchKeyword("");
    setCurrentPage(1);
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center"><p className="text-muted-foreground">加载中...</p></div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">历史人物百科</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">探索影响中国历史进程的杰出人物</p>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索人物姓名、字号、朝代..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchKeyword && (
              <button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="text-center mb-8">
          <Badge variant="secondary" className="text-sm">共收录 {filteredFigures.length} 位历史人物</Badge>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(12)].map((_, index) => (
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
        ) : paginatedData.length === 0 ? (
          <div className="text-center py-12"><p className="text-muted-foreground">未找到相关人物</p></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedData.map((figure) => {
                const category = inferCategory(figure);
                const Icon = categoryIcons[category] || User;
                return (
                  <div key={figure.id} className="group cursor-pointer" onClick={() => navigate(`/figures/${figure.id}`)}>
                    <div className="bg-card border border-border rounded-lg p-6 card-hover h-full">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{figure.name}</h3>
                            <Badge variant="secondary" className="text-xs">{categoryLabels[category]}</Badge>
                          </div>
                          <p className="text-sm text-foreground/80 line-clamp-2">{figure.summary || "暂无简介"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) pageNum = i + 1;
                      else if (currentPage <= 3) pageNum = i + 1;
                      else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                      else pageNum = currentPage - 2 + i;
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink onClick={() => setCurrentPage(pageNum)} isActive={currentPage === pageNum} className="cursor-pointer">{pageNum}</PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Figures;
