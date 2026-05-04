import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem(item, qty = 1) {
        const { items } = get();
        const id = item._id;
        const existing = items.find((i) => i._id === id);
        if (existing) {
          set({
            items: items.map((i) =>
              i._id === id ? { ...i, qty: i.qty + qty } : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, qty }] });
        }
      },
      removeItem(id) {
        set({ items: get().items.filter((i) => i._id !== id) });
      },
      setQty(id, qty) {
        if (qty < 1) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i._id === id ? { ...i, qty } : i)),
        });
      },
      clear() {
        set({ items: [] });
      },
      get total() {
        return get().items.reduce((s, i) => s + i.priceKES * i.qty, 0);
      },
      get count() {
        return get().items.reduce((s, i) => s + i.qty, 0);
      },
    }),
    { name: "boon-cart" }
  )
);
