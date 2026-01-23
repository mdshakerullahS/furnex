import Features from "@/components/Features";
import Categories from "@/components/Categories";
import Hero from "@/components/Hero";
import BestSellers from "@/components/BestSellers";
import TrustStrip from "@/components/TrustStrip";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main>
      <Hero />
      <Categories />
      <BestSellers />
      <Features />
      <Testimonials />
      <TrustStrip />
    </main>
  );
}
