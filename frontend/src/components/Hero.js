"use client";

import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";
import { useEffect, useState } from "react";
import SearchForm from "./SearchForm";
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

const images = new Array(3).fill(0);

const Hero = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section className="px-2 md:px-4 lg:px-8 mt-4">
      <div className="py-2 md:hidden">
        <SearchForm />
      </div>

      <AspectRatio ratio={width <= 480 ? 1.4 : width <= 960 ? 2 : 2.2}>
        <Carousel
          plugins={[
            Autoplay({
              delay: 6000,
            }),
          ]}
          className="h-full"
        >
          <CarouselContent className="h-full">
            {images.map((_, idx) => (
              <CarouselItem key={idx} className="relative">
                <Image
                  src={`/Hero_Image_${idx + 1}.jpg`}
                  fill
                  sizes="100vw"
                  alt="Hero Background"
                  priority
                  className="h-[400px] rounded-2xl object-cover"
                />

                <div className="bg-foreground/60 flex flex-col items-center justify-center rounded-2xl absolute inset-0">
                  <h1 className="text-3xl md:text-6xl lg:text-8xl font-bold text-center text-primary drop-shadow-primary drop-shadow-xs">
                    Crafted Comfort for Modern Living
                  </h1>
                  <p className="text-background text-sm md:text-xl lg:text-2xl text-center p-6 leading-tight md:leading-relaxed drop-shadow-background drop-shadow-xs">
                    Thoughtfully designed furniture for modern living.
                  </p>
                  <Button
                    size={width <= 480 ? "sm" : "lg"}
                    className="mt-4 md:mt-8 cursor-pointer"
                  >
                    <Link href="/shop">Explore Collection</Link>
                  </Button>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </AspectRatio>
    </section>
  );
};

export default Hero;
