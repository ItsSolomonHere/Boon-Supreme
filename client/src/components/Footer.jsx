import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { OrderTrackWidget } from "./OrderTrackWidget";
import { BUSINESS } from "../config/business";

export function Footer() {
  return (
    <footer className="bg-brand-green-deep text-brand-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-semibold">About</p>
          <p className="mt-3 text-sm text-brand-cream/80">
            Authentic Kenyan flavours on TRM Dr — fresh ingredients, warm
            hospitality, and the taste of home in every plate.
          </p>
        </div>
        <div>
          <p className="font-display text-lg font-semibold">Quick Links</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <Link to="/menu" className="text-brand-cream/80 hover:text-brand-gold">
                Menu
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-brand-cream/80 hover:text-brand-gold">
                Our Story
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-brand-cream/80 hover:text-brand-gold">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/cart" className="text-brand-cream/80 hover:text-brand-gold">
                Cart
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-brand-cream/80 hover:text-brand-gold">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="text-brand-cream/80 hover:text-brand-gold">
                Register
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-display text-lg font-semibold">Contact</p>
          <div className="mt-4">
            <OrderTrackWidget className="[&_input]:bg-brand-green-deep/30 [&_input]:border-brand-cream/30 [&_input]:text-brand-cream [&_input]:placeholder:text-brand-cream/50" />
          </div>
          <ul className="mt-6 space-y-2 text-sm text-brand-cream/80">
            <li>{BUSINESS.address}</li>
            <li className="text-brand-cream/70">
              {BUSINESS.services.join(" · ")}
            </li>
            <li>
              <a href={`tel:${BUSINESS.phoneE164}`} className="hover:text-brand-gold">
                {BUSINESS.phoneLocal}
              </a>
            </li>
            <li>{BUSINESS.hoursShort}</li>
            <li className="text-xs text-brand-cream/60">{BUSINESS.pricePerPerson}</li>
          </ul>
        </div>
        <div>
          <p className="font-display text-lg font-semibold">Social</p>
          <div className="mt-4 flex gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-brand-cream/30 p-2 hover:border-brand-gold hover:text-brand-gold"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-brand-cream/30 p-2 hover:border-brand-gold hover:text-brand-gold"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-brand-cream/30 p-2 hover:border-brand-gold hover:text-brand-gold"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-brand-cream/60">
        © {new Date().getFullYear()} Boon Supreme Restaurant. All rights reserved.
      </div>
    </footer>
  );
}
