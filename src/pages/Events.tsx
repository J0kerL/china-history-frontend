import { Layout } from "@/components/layout/Layout";
import { events } from "@/data/events";
import { Badge } from "@/components/ui/badge";

const categoryLabels = { political: "政治", military: "军事", cultural: "文化", scientific: "科技" };
const categoryColors = { political: "bg-primary", military: "bg-destructive", cultural: "bg-accent", scientific: "bg-secondary" };

const Events = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">历史事件时间轴</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">重大历史事件按时间排列，理清历史脉络</p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-border" />
          <div className="space-y-8">
            {events.map((event, index) => (
              <div key={event.id} className="relative pl-12 md:pl-20 animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <div className={`absolute left-2 md:left-6 w-4 h-4 rounded-full ${categoryColors[event.category]} border-4 border-background`} />
                <div className="bg-card border border-border rounded-lg p-6 card-hover">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <Badge variant="outline">{event.yearDisplay}</Badge>
                    <Badge>{categoryLabels[event.category]}</Badge>
                    <span className="text-xs text-muted-foreground">{event.dynasty}</span>
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{event.name}</h3>
                  <p className="text-sm text-foreground/80 mb-3">{event.description}</p>
                  <p className="text-sm text-muted-foreground"><strong>历史影响：</strong>{event.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Events;
