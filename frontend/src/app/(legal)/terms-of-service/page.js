import { Separator } from "@/components/ui/separator";

const Page = () => {
  return (
    <>
      <div className="space-y-4">
        <h1 className="text-4xl font-serif">Terms of Service</h1>
        <p className="text-muted-foreground italic">
          The fine print, simplified.
        </p>
      </div>
      <Separator />
      <article className="space-y-10 text-muted-foreground leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">
            1. Craftsmanship Variance
          </h2>
          <p>
            Because our furniture is crafted from natural wood and materials,
            slight variations in grain, color, and texture are to be expected
            and are celebrated as unique characteristics of handcrafted design.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">
            2. Accuracy of Information
          </h2>
          <p>
            While we strive for perfection, we reserve the right to correct any
            errors in product descriptions or pricing and to cancel orders if an
            item was listed incorrectly.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">
            3. Order Acceptance
          </h2>
          <p>
            Your receipt of an order confirmation does not signify our
            acceptance of your order. We reserve the right at any time after
            receipt of your order to accept or decline your order for any
            reason.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">
            4. Governing Law
          </h2>
          <p>
            These terms are governed by the laws of the jurisdiction in which
            Furniro is registered, without regard to its conflict of law
            provisions.
          </p>
        </section>
      </article>
    </>
  );
};

export default Page;
