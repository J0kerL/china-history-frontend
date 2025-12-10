import { Layout } from "@/components/layout/Layout";
import { figures } from "@/data/figures";
import { Crown, Sword, BookOpen, Palette } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const categoryIcons = { emperor: Crown, general: Sword, scholar: BookOpen, artist: Palette, scientist: BookOpen };
const categoryLabels = { emperor: "帝王", general: "将领", scholar: "学者", artist: "艺术家", scientist: "科学家" };

const Figures = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">历史人物百科</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">探索影响中国历史进程的杰出人物</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {figures.map((figure, index) => {
            const Icon = categoryIcons[figure.category];
            return (
              <div key={figure.id} className="bg-card border border-border rounded-lg p-6 card-hover animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-serif text-lg font-semibold text-foreground">{figure.name}</h3>
                      <Badge variant="secondary" className="text-xs">{categoryLabels[figure.category]}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{figure.courtesy} · {figure.dynasty}</p>
                    <p className="text-sm text-foreground/80">{figure.description}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    {figure.achievements.map((a, i) => <Badge key={i} variant="outline" className="text-xs">{a}</Badge>)}
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
