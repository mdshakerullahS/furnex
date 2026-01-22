"use client";

import heroImage1 from "../../public/Hero_Image_1.jpg";
import heroImage2 from "../../public/Hero_Image_2.jpg";
import heroImage3 from "../../public/Hero_Image_3.jpg";

import Image from "next/image";
import { AspectRatio } from "./ui/aspect-ratio";
import { useEffect, useState } from "react";
import SearchForm from "./SearchForm";

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
      <div className="flex flex-col lg:flex-row gap-2 md:gap-4 lg:gap-6">
        <AspectRatio ratio={width <= 960 ? 2 : 2.85}>
          <Image
            src={heroImage2}
            fill
            sizes="75vw"
            alt="Hero Background"
            priority
            className="h-[400px] rounded-2xl object-cover"
          />
        </AspectRatio>

        <div className="w-full lg:w-1/2 flex lg:flex-col items-center justify-between gap-2 md:gap-4 lg:gap-0">
          <AspectRatio ratio={width <= 960 ? 2.975 : 1.975}>
            <Image
              src={heroImage1}
              fill
              sizes="25vw"
              alt="Hero Background"
              priority
              className="rounded-xl object-cover"
            />
          </AspectRatio>
          <AspectRatio ratio={width <= 960 ? 2.975 : 1.975}>
            <Image
              src={heroImage3}
              fill
              sizes="25vw"
              alt="Hero Background"
              priority
              className="rounded-xl object-cover"
            />
          </AspectRatio>
        </div>
      </div>
    </section>
  );
};

export default Hero;
