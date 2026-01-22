import { Hammer, HeartHandshake, Leaf, Palette } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

const features = [
  {
    title: "Master Craftsmanship",
    description:
      "Every piece is handcrafted by artisans with decades of experience in traditional techniques.",
    icon: Hammer,
  },
  {
    title: "Ethically Sourced",
    description:
      " We use sustainably harvested wood and eco-friendly finishes to protect our planet's future.",
    icon: Leaf,
  },
  {
    title: "Design Excellence",
    description:
      "Our designers blend timeless aesthetics with modern functionality for your contemporary home.",
    icon: Palette,
  },
  {
    title: "Dedicated Support",
    description:
      "From selection to assembly, our expert team is with you every single step of the way.",
    icon: HeartHandshake,
  },
];

const Features = () => {
  return (
    <section className="px-2 md:px-4 lg:px-8 py-6 my-12 space-y-6">
      <h2 className="text-2xl text-center text-accent-foreground font-bold">
        Why Choose Us
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {features.map((feat) => (
          <Card key={feat.title} className="group">
            <CardHeader>
              <div className="w-14 h-14 bg-accent rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent transition-colors">
                <feat.icon className="text-primary w-7 h-7 group-hover:text-accent-foreground transition-colors" />
              </div>
              <CardTitle>{feat.title}</CardTitle>
              <CardDescription>{feat.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Features;
