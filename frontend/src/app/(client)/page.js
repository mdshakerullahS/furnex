import Categories from "@/components/Categories";
import Hero from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";
import TrustStript from "@/components/TrustStript";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustStript />
      <Categories />
      <ProductsSection />
    </main>
  );
}
