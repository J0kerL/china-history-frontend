import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { DynastyTimeline } from "@/components/home/DynastyTimeline";
import { FeaturedFigures } from "@/components/home/FeaturedFigures";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <DynastyTimeline />
      <FeaturedFigures />
    </Layout>
  );
};

export default Index;
