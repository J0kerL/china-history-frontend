import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MapPin, Search, ArrowRight, X } from "lucide-react";
import { getPlaceNameList, searchPlaceNames, PlaceNameVO } from "@/services/placeName";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 12;

const PlaceNames = () => {
  const [placeNames, setPlaceNames] = useState<PlaceNameVO[]>([]);
  const [filteredPlaceNames, setFilteredPlaceNames] = useState<PlaceNameVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<PlaceNameVO | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const totalPages = Math.ceil(filteredPlaceNames.length / PAGE_SIZE);
  const paginatedData = filteredPlaceNames.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
    fetchPlaceNames();
  }, []);

  const fetchPlaceNames = async () => {
    try {
      setLoading(true);
      const response = await getPlaceNameList();
      if (response.code === 0) {
        const data = response.data || [];
        setPlaceNames(data);
        setFilteredPlaceNames(data);
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

  const handleSearch = async () => {
    setCurrentPage(1);
    if (!searchKeyword.trim()) {
      setFilteredPlaceNames(placeNames);
      return;
    }
    try {
      const response = await searchPlaceNames(searchKeyword);
      if (response.code === 0) {
        setFilteredPlaceNames(response.data || []);
      }
    } catch (error) {
      toast({
        title: "搜索失败",
        description: "请稍后重试",
        variant: "destructive",
      });
    }
  };

  const clearSearch = () => {
    setSearchKeyword("");
    setFilteredPlaceNames(placeNames);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (placeNames.length === 0) return;
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-serif text-4xl font-bold text-foreground mb-4">古今地名</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            探索中国历史上的地名变迁，了解古代地名与现代地名的对应关系
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索古代地名或现代地名..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchKeyword && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="text-center mb-8">
          <Badge variant="secondary" className="text-sm">
            共收录 {filteredPlaceNames.length} 个地名
          </Badge>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="p-4">
                  <Skeleton className="h-5 w-full" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">未找到相关地名</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedData.map((place) => (
                <Card
                  key={place.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => setSelectedPlace(place)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="flex items-center justify-center gap-2 text-base">
                      <span className="text-primary font-serif">{place.ancientName}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-foreground">{place.modernName}</span>
                    </CardTitle>
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

        <Dialog open={!!selectedPlace} onOpenChange={() => setSelectedPlace(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-serif text-xl">
                <span className="text-primary">{selectedPlace?.ancientName}</span>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                <span>{selectedPlace?.modernName}</span>
              </DialogTitle>
              <DialogDescription className="flex items-center gap-1 pt-2">
                <MapPin className="h-4 w-4" />
                {selectedPlace?.modernLocation}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <h4 className="font-medium mb-2">地名说明</h4>
              <p className="text-muted-foreground leading-relaxed">
                {selectedPlace?.description || "暂无详细说明"}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default PlaceNames;
