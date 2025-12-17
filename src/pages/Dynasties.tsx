import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ChevronRight, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getDynastyList, DynastyDisplay, toDynastyDisplay } from "@/services/dynasty";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 12;

const Dynasties = () => {
  const [dynasties, setDynasties] = useState<DynastyDisplay[]>([]);
  const [filteredDynasties, setFilteredDynasties] = useState<DynastyDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredDynasties.length / PAGE_SIZE);
  const paginatedData = filteredDynasties.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    const fetchDynasties = async () => {
      try {
        const response = await getDynastyList();
        if (response.code === 0 && response.data) {
          const displayData = response.data.map(toDynastyDisplay);
          setDynasties(displayData);
          setFilteredDynasties(displayData);
        }
      } catch (error) {
        console.error("获取朝代列表失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDynasties();
  }, []);

  useEffect(() => {
    if (dynasties.length === 0) return;
    setCurrentPage(1);
    if (!searchKeyword.trim()) {
      setFilteredDynasties(dynasties);
      return;
    }
    const keyword = searchKeyword.toLowerCase();
    const filtered = dynasties.filter(
      (d) =>
        d.name.toLowerCase().includes(keyword) ||
        d.capital.toLowerCase().includes(keyword) ||
        d.description.toLowerCase().includes(keyword)
    );
    setFilteredDynasties(filtered);
  }, [searchKeyword, dynasties]);


  const clearSearch = () => {
    setSearchKeyword("");
    setCurrentPage(1);
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            中国历史朝代
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            从远古到近代，探索每一个朝代的兴衰更替
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索朝代名称、都城..."
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
          <Badge variant="secondary" className="text-sm">共收录 {filteredDynasties.length} 个朝代</Badge>
        </div>

        {paginatedData.length === 0 ? (
          <div className="text-center py-12"><p className="text-muted-foreground">未找到相关朝代</p></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedData.map((dynasty, index) => (
                <Link
                  key={dynasty.id}
                  to={`/dynasties/${dynasty.id}`}
                  className="group animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="bg-card border border-border rounded-lg overflow-hidden card-hover h-full">
                    <div className="h-2" style={{ backgroundColor: dynasty.color }} />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="font-serif text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {dynasty.name}
                        </h2>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-sm text-primary mb-3">{dynasty.period}</p>
                      <p className="text-sm text-muted-foreground mb-4">{dynasty.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>都城：{dynasty.capital}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
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

export default Dynasties;
