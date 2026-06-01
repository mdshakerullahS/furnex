import Features from "@/components/Features";
import TrustStrip from "@/components/TrustStrip";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Image from "next/image";

const Page = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* --- Hero Section --- */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          {/* Replace with a high-quality lifestyle furniture image */}
          <div className="w-full h-full bg-[url('/About_Image.jpg')] bg-cover bg-center" />
        </div>

        <div className="max-w-4xl mx-auto text-center px-6">
          <span className="text-sm font-bold uppercase tracking-widest text-primary mb-4 block">
            Since 2012
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-medium tracking-tight mb-6">
            Elevating the Art of <br /> Everyday Living.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Furnex blends timeless craftsmanship with modern sensibilities to
            create spaces you'll never want to leave.
          </p>
        </div>
      </section>

      {/* --- Brand Story (The "Who We Are") --- */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <AspectRatio ratio={0.8}>
            <Image
              src="/About_Image.jpg"
              alt="About Image"
              fill
              sizes="100vw"
              className="object-cover w-full h-full"
            />
          </AspectRatio>
          <div className="space-y-8">
            <h2 className="text-4xl font-semibold">
              Thoughtful Design, <br />
              Premium Craft.
            </h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Furnex is a modern furniture brand focused on thoughtful design
                and premium craftsmanship. Every product is created to balance
                aesthetics, durability, and everyday comfort.
              </p>
              <p>
                We believe your home should be a reflection of your journey. We
                help people build spaces that feel warm, functional, and truly
                their own.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <h4 className="font-bold text-2xl">500+</h4>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  Unique Designs
                </p>
              </div>
              <div>
                <h4 className="font-bold text-2xl">15+</h4>
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  Global Stores
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Value Props (What We Offer) --- */}
      <Features />

      {/* --- Trust Strip --- */}
      <TrustStrip />

      {/* --- Mission & Vision --- */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 border-t border-b border-border py-16">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-tighter text-muted-foreground mb-4">
              Our Mission
            </h3>
            <p className="text-2xl font-medium leading-snug">
              To provide thoughtfully designed furniture that enhances comfort
              and elevates everyday living for everyone.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-tighter text-muted-foreground mb-4">
              Our Vision
            </h3>
            <p className="text-2xl font-medium leading-snug">
              To become the global destination for modern furniture that feels
              personal, durable, and timeless.
            </p>
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="px-4 py-16 lg:py-32 text-center bg-primary text-primary-foreground mx-6 mb-12 rounded-3xl overflow-hidden relative">
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-serif mb-6">
            Ready to transform your home?
          </h2>
          <p className="mb-10 text-primary-foreground/80 max-w-lg mx-auto text-lg">
            Discover a collection where every piece tells a story of comfort and
            style.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="group h-14 px-8 text-lg"
          >
            Explore Collection
            <MoveRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Page;
