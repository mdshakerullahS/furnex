import { Award, RotateCcw, Truck, Users } from "lucide-react";

const strips = [
  {
    label: "Free Delivery",
    description: "For all orders over $50",
    icon: Truck,
  },
  {
    label: "Premium Materials",
    description: "High quality materials",
    icon: Award,
  },
  {
    label: "30-Day Returns",
    description: "Hassle free returns",
    icon: RotateCcw,
  },
  {
    label: "5,000+ Happy Customers",
    description: "Trusted worldwide",
    icon: Users,
  },
];

const TrustStript = () => {
  return (
    <section className="bg-accent/30 py-12 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {strips.map((strip) => (
          <div key={strip.label} className="flex items-center gap-4">
            {<strip.icon className="w-10 h-10" />}
            <div>
              <h4 className="text-xl font-bold">{strip.label}</h4>
              <p className="text-muted-foreground font-medium">
                {strip.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustStript;
