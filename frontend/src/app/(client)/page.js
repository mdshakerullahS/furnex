import BrandStory from "@/components/BrandStory";
import Categories from "@/components/Categories";
import Hero from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";
import TrustStrip from "@/components/TrustStrip";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <Categories />
      <ProductsSection />
      <BrandStory />
    </main>
  );
}
