"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "./ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const images = [
  { src: "/Hero_Image_1.jpg", tag: "New Collection 2026" },
  { src: "/Hero_Image_2.jpg", tag: "Limited Edition" },
  { src: "/Hero_Image_3.jpg", tag: "Summer Essentials" },
];

const Hero = () => {
  return (
    <section className="relative px-4 md:px-6 lg:px-8 pt-4 pb-12 overflow-hidden">
      <Carousel
        plugins={[Autoplay({ delay: 6000 })]}
        className="w-full relative group"
        opts={{ loop: true }}
      >
        <CarouselContent>
          {images.map((img, idx) => (
            <CarouselItem key={idx}>
              {/* Responsive Aspect Ratio Container */}
              <div className="relative aspect-4/5 sm:aspect-video lg:aspect-21/9 w-full overflow-hidden rounded-3xl bg-muted">
                <Image
                  src={img.src}
                  fill
                  sizes="100vw"
                  alt="Furnex Interior"
                  priority={idx === 0}
                  className="object-cover transition-transform duration-[10s] ease-out scale-110 group-hover:scale-100"
                />

                {/* The Floating Content Card */}
                <div className="absolute inset-0 flex items-end md:items-center justify-start p-6 md:p-16 bg-linear-to-t from-foreground/40 to-transparent md:bg-none">
                  <div className="bg-background/95 backdrop-blur-md p-8 md:p-12 lg:p-16 rounded-2xl max-w-xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <span className="inline-block text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4">
                      {img.tag}
                    </span>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-medium leading-tight mb-6 text-foreground">
                      Crafted Comfort <br /> for Modern Living
                    </h1>

                    <p className="text-muted-foreground text-sm md:text-lg mb-8 leading-relaxed max-w-sm">
                      Discover our curated selection of pieces designed to
                      balance aesthetics and timeless durability.
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <Button
                        asChild
                        size="lg"
                        className="rounded-full px-8 h-14 text-base font-medium group"
                      >
                        <Link href="/shop" className="flex items-center">
                          Explore Collection
                          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Refined Navigation UI */}
        <div className="absolute bottom-8 right-12 hidden md:flex gap-2">
          <CarouselPrevious className="static translate-y-0 h-12 w-12 border-border bg-foreground/10 text-background backdrop-blur-md hover:bg-bactext-background hover:text-forebg-foreground transition-all" />
          <CarouselNext className="static translate-y-0 h-12 w-12 border-border bg-foreground/10 text-background backdrop-blur-md hover:bg-bactext-background hover:text-forebg-foreground transition-all" />
        </div>
      </Carousel>
    </section>
  );
};

export default Hero;
