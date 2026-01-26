import { Hammer, HeartHandshake, Leaf, Palette } from "lucide-react";

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
      "We use sustainably harvested wood and eco-friendly finishes to protect our planet's future.",
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
    <section className="max-w-7xl mx-auto px-6 py-24">
      {/* Editorial Header */}
      <div className="flex flex-col items-center mb-20 text-center">
        <span className="text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4">
          The Furniro Difference
        </span>
        <h2 className="text-4xl md:text-5xl font-serif font-medium text-foreground max-w-2xl leading-tight">
          Crafting a legacy <br /> More than furniture
        </h2>
        <div className="h-px w-20 bg-primary/20 mt-6" />
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
        {features.map((feat, index) => (
          <div
            key={feat.title}
            className="group flex flex-col items-start transition-all duration-300 hover:-translate-y-2"
          >
            {/* Minimalist Icon Treatment */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-primary/5 rounded-full scale-150 group-hover:bg-primary/10 transition-colors" />
              <feat.icon
                strokeWidth={1.5}
                className="relative z-10 text-primary w-8 h-8 transition-transform duration-500 group-hover:rotate-12"
              />
            </div>

            {/* Content */}
            <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center">
              {feat.title}
            </h3>

            <p className="text-muted-foreground leading-relaxed">
              {feat.description}
            </p>

            {/* Subtle bottom indicator */}
            <div className="w-0 h-0.5 bg-primary mt-6 transition-all duration-500 group-hover:w-1/4" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
