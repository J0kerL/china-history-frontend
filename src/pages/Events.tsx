import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { getAllEvents, EventVO } from "@/services/event";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 15;

const categoryLabels: Record<string, string> = {
  political: "政治", military: "军事", cultural: "文化", scientific: "科技", economic: "经济",
  政治: "政治", 军事: "军事", 文化: "文化", 科技: "科技", 经济: "经济",
  制度: "制度", 外交: "外交", 神话: "神话", 灾难: "灾难", 工程: "工程", 宗教: "宗教",
};

const categoryColors: Record<string, string> = {
  political: "bg-primary", military: "bg-destructive", cultural: "bg-accent", scientific: "bg-secondary", economic: "bg-green-500",
  政治: "bg-primary", 军事: "bg-destructive", 文化: "bg-accent", 科技: "bg-secondary", 经济: "bg-green-500",
  制度: "bg-blue-500", 外交: "bg-purple-500", 神话: "bg-pink-500", 灾难: "bg-orange-500", 工程: "bg-cyan-500", 宗教: "bg-yellow-500",
};

const formatYear = (year: number | null | undefined): string => {
  if (year === null || year === undefined) return "远古";
  return year < 0 ? `公元前${Math.abs(year)}年` : `公元${year}年`;
};

const Events = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventVO[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredEvents.length / PAGE_SIZE);
  const paginatedData = filteredEvents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

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
          const sorted = [...response.data].sort((a, b) => {
            const yearA = a.startYear ?? -Infinity;
            const yearB = b.startYear ?? -Infinity;
            return yearA - yearB;
          });
          setEvents(sorted);
          setFilteredEvents(sorted);
        }
      } catch (error) {
        console.error("获取事件列表失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (events.length === 0) return;
    setCurrentPage(1);
    if (!searchKeyword.trim()) {
      setFilteredEvents(events);
      return;
    }
    const keyword = searchKeyword.toLowerCase();
    const filtered = events.filter(
      (e) =>
        e.title.toLowerCase().includes(keyword) ||
        e.summary?.toLowerCase().includes(keyword) ||
        e.category?.toLowerCase().includes(keyword)
    );
    setFilteredEvents(filtered);
  }, [searchKeyword, events]);

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
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">历史事件时间轴</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">重大历史事件按时间排列，理清历史脉络</p>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索事件名称、类型..."
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
          <Badge variant="secondary" className="text-sm">共收录 {filteredEvents.length} 个历史事件</Badge>
        </div>

        {loading ? (
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-8">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="relative pl-12 md:pl-20 animate-pulse">
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
        ) : paginatedData.length === 0 ? (
          <div className="text-center py-12"><p className="text-muted-foreground">未找到相关事件</p></div>
        ) : (
          <>
            <div className="relative max-w-3xl mx-auto">
              <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-8">
                {paginatedData.map((event) => {
                  const colorClass = categoryColors[event.category || ""] || "bg-primary";
                  return (
                    <div
                      key={event.id}
                      className="relative pl-12 md:pl-20 cursor-pointer"
                      onClick={() => navigate(`/events/${event.id}`)}
                    >
                      <div className={`absolute left-2 md:left-6 w-4 h-4 rounded-full ${colorClass} border-4 border-background`} />
                      <div className="bg-card border border-border rounded-lg p-6 card-hover">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline">
                            {formatYear(event.startYear)}
                            {event.endYear && event.endYear !== event.startYear && ` - ${formatYear(event.endYear)}`}
                          </Badge>
                          {event.category && <Badge>{categoryLabels[event.category] || event.category}</Badge>}
                        </div>
                        <h3 className="font-serif text-xl font-semibold text-foreground mb-2 hover:text-primary transition-colors">{event.title}</h3>
                        {event.summary && <p className="text-sm text-foreground/80 line-clamp-2">{event.summary}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
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

export default Events;
