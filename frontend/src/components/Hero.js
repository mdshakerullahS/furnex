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
    <section className="px-2 md:px-4 lg:px-8">
      <div className="py-2 md:hidden">
        <SearchForm />
      </div>
      <AspectRatio ratio={width <= 960 ? 2 : 2.2}>
        <Carousel
          plugins={[
            Autoplay({
              delay: 2000,
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
