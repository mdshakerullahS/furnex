"use client";

import { Quote, Star } from "lucide-react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
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
    <section className="bg-accent/30 py-12 px-8 mt-12 space-y-8">
      <h2 className="text-2xl text-center text-accent-foreground font-bold">
        What Our Customers Say
      </h2>

      <Carousel plugins={[Autoplay({ delay: 2000 })]}>
        <CarouselContent className="gap-2">
          {testimonials.concat(testimonials).map((t, i) => (
            <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
              <Card>
                <div className="flex gap-1 text-orange-300 ml-18 pt-4">
                  {new Array(t.rating).fill().map((_, i) => (
                    <Star key={i} className="w-6 h-6 fill-current" />
                  ))}
                </div>
                <CardContent className="italic relative">
                  <p>"{t.review}"</p>
                  <div className="absolute -top-16 left-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Quote className="text-background w-6 h-6" />
                  </div>
                </CardContent>
                <CardHeader className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={t.image}
                      width={48}
                      height={48}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle>{t.name}</CardTitle>
                    <CardDescription>{t.role}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-6" />
        <CarouselNext className="-right-6" />
      </Carousel>
    </section>
  );
};

export default Testimonials;
