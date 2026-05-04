import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../api/client";
import { Seo } from "../components/Seo";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useCartStore } from "../store/cartStore";

export function Cart() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const setQty = useCartStore((s) => s.setQty);
  const clear = useCartStore((s) => s.clear);
  const total = useCartStore((s) =>
    s.items.reduce((acc, i) => acc + i.priceKES * i.qty, 0)
  );

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [mpesaCode, setMpesaCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function checkout(e) {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!name.trim() || !phone.trim()) {
      toast.error("Name and phone are required.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => ({ menuItemId: i._id, qty: i.qty })),
        customer: { name: name.trim(), phone: phone.trim(), address: address.trim() },
        paymentMethod,
        mpesaCode: paymentMethod === "mpesa" ? mpesaCode.trim() : undefined,
      };
      const { data } = await api.post("/api/orders", payload);
      if (paymentMethod === "mpesa") {
        try {
          const r = await api.post("/api/mpesa/stkpush", { amount: total, phone });
          toast.success(`M-Pesa request sent. Ref: ${r.data.CheckoutRequestID}`);
        } catch {
          toast.message("Order saved; complete M-Pesa on your phone.");
        }
      } else {
        toast.success("Order placed!");
      }
      clear();
      navigate(`/track/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Checkout failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Seo
        title="Checkout | Boon Supreme Restaurant"
        description="Complete your order — M-Pesa, card, or cash on delivery. Boon Supreme, TRM Dr, Nairobi."
        path="/cart"
      />
      <div className="mx-auto max-w-4xl px-4 py-14 md:px-6">
        <h1 className="font-display text-4xl font-bold text-brand-green-deep">
          Cart & checkout
        </h1>

        {items.length === 0 ? (
          <p className="mt-8 text-brand-green-deep/70">
            Your cart is empty.{" "}
            <button
              type="button"
              className="font-semibold text-brand-green underline"
              onClick={() => navigate("/menu")}
            >
              Browse the menu
            </button>
          </p>
        ) : (
          <form onSubmit={checkout} className="mt-10 grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-xl font-semibold">Your order</h2>
              <ul className="mt-4 space-y-3">
                {items.map((item) => (
                  <li
                    key={item._id}
                    className="flex justify-between gap-4 rounded-xl border border-brand-green/10 bg-white p-3 text-sm"
                  >
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span className="shrink-0 font-medium">
                      KES {(item.priceKES * item.qty).toLocaleString()}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setQty(item._id, item.qty - 1)}
                      >
                        −
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setQty(item._id, item.qty + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-lg font-bold text-brand-terracotta">
                Total: KES {total.toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl border border-brand-green/10 bg-white p-6 shadow-sm">
              <h2 className="font-display text-xl font-semibold">Details</h2>
              <div className="mt-4 space-y-3">
                <div>
                  <label htmlFor="co-name" className="text-sm font-medium">
                    Full name
                  </label>
                  <Input
                    id="co-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="co-phone" className="text-sm font-medium">
                    Phone
                  </label>
                  <Input
                    id="co-phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="co-address" className="text-sm font-medium">
                    Delivery address (optional)
                  </label>
                  <Input
                    id="co-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <fieldset className="mt-6">
                <legend className="text-sm font-semibold">Payment</legend>
                <div className="mt-3 space-y-2">
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="pay"
                      checked={paymentMethod === "mpesa"}
                      onChange={() => setPaymentMethod("mpesa")}
                    />
                    M-Pesa (Paybill 247247, account BOON)
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="pay"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    Card
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="pay"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                    />
                    Cash on delivery
                  </label>
                </div>
              </fieldset>

              {paymentMethod === "mpesa" ? (
                <div className="mt-4">
                  <label htmlFor="co-mpesa" className="text-sm font-medium">
                    M-Pesa confirmation code (optional)
                  </label>
                  <Input
                    id="co-mpesa"
                    value={mpesaCode}
                    onChange={(e) => setMpesaCode(e.target.value)}
                    className="mt-1"
                    placeholder="e.g. QGH12345XYZ"
                  />
                </div>
              ) : null}

              <Button
                type="submit"
                variant="gold"
                className="mt-8 w-full"
                disabled={submitting}
              >
                {submitting ? "Placing order…" : "Place order"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
