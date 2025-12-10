import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { dynasties } from "@/data/dynasties";

export const DynastyTimeline = () => {
  return (
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
            {dynasties.map((dynasty, index) => (
              <div
                key={dynasty.id}
                className={`relative flex items-center ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 -translate-x-1/2 rounded-full border-4 border-background z-10"
                     style={{ backgroundColor: dynasty.color }} />

                {/* Content Card */}
                <div className={`w-full md:w-[calc(50%-2rem)] ${
                  index % 2 === 0 ? "md:pr-8 pl-12 md:pl-0" : "md:pl-8 pl-12"
                }`}>
                  <Link to={`/dynasties/${dynasty.id}`}>
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
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/dynasties">
            <button className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors">
              查看所有朝代
              <ChevronRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};
