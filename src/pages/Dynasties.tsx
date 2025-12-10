import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { dynasties } from "@/data/dynasties";

const Dynasties = () => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dynasties.map((dynasty, index) => (
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
      </div>
    </Layout>
  );
};

export default Dynasties;
