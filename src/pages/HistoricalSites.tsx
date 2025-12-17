import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Landmark, Search, MapPin, Calendar, BookOpen, ExternalLink, X } from "lucide-react";
import { getRelicList, searchRelics, RelicVO } from "@/services/relic";
import { getDynastyList, DynastyVO } from "@/services/dynasty";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 12;

const HistoricalSites = () => {
  const [relics, setRelics] = useState<RelicVO[]>([]);
  const [filteredRelics, setFilteredRelics] = useState<RelicVO[]>([]);
  const [dynasties, setDynasties] = useState<DynastyVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedDynasty, setSelectedDynasty] = useState<string>("all");
  const [selectedRelic, setSelectedRelic] = useState<RelicVO | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalPages = Math.ceil(filteredRelics.length / PAGE_SIZE);
  const paginatedData = filteredRelics.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [relicsRes, dynastiesRes] = await Promise.all([
        getRelicList(),
        getDynastyList(),
      ]);

      if (relicsRes.code === 0) {
        const data = relicsRes.data || [];
        setRelics(data);
        setFilteredRelics(data);
      }
      if (dynastiesRes.code === 0) {
        setDynasties(dynastiesRes.data || []);
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

  const handleSearch = async () => {
    setCurrentPage(1);
    if (!searchKeyword.trim() && selectedDynasty === "all") {
      setFilteredRelics(relics);
      return;
    }

    let result = relics;

    if (selectedDynasty !== "all") {
      result = result.filter((r) => r.dynastyId?.toString() === selectedDynasty);
    }

    if (searchKeyword.trim()) {
      try {
        const response = await searchRelics(searchKeyword);
        if (response.code === 0) {
          result = response.data || [];
          if (selectedDynasty !== "all") {
            result = result.filter((r) => r.dynastyId?.toString() === selectedDynasty);
          }
        }
      } catch (error) {
        const keyword = searchKeyword.toLowerCase();
        result = result.filter(
          (r) =>
            r.name.toLowerCase().includes(keyword) ||
            r.location.toLowerCase().includes(keyword) ||
            r.dynastyName?.toLowerCase().includes(keyword)
        );
      }
    }

    setFilteredRelics(result);
  };

  useEffect(() => {
    if (relics.length === 0) return;
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchKeyword, selectedDynasty]);

  const openInMap = (name: string) => {
    window.open(`https://www.amap.com/search?query=${encodeURIComponent(name)}&city=全国`, "_blank");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Landmark className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-4">历史遗迹</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            探访中国历史上的重要遗迹，感受千年文明的厚重与辉煌
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索遗迹名称或地点..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Select value={selectedDynasty} onValueChange={setSelectedDynasty}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="选择朝代" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部朝代</SelectItem>
              {dynasties.map((dynasty) => (
                <SelectItem key={dynasty.id} value={dynasty.id.toString()}>
                  {dynasty.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="text-center mb-8">
          <Badge variant="secondary" className="text-sm">
            共收录 {filteredRelics.length} 处历史遗迹
          </Badge>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="p-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-20 mt-2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">未找到相关遗迹</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedData.map((relic) => (
                <Card
                  key={relic.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => setSelectedRelic(relic)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="font-serif text-base group-hover:text-primary transition-colors text-center">
                      {relic.name}
                    </CardTitle>
                    {relic.dynastyName && (
                      <CardDescription className="text-center mt-1">
                        <Badge variant="outline" className="text-xs">
                          {relic.dynastyName}
                        </Badge>
                      </CardDescription>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <PaginationItem key={pageNum}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                            className="cursor-pointer"
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}

        <Dialog open={!!selectedRelic} onOpenChange={() => setSelectedRelic(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif text-xl flex items-center gap-2">
                <Landmark className="h-5 w-5 text-primary" />
                {selectedRelic?.name}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-4 pt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {selectedRelic?.location}
                </span>
                {selectedRelic?.dynastyName && (
                  <Badge variant="secondary">
                    <Calendar className="h-3 w-3 mr-1" />
                    {selectedRelic.dynastyName}
                  </Badge>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="font-medium mb-2">遗迹介绍</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedRelic?.description || "暂无详细介绍"}
                </p>
              </div>

              {selectedRelic?.relatedEventTitle && (
                <div>
                  <h4 className="font-medium mb-2">相关历史事件</h4>
                  <p className="text-muted-foreground">
                    <BookOpen className="inline h-4 w-4 mr-1" />
                    {selectedRelic.relatedEventTitle}
                  </p>
                </div>
              )}

              <div className="pt-2 flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedRelic(null);
                    navigate(`/historical-sites/${selectedRelic?.id}`);
                  }}
                >
                  查看详情
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openInMap(selectedRelic?.name || "")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  在地图中查看
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default HistoricalSites;
