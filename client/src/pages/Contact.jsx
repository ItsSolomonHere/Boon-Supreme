import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../api/client";
import { Seo } from "../components/Seo";
import { Button, buttonVariants } from "../components/ui/Button";
import { cn } from "../lib/utils";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { BUSINESS } from "../config/business";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  message: z.string().min(5, "Tell us a bit more"),
});

export function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(data) {
    try {
      await api.post("/api/contact", data);
      toast.success("Thanks — we'll get back to you soon.");
      reset();
    } catch {
      toast.error("Could not send message. Try again later.");
    }
  }

  const mapSrc = BUSINESS.mapsEmbedUrl;

  return (
    <>
      <Seo
        title="Contact & Hours | Boon Supreme TRM Dr Nairobi"
        description={`${BUSINESS.name} on ${BUSINESS.address}. ${BUSINESS.services.join(", ")}. ${BUSINESS.hoursShort}. Call ${BUSINESS.phoneLocal}.`}
        path="/contact"
      />
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <h1 className="font-display text-4xl font-bold text-brand-green-deep">
          Contact
        </h1>
        <p className="mt-2 text-brand-green-deep/75">
          We&apos;d love to hear from you — bookings, catering, or just saying
          jambo.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-semibold">Visit us</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {BUSINESS.services.map((s) => (
                <Badge key={s} variant="gold" className="text-xs">
                  {s}
                </Badge>
              ))}
            </div>
            <p className="mt-4 text-brand-green-deep/80">{BUSINESS.address}</p>
            <p className="mt-2 text-sm text-brand-green-deep/70">
              <span className="font-medium text-brand-green-deep">
                {BUSINESS.hoursShort}
              </span>
              <span className="text-brand-green-deep/60">
                {" "}
                ({BUSINESS.hoursDetail})
              </span>
            </p>
            <p className="mt-2 text-sm text-brand-green-deep/75">
              Typical spend: {BUSINESS.pricePerPerson}
            </p>
            <p className="mt-2">
              <a
                href={`tel:${BUSINESS.phoneE164}`}
                className="font-semibold text-brand-green hover:text-brand-terracotta"
              >
                {BUSINESS.phoneLocal}
              </a>
              <span className="ml-2 text-sm text-brand-green-deep/60">
                ({BUSINESS.phoneE164})
              </span>
            </p>
            <p className="mt-2 text-sm text-brand-green-deep/75">
              Plus code:{" "}
              <a
                href={BUSINESS.mapsOpenUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-brand-green underline-offset-2 hover:underline"
              >
                {BUSINESS.plusCode}
              </a>
            </p>
            <div className="mt-4">
              <Link
                to="/menu"
                className={cn(
                  buttonVariants({ variant: "gold", size: "sm" }),
                  "inline-block text-center"
                )}
              >
                Place an order
              </Link>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-brand-green/10 shadow-sm">
              <iframe
                title="Boon Supreme Restaurant on Google Maps"
                src={mapSrc}
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold">Send a message</h2>
            <form
              className="mt-4 flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div>
                <label htmlFor="contact-name" className="text-sm font-medium">
                  Name
                </label>
                <Input id="contact-name" className="mt-1" {...register("name")} />
                {errors.name ? (
                  <p className="mt-1 text-xs text-brand-terracotta">
                    {errors.name.message}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="contact-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="contact-email"
                  type="email"
                  className="mt-1"
                  {...register("email")}
                />
                {errors.email ? (
                  <p className="mt-1 text-xs text-brand-terracotta">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="contact-message" className="text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  className="mt-1 flex w-full rounded-xl border border-brand-green/20 bg-white px-4 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                  {...register("message")}
                />
                {errors.message ? (
                  <p className="mt-1 text-xs text-brand-terracotta">
                    {errors.message.message}
                  </p>
                ) : null}
              </div>
              <Button type="submit" variant="gold" disabled={isSubmitting}>
                {isSubmitting ? "Sending…" : "Send message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
