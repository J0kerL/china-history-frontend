import { Link, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { getDynastyList, DynastyDisplay, toDynastyDisplay } from "@/services/dynasty";
import { useLoginRequired } from "@/hooks/useLoginRequired";
import { LoginRequiredDialog } from "@/components/auth/LoginRequiredDialog";

export const DynastyTimeline = () => {
  const [dynasties, setDynasties] = useState<DynastyDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { checkLogin, showDialog, setShowDialog } = useLoginRequired();

  useEffect(() => {
    const fetchDynasties = async () => {
      try {
        const response = await getDynastyList();
        if (response.code === 0 && response.data) {
          // 转换为前端展示数据（添加period和color）
          const displayData = response.data.map(toDynastyDisplay);
          setDynasties(displayData);
        }
      } catch (error) {
        console.error("获取朝代列表失败:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDynasties();
  }, []);

  // 获取展示的朝代：前4个 + 省略号 + 后4个
  const { displayDynasties, showEllipsis, ellipsisIndex } = useMemo(() => {
    if (dynasties.length <= 8) {
      return { displayDynasties: dynasties, showEllipsis: false, ellipsisIndex: -1 };
    }
    const first4 = dynasties.slice(0, 4);
    const last4 = dynasties.slice(-4);
    return {
      displayDynasties: [...first4, ...last4],
      showEllipsis: true,
      ellipsisIndex: 4,
    };
  }, [dynasties]);

  // 点击朝代卡片
  const handleDynastyClick = (e: React.MouseEvent, dynastyId: number) => {
    if (!checkLogin()) {
      e.preventDefault();
    }
  };

  // 点击查看所有朝代
  const handleViewAllClick = (e: React.MouseEvent) => {
    if (!checkLogin()) {
      e.preventDefault();
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">加载中...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              朝代时间轴
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              纵览华夏五千年，探索每一个朝代的兴衰更替
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border" />

            {/* Timeline Items */}
            <div className="space-y-8">
              {displayDynasties.map((dynasty, index) => (
                <div key={dynasty.id}>
                  {/* 在第4个之后显示省略指示器 */}
                  {showEllipsis && index === ellipsisIndex && (
                    <div className="relative flex items-center justify-center py-8 mb-4">
                      {/* 中心圆形背景 - 6个点 */}
                      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-primary/10 border-2 border-dashed border-primary/30 z-10 flex items-center justify-center">
                        {/* 竖向六个点 */}
                        <div className="flex flex-col gap-1">
                          <div className="w-2 h-2 rounded-full bg-primary/70" />
                          <div className="w-2 h-2 rounded-full bg-primary/70" />
                          <div className="w-2 h-2 rounded-full bg-primary/70" />
                          <div className="w-2 h-2 rounded-full bg-primary/70" />
                          <div className="w-2 h-2 rounded-full bg-primary/70" />
                          <div className="w-2 h-2 rounded-full bg-primary/70" />
                        </div>
                      </div>
                      {/* 省略提示文字 */}
                      <div className="ml-24 md:ml-0 md:absolute md:left-[calc(50%+4rem)] text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                        省略 {dynasties.length - 8} 个朝代
                      </div>
                    </div>
                  )}
                  <div
                    className={`relative flex items-center ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Timeline Dot */}
                    <div
                      className="absolute left-4 md:left-1/2 w-4 h-4 -translate-x-1/2 rounded-full border-4 border-background z-10"
                      style={{ backgroundColor: dynasty.color }}
                    />

                    {/* Content Card */}
                    <div
                      className={`w-full md:w-[calc(50%-2rem)] ${
                        index % 2 === 0 ? "md:pr-8 pl-12 md:pl-0" : "md:pl-8 pl-12"
                      }`}
                    >
                      <Link 
                        to={`/dynasties/${dynasty.id}`}
                        onClick={(e) => handleDynastyClick(e, dynasty.id)}
                      >
                        <div className="bg-card border border-border rounded-lg p-5 card-hover group">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: dynasty.color }}
                                />
                                <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                                  {dynasty.name}
                                </h3>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {dynasty.period}
                              </p>
                              <p className="text-sm text-foreground/80 line-clamp-2">
                                {dynasty.description}
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/dynasties" onClick={handleViewAllClick}>
              <button className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors">
                查看所有朝代
                <ChevronRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <LoginRequiredDialog open={showDialog} onOpenChange={setShowDialog} />
    </>
  );
};
