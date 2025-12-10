import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { DynastyTimeline } from "@/components/home/DynastyTimeline";
import { FeaturedFigures } from "@/components/home/FeaturedFigures";
import { FeatureCards } from "@/components/home/FeatureCards";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <DynastyTimeline />
      <FeaturedFigures />
      <FeatureCards />
    </Layout>
  );
};

export default Index;
