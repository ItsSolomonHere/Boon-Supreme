import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, Truck, UtensilsCrossed } from "lucide-react";
import { api } from "../api/client";
import { Seo } from "../components/Seo";
import { MenuItemCard } from "../components/MenuItemCard";
import { buttonVariants } from "../components/ui/Button";
import { cn } from "../lib/utils";
import { useCartStore } from "../store/cartStore";
import { BUSINESS } from "../config/business";

const heroImage = "/assets/hero-feast.jpg";

const steamConfig = [
  { left: "18%", delay: "0s", duration: "5s" },
  { left: "26%", delay: "0.4s", duration: "5.5s" },
  { left: "44%", delay: "0.9s", duration: "6s" },
  { left: "58%", delay: "1.2s", duration: "5.2s" },
  { left: "72%", delay: "1.6s", duration: "6.5s" },
  { left: "84%", delay: "2.1s", duration: "5.8s" },
];

function restaurantJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: BUSINESS.name,
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80",
    address: {
      "@type": "PostalAddress",
      streetAddress: "TRM Dr",
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
    telephone: BUSINESS.phoneE164,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "11:00",
        closes: "22:00",
      },
    ],
    servesCuisine: "Kenyan",
    priceRange: BUSINESS.pricePerPerson,
  };
}

export function Home() {
  const [featured, setFeatured] = useState([]);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    api
      .get("/api/menu", { params: { popular: true } })
      .then((res) => setFeatured(res.data))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <>
      <Seo
        title="Boon Supreme Restaurant | Kenyan Food TRM Dr Nairobi"
        description={`Fresh Kenyan food on ${BUSINESS.address}. Dine-in, takeaway & delivery. Call ${BUSINESS.phoneLocal}. Pilau, kienyeji chicken, vegan options & more.`}
        path="/"
        jsonLd={restaurantJsonLd()}
      />

      <section className="relative min-h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
          role="img"
          aria-label="Kenyan feast platter spread on a table"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden">
          {steamConfig.map((s, i) => (
            <div
              key={i}
              className="steam"
              style={{
                left: s.left,
                animationDelay: s.delay,
                animationDuration: s.duration,
              }}
            />
          ))}
        </div>
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pb-24 pt-28 text-center md:pt-36">
          <span
            className="animate-fade-in-up mb-6 inline-flex items-center rounded-full border-2 border-brand-gold bg-brand-green-deep/40 px-4 py-1.5 text-sm font-medium text-brand-gold backdrop-blur-sm"
            style={{ animationDelay: "0s" }}
          >
            ✨ TRM Dr · Nairobi
          </span>
          <h1
            className="animate-fade-in-up font-display text-5xl font-bold leading-tight text-brand-cream md:text-7xl"
            style={{ animationDelay: "0.1s" }}
          >
            Boon Supreme Restaurant
          </h1>
          <p
            className="animate-fade-in-up mt-6 max-w-2xl text-lg text-brand-cream/90 md:text-xl"
            style={{ animationDelay: "0.2s" }}
          >
            Fresh. Flavourful. Affordable. Authentic Kenyan flavours, served warm
            with love.
          </p>
          <div
            className="animate-fade-in-up mt-10 flex flex-wrap justify-center gap-4"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              to="/menu"
              className={cn(
                buttonVariants({ variant: "gold", size: "lg" }),
                "min-w-[160px] text-center"
              )}
            >
              Order Now
            </Link>
            <Link
              to="/menu"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "min-w-[160px] border-brand-cream text-brand-cream hover:bg-brand-cream/10 text-center"
              )}
            >
              View Menu
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-warm py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-3 md:px-6">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <UtensilsCrossed
              className="h-10 w-10 text-brand-green"
              aria-hidden
            />
            <p className="mt-4 font-semibold text-brand-green-deep">
              Made fresh daily
            </p>
            <p className="mt-2 text-sm text-brand-green-deep/80">
              Locally sourced ingredients prepared by hand each morning.
            </p>
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Leaf className="h-10 w-10 text-brand-green" aria-hidden />
            <p className="mt-4 font-semibold text-brand-green-deep">
              Vegan-friendly 🌿
            </p>
            <p className="mt-2 text-sm text-brand-green-deep/80">
              Plenty of plant-based options. Just look for the leaf badge.
            </p>
          </div>
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Truck className="h-10 w-10 text-brand-green" aria-hidden />
            <p className="mt-4 font-semibold text-brand-green-deep">
              Delivered fast
            </p>
            <p className="mt-2 text-sm text-brand-green-deep/80">
              Order via Bolt Food, Glovo, or Uber Eats — straight to your door.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">
              Crowd favourites
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-brand-green-deep md:text-4xl">
              Featured Dishes
            </h2>
          </div>
          <Link
            to="/menu"
            className="hidden text-sm font-semibold text-brand-green hover:text-brand-terracotta md:inline"
          >
            See full menu →
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item) => (
            <MenuItemCard key={item._id} item={item} onAdd={addItem} />
          ))}
        </div>
        <Link
          to="/menu"
          className="mt-8 inline-block text-sm font-semibold text-brand-green md:hidden"
        >
          See full menu →
        </Link>
      </section>

      <section className="bg-brand-green-deep py-16 text-brand-cream">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-2 md:items-center md:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">
              Our story
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              A taste of home, in every plate.
            </h2>
            <p className="mt-4 text-brand-cream/85">
              Born from mama&apos;s kitchen and Nairobi soul, Boon Supreme brings
              together family recipes, bold spices, and the warmth of shared
              meals. Every dish is cooked with intention — so you feel at home,
              whether you&apos;re dining in or ordering to your doorstep.
            </p>
            <Link
              to="/about"
              className={cn(buttonVariants({ variant: "gold" }), "mt-8 inline-block text-center")}
            >
              Read more
            </Link>
          </div>
          <div className="rounded-3xl border border-brand-gold/20 bg-brand-green/30 p-8 backdrop-blur-md">
            <h3 className="font-display text-xl font-semibold">
              Order on your favourite app
            </h3>
            <p className="mt-2 text-sm text-brand-cream/80">
              Tap below — we&apos;ll see you on TRM Dr or at your door.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a
                href="https://bolt.eu/en/food/"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-brand-gold/30 bg-brand-green-deep/40 px-4 py-3 text-center text-sm font-semibold transition-colors hover:border-brand-gold hover:bg-gradient-gold hover:text-brand-green-deep"
              >
                Bolt Food
              </a>
              <a
                href="https://glovoapp.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-brand-gold/30 bg-brand-green-deep/40 px-4 py-3 text-center text-sm font-semibold transition-colors hover:border-brand-gold hover:bg-gradient-gold hover:text-brand-green-deep"
              >
                Glovo
              </a>
              <a
                href="https://www.ubereats.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-brand-gold/30 bg-brand-green-deep/40 px-4 py-3 text-center text-sm font-semibold transition-colors hover:border-brand-gold hover:bg-gradient-gold hover:text-brand-green-deep"
              >
                Uber Eats
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
