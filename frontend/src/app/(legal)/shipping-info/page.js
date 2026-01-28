import { Separator } from "@/components/ui/separator";

const Page = () => {
  return (
    <>
      <div className="space-y-4">
        <h1 className="text-4xl font-serif">Shipping Information</h1>
        <p className="text-muted-foreground italic">
          Last updated: January 2026
        </p>
      </div>
      <Separator />
      <article className="prose prose-stone max-w-none space-y-8 text-muted-foreground leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">
            White-Glove Delivery
          </h2>
          <p>
            We provide premium white-glove delivery for all furniture items. Our
            team will bring the piece into your room of choice, assemble it, and
            remove all packaging materials.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Shipping Rates</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Orders over $500:</strong> Complimentary Premium Shipping.
            </li>
            <li>
              <strong>Standard Shipping:</strong> $49 flat rate for smaller
              decor items.
            </li>
          </ul>
        </section>
      </article>
    </>
  );
};

export default Page;
