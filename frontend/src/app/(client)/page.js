import Features from "@/components/Features";
import Categories from "@/components/Categories";
import Hero from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";
import TrustStrip from "@/components/TrustStrip";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <Categories />
      <ProductsSection />
      <Features />
      <Testimonials />
    </main>
  );
}
