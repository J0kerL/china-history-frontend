import { Link } from "react-router-dom";
import { ChevronRight, Crown, Sword, BookOpen, Palette } from "lucide-react";
import { figures } from "@/data/figures";
import { Badge } from "@/components/ui/badge";

const categoryIcons = {
  emperor: Crown,
  general: Sword,
  scholar: BookOpen,
  artist: Palette,
  scientist: BookOpen,
};

const categoryLabels = {
  emperor: "帝王",
  general: "将领",
  scholar: "学者",
  artist: "艺术家",
  scientist: "科学家",
};

export const FeaturedFigures = () => {
  const featuredFigures = figures.slice(0, 6);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            历史风云人物
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            从帝王将相到文人墨客，了解影响中国历史进程的杰出人物
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredFigures.map((figure, index) => {
            const Icon = categoryIcons[figure.category];
            return (
              <Link
                key={figure.id}
                to={`/figures/${figure.id}`}
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-card border border-border rounded-lg p-6 card-hover h-full">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {figure.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {categoryLabels[figure.category]}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {figure.courtesy} · {figure.dynasty}
                      </p>
                      <p className="text-sm text-foreground/80 line-clamp-2">
                        {figure.description}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">主要成就</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {figure.achievements.slice(0, 3).map((achievement, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/figures">
            <button className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors">
              查看所有人物
              <ChevronRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};
