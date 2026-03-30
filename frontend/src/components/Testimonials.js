"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Interior Designer",
    image: "https://i.pravatar.cc/150?u=1",
    review:
      "The quality of the dining table we purchased is exceptional. It has become the centerpiece of our home. Truly master craftsmanship.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Home Owner",
    image: "https://i.pravatar.cc/150?u=2",
    review:
      "Fast delivery and the assembly team was so professional. The sofa is incredibly comfortable and looks better than in the photos!",
    rating: 5,
  },
  {
    name: "Emma Wilson",
    role: "Sustainable Advocate",
    image: "https://i.pravatar.cc/150?u=3",
    review:
      "I love the sustainable approach. Knowing my bed frame was ethically sourced makes me sleep even better. Highly recommended!",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Editorial Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-3">
            Social Proof
          </span>
          <h2 className="text-4xl font-serif font-medium text-foreground">
            Voices of Furniro
          </h2>
          <div className="h-px w-20 bg-primary/20 mt-6" />
        </div>

        <Carousel
          plugins={[Autoplay({ delay: 4000 })]}
          className="w-full max-w-5xl mx-auto"
          opts={{ loop: true }}
        >
          <CarouselContent>
            {testimonials.map((t, i) => (
              <CarouselItem key={i}>
                <div className="bg-[#FAF9F6] rounded-3xl p-8 md:p-16 text-center mx-4 border border-border/40">
                  {/* Subtle Rating */}
                  <div className="flex justify-center gap-1 mb-8">
                    {[...Array(t.rating)].map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className="w-4 h-4 fill-[#B88E2F] text-[#B88E2F]"
                      />
                    ))}
                  </div>

                  {/* The Quote */}
                  <blockquote className="text-2xl md:text-3xl font-serif italic text-foreground leading-relaxed mb-10">
                    "{t.review}"
                  </blockquote>

                  {/* The Profile */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-border shadow-sm">
                      <Image
                        src={t.image}
                        width={64}
                        height={64}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-bold text-lg">{t.name}</h4>
                    <p className="text-sm text-primary uppercase tracking-widest font-medium">
                      {t.role}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Refined Navigation */}
          <div className="hidden md:block">
            <CarouselPrevious className="h-12 w-12 border-none bg-primary/5 hover:bg-primary hover:text-background transition-all" />
            <CarouselNext className="h-12 w-12 border-none bg-primary/5 hover:bg-primary hover:text-background transition-all" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
