"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone, SendHorizontal } from "lucide-react";
import { useForm } from "react-hook-form";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import useAuth from "@/stores/userStore";
import { useState } from "react";
import { Card } from "@/components/ui/card";

const ContactPage = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      subject: "",
      message: "",
    },
  });

  const name = watch("name");
  const email = watch("email");
  const message = watch("message");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      reset();
      toast.success("Message sent! We'll get back to you shortly.");
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-20">
      {/* --- Header Section --- */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-serif font-medium">
          Get In Touch
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          For more information about our products & services, please feel free
          to drop us an email. Our staff is always there to help you out. Do not
          hesitate!
        </p>
      </div>

      {/* --- Main Content --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start justify-center">
        {/* --- Contact Info --- */}
        <Card className="bg-background h-full p-8 md:p-12 rounded-3xl border border-border/40 shadow-sm shadow-black/5">
          <div className="space-y-12">
            <div className="flex gap-6">
              <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-serif font-medium">
                  Visit Our Showroom
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  233 King Street, Melbourne VIC 3000, Australia
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-serif font-medium">
                  Contact Details
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Mobile:{" "}
                  <Link
                    href="tel:+845466789"
                    className="hover:text-primary transition-colors"
                  >
                    +(84) 546-6789
                  </Link>
                  <br />
                  Hotline:{" "}
                  <Link
                    href="tel:+845466789"
                    className="hover:text-primary transition-colors"
                  >
                    +(84) 456-6789
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="h-12 w-12 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-serif font-medium">
                  Working Hours
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Monday-Friday: 9:00 - 22:00 <br />
                  Saturday-Sunday: 9:00 - 21:00
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* --- Contact Form --- */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 md:p-12 rounded-3xl border border-border/40 shadow-sm shadow-black/5"
        >
          <FieldGroup className="gap-8">
            <Field className="space-y-3">
              <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Your Name
              </FieldLabel>
              <Input
                placeholder="John Doe"
                {...register("name")}
                className="h-12 rounded-xl bg-secondary/20 border-transparent focus:bg-background transition-all"
              />
            </Field>

            <Field className="space-y-3">
              <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Email Address
              </FieldLabel>
              <Input
                placeholder="john@doe.com"
                {...register("email")}
                className="h-12 rounded-xl bg-secondary/20 border-transparent focus:bg-background transition-all"
              />
            </Field>

            <Field className="space-y-3">
              <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Subject
              </FieldLabel>
              <Input
                placeholder="Product Inquiry"
                {...register("subject")}
                className="h-12 rounded-xl bg-secondary/20 border-transparent focus:bg-background transition-all"
              />
            </Field>

            <Field className="space-y-3">
              <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Message
              </FieldLabel>
              <Textarea
                placeholder="Hi! I'd like to ask about..."
                {...register("message")}
                className="min-h-[150px] rounded-xl bg-secondary/20 border-transparent focus:bg-background transition-all resize-none"
              />
            </Field>

            <Button
              disabled={!name || !email || !message || isSubmitting}
              type="submit"
              className="w-full md:w-auto px-12 h-14 rounded-full font-bold uppercase tracking-widest text-xs gap-3 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              <SendHorizontal className="w-4 h-4" />
            </Button>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
