import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { Seo } from "../components/Seo";
import { MenuItemCard } from "../components/MenuItemCard";
import { Button } from "../components/ui/Button";
import { useCartStore } from "../store/cartStore";
const categories = [
  { id: "all", label: "All" },
  { id: "mains", label: "Mains" },
  { id: "sides", label: "Sides" },
  { id: "vegan", label: "Vegan" },
  { id: "drinks", label: "Drinks" },
];
export function Menu() {
  const [items, setItems] = useState([]);
  const [cat, setCat] = useState("all");
  const [veganOnly, setVeganOnly] = useState(false);
  const [spicyOnly, setSpicyOnly] = useState(false);
  const [popularOnly, setPopularOnly] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  useEffect(() => {
    const params = {};
    if (cat !== "all") params.category = cat;
    if (veganOnly) params.vegan = true;
    if (spicyOnly) params.spicy = true;
    if (popularOnly) params.popular = true;
    api
      .get("/api/menu", { params })
      .then((res) => {
        const data = res.data;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => setItems([]));
  }, [cat, veganOnly, spicyOnly, popularOnly]);
  const title = useMemo(
    () => "Full Menu | Boon Supreme Restaurant Nairobi",
    []
  );
  return (
    <>
      <Seo
        title={title}
        description="Browse mains, sides, vegan plates, and drinks. Boon Supreme on TRM Dr, Nairobi — dine-in, takeaway, delivery."
        path="/menu"
      />
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <h1 className="font-display text-4xl font-bold text-brand-green-deep">
          Menu
        </h1>
        <p className="mt-2 max-w-2xl text-brand-green-deep/75">
          Everything is cooked to order. Tap filters to explore vegan, spicy, and
          crowd favourites.
        </p>
        <div className="mt-8 flex flex-wrap gap-2 border-b border-brand-green/10 pb-4">
          {categories.map((c) => (
            <Button
              key={c.id}
              variant={cat === c.id ? "gold" : "ghost"}
              size="sm"
              className={
                cat === c.id ? "" : "text-brand-green-deep hover:bg-brand-green/10"
              }
              onClick={() => setCat(c.id)}
            >
              {c.label}
            </Button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={veganOnly ? "default" : "outline"}
            className={veganOnly ? "" : "border-brand-green/20 text-brand-green-deep bg-white"}
            onClick={() => setVeganOnly((v) => !v)}
          >
            Vegan
          </Button>
          <Button
            size="sm"
            variant={spicyOnly ? "default" : "outline"}
            className={spicyOnly ? "" : "border-brand-green/20 text-brand-green-deep bg-white"}
            onClick={() => setSpicyOnly((v) => !v)}
          >
            Spicy
          </Button>
          <Button
            size="sm"
            variant={popularOnly ? "default" : "outline"}
            className={popularOnly ? "" : "border-brand-green/20 text-brand-green-deep bg-white"}
            onClick={() => setPopularOnly((v) => !v)}
          >
            Popular
          </Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <MenuItemCard key={item._id} item={item} onAdd={addItem} />
          ))}
        </div>
        {items.length === 0 ? (
          <p className="mt-12 text-center text-brand-green-deep/60">
            No dishes match these filters. Try adjusting your selection.
          </p>
        ) : null}
      </div>
    </>
  );
}
