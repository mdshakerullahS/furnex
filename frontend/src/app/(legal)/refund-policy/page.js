import { Separator } from "@/components/ui/separator";

const Page = () => {
  return (
    <>
      <div className="space-y-4">
        <h1 className="text-4xl font-serif">Refund Policy</h1>
        <p className="text-muted-foreground italic">
          Your satisfaction is our primary design goal.
        </p>
      </div>
      <Separator />
      <article className="space-y-8 text-muted-foreground">
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground uppercase tracking-wider">
            30-Day Return Window
          </h2>
          <p>
            We offer a 30-day return period for all unused items in their
            original packaging. Please note that custom-upholstered pieces are
            subject to a 20% restocking fee.
          </p>
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground uppercase tracking-wider">
            Damaged Items
          </h2>
          <p>
            If your piece arrives with structural damage, please notify us
            within 48 hours. We will arrange a priority replacement at no
            additional cost to you.
          </p>
        </section>
      </article>
    </>
  );
};

export default Page;
