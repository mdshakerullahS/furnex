import { Award, RotateCcw, Truck, Users } from "lucide-react";

const strips = [
  {
    label: "Free Delivery",
    description: "Orders over $50",
    icon: Truck,
  },
  {
    label: "Premium Materials",
    description: "Ethically sourced",
    icon: Award,
  },
  {
    label: "30-Day Returns",
    description: "Hassle-free policy",
    icon: RotateCcw,
  },
  {
    label: "Global Community",
    description: "5,000+ Happy homes",
    icon: Users,
  },
];

const TrustStrip = () => {
  return (
    <section className="bg-[#FAF9F6] border-y border-border/50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 lg:gap-y-0">
          {strips.map((strip, index) => (
            <div
              key={strip.label}
              className={`flex items-center lg:justify-center gap-5 px-4 ${
                // Add vertical dividers only on large screens
                index !== strips.length - 1
                  ? "lg:border-r lg:border-border/60"
                  : ""
              }`}
            >
              <div className="shrink-0">
                <strip.icon
                  strokeWidth={1.25}
                  className="w-9 h-9 text-primary/80"
                />
              </div>
              <div className="flex flex-col">
                <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">
                  {strip.label}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {strip.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
