import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { buttonVariants } from "../components/ui/Button";
import { cn } from "../lib/utils";

export function About() {
  return (
    <>
      <Seo
        title="Our Story | Boon Supreme Restaurant Nairobi"
        description="Values, team, and the story behind Boon Supreme — Kenyan restaurant on TRM Dr, Nairobi."
        path="/about"
      />
      <div className="mx-auto max-w-3xl px-4 py-14 md:px-6">
        <h1 className="font-display text-4xl font-bold text-brand-green-deep">
          Our story
        </h1>
        <p className="mt-6 text-lg text-brand-green-deep/85">
          Boon Supreme started as a simple idea: what if the flavours we grew up
          with — the pilau at family gatherings, the kienyeji simmering on
          Sunday, the chapati pulled fresh off the pan — could live in a place
          that feels both elevated and deeply familiar?
        </p>
        <h2 className="mt-10 font-display text-2xl font-semibold text-brand-green-deep">
          Values
        </h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-brand-green-deep/80">
          <li>Fresh ingredients from trusted local suppliers.</li>
          <li>Fair pricing so great Kenyan food stays accessible.</li>
          <li>Warm service — every guest leaves feeling fed and seen.</li>
        </ul>
        <h2 className="mt-10 font-display text-2xl font-semibold text-brand-green-deep">
          Team
        </h2>
        <p className="mt-4 text-brand-green-deep/80">
          Our kitchen is led by chefs who have cooked across Nairobi homes and
          hotels alike. Front-of-house knows TRM Dr by heart — stop by, say
          hello, and let us recommend something new.
        </p>
        <Link
          to="/menu"
          className={cn(
            buttonVariants({ variant: "gold" }),
            "mt-10 inline-block text-center"
          )}
        >
          Explore the menu
        </Link>
      </div>
    </>
  );
}
