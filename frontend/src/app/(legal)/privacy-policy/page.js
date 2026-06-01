import { Separator } from "@/components/ui/separator";

const Page = () => {
  return (
    <>
      <div className="space-y-4">
        <h1 className="text-4xl font-serif">Privacy Policy</h1>
        <p className="text-muted-foreground italic">
          Your privacy is as important as your comfort.
        </p>
      </div>
      <Separator />
      <article className="space-y-10 text-muted-foreground leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">
            1. Information We Collect
          </h2>
          <p>
            When you shop at Furnex, we collect the personal information you
            give us such as your name, address, and email address. This allows
            us to process your orders and provide a personalized experience.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">
            2. Secure Payments
          </h2>
          <p>
            Your payment security is our priority. We use industry-standard
            encryption and third-party payment processors. We do not store your
            credit card information on our servers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">
            3. Cookie Policy
          </h2>
          <p>
            We use cookies to maintain your shopping cart sessions and
            understand how you interact with our boutique. You can choose to
            disable cookies in your browser settings, though some features of
            the shop may become unavailable.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">
            4. Your Rights
          </h2>
          <p>
            You have the right to access, correct, or delete your personal data
            at any time. Simply contact our support team through the Contact
            Page.
          </p>
        </section>
      </article>
    </>
  );
};

export default Page;
