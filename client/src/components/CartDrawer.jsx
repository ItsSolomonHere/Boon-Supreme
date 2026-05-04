import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Drawer } from "./ui/Drawer";
import { Button } from "./ui/Button";
import { useCartStore } from "../store/cartStore";

export function CartDrawer({ open, onOpenChange }) {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = useCartStore((s) =>
    s.items.reduce((acc, i) => acc + i.priceKES * i.qty, 0)
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange} title="Your cart">
      {items.length === 0 ? (
        <p className="text-center text-sm text-brand-green-deep/70">
          Your cart is empty. Add something delicious from the menu!
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li
                key={item._id}
                className="flex gap-3 rounded-xl border border-brand-green/10 bg-white p-3"
              >
                <img
                  src={item.image}
                  alt=""
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-brand-green-deep">{item.name}</p>
                  <p className="text-sm text-brand-terracotta">
                    KES {item.priceKES.toLocaleString()} each
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-brand-green/20 text-brand-green-deep"
                      onClick={() => setQty(item._id, item.qty - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center text-sm">{item.qty}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 border-brand-green/20 text-brand-green-deep"
                      onClick={() => setQty(item._id, item.qty + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-8 w-8 text-brand-terracotta"
                      onClick={() => removeItem(item._id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-brand-green/10 pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-brand-terracotta">
                KES {total.toLocaleString()}
              </span>
            </div>
            <Button
              variant="gold"
              className="mt-4 w-full"
              onClick={() => {
                onOpenChange(false);
                navigate("/cart");
              }}
            >
              Checkout
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
