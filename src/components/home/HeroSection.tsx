import { Link } from "react-router-dom";
import { ArrowRight, Map, Users, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            探索五千年
            <br />
            <span className="text-accent">华夏文明</span>
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            从远古传说到近代历史，沉浸式体验中华民族波澜壮阔的历史长河
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/dynasties">
              <Button size="lg" className="gap-2 text-base px-8 bg-primary hover:bg-primary/90">
                开始探索
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/ai-assistant">
              <Button size="lg" className="gap-2 text-base px-8 bg-primary hover:bg-primary/90">
                AI 历史助手
              </Button>
            </Link>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-primary-foreground/80 mb-1">
                <Crown className="h-4 w-4" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-primary-foreground">10+</p>
              <p className="text-sm text-primary-foreground/60">主要朝代</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-primary-foreground/80 mb-1">
                <Users className="h-4 w-4" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-primary-foreground">100+</p>
              <p className="text-sm text-primary-foreground/60">历史人物</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-primary-foreground/80 mb-1">
                <Map className="h-4 w-4" />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-primary-foreground">150+</p>
              <p className="text-sm text-primary-foreground/60">著名事件</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  );
};
