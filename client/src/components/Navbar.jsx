import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu as MenuIcon, X } from "lucide-react";
import { cn } from "../lib/utils";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

const links = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function Navbar({ onOpenCart }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logoutRemote = useAuthStore((s) => s.logoutRemote);
  const count = useCartStore((s) => s.items.reduce((a, i) => a + i.qty, 0));
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bar = scrolled
    ? "bg-brand-green-deep/95 shadow-md backdrop-blur-md"
    : "bg-transparent";

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-colors duration-300",
        bar
      )}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6"
        aria-label="Main"
      >
        <Link
          to="/"
          className={cn(
            "font-display text-xl font-bold tracking-tight md:text-2xl",
            scrolled ? "text-brand-cream" : "text-brand-cream drop-shadow-md"
          )}
        >
          Boon Supreme
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold rounded-md px-1",
                  scrolled
                    ? isActive
                      ? "text-brand-gold"
                      : "text-brand-cream/90 hover:text-brand-gold"
                    : isActive
                      ? "text-brand-gold"
                      : "text-brand-cream hover:text-brand-gold"
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {user?.role === "admin" ? (
            <Link
              to="/admin"
              className="hidden text-sm text-brand-gold md:inline hover:underline"
            >
              Admin
            </Link>
          ) : null}
          {user ? (
            <button
              type="button"
              className="hidden text-sm text-brand-cream/90 md:inline hover:text-brand-gold"
              onClick={async () => {
                await logoutRemote();
                navigate("/");
              }}
            >
              Log out
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden text-sm text-brand-cream/90 md:inline hover:text-brand-gold"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hidden rounded-lg border border-brand-cream/40 px-3 py-1.5 text-sm font-medium text-brand-cream md:inline hover:border-brand-gold hover:text-brand-gold"
              >
                Register
              </Link>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative rounded-full text-brand-cream hover:bg-white/10",
              !scrolled && "drop-shadow"
            )}
            onClick={onOpenCart}
            aria-label={`Open cart, ${count} items`}
          >
            <ShoppingCart className="h-6 w-6" />
            {count > 0 ? (
              <Badge
                variant="gold"
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center px-1 text-[10px]"
              >
                {count}
              </Badge>
            ) : null}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-brand-cream md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
        </div>
      </nav>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-brand-green-deep/50"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-brand-cream p-6 shadow-warm">
            <div className="mb-6 flex justify-end">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                aria-label="Close"
              >
                <X className="h-6 w-6 text-brand-green-deep" />
              </Button>
            </div>
            <ul className="flex flex-col gap-4">
              {links.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-lg font-medium text-brand-green-deep"
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                {user ? (
                  <>
                    {user.role === "admin" ? (
                      <Link
                        to="/admin"
                        className="text-lg font-medium text-brand-green-deep"
                        onClick={() => setMobileOpen(false)}
                      >
                        Admin
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      className="mt-2 block text-lg font-medium text-brand-green-deep"
                      onClick={async () => {
                        setMobileOpen(false);
                        await logoutRemote();
                        navigate("/");
                      }}
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      className="text-lg font-medium text-brand-green-deep"
                      onClick={() => setMobileOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="text-lg font-medium text-brand-green-deep"
                      onClick={() => setMobileOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      ) : null}
    </header>
  );
}
