import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { Seo } from "../components/Seo";
import { Badge } from "../components/ui/Badge";
import { cn } from "../lib/utils";
import { BUSINESS } from "../config/business";

const steps = [
  { key: "pending", label: "Received" },
  { key: "preparing", label: "Preparing" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

function stepIndex(status) {
  const i = steps.findIndex((s) => s.key === status);
  return i < 0 ? 0 : i;
}

export function TrackOrder() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data } = await api.get(`/api/orders/${orderId}`);
        if (!cancelled) {
          setOrder(data);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Order not found.");
          setOrder(null);
        }
      }
    }
    load();
    const t = setInterval(load, 5000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [orderId]);

  const active = order ? stepIndex(order.status) : 0;

  return (
    <>
      <Seo
        title={`Track order ${orderId || ""} | Boon Supreme`}
        description={`Live order status for your Boon Supreme order — ${BUSINESS.address}.`}
        path={`/track/${orderId || ""}`}
      />
      <div className="mx-auto max-w-3xl px-4 py-14 md:px-6">
        <h1 className="font-display text-4xl font-bold text-brand-green-deep">
          Track order
        </h1>
        <p className="mt-2 text-sm text-brand-green-deep/70">
          Order ID: <code className="rounded bg-brand-green/10 px-2 py-0.5">{orderId}</code>
        </p>

        {error ? (
          <p className="mt-8 text-brand-terracotta">{error}</p>
        ) : !order ? (
          <p className="mt-8 text-brand-green-deep/60">Loading…</p>
        ) : (
          <div className="mt-10 rounded-2xl border border-brand-green/10 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-brand-green-deep/60">Total</p>
                <p className="text-2xl font-bold text-brand-terracotta">
                  KES {order.total.toLocaleString()}
                </p>
              </div>
              <Badge variant="gold">{order.paymentMethod}</Badge>
            </div>

            <ol className="mt-10 flex flex-col gap-4 md:flex-row md:justify-between">
              {steps.map((s, i) => {
                const done = i <= active;
                const current = i === active;
                return (
                  <li
                    key={s.key}
                    className="flex flex-1 flex-col items-center text-center"
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",
                        done
                          ? "bg-brand-green text-brand-cream"
                          : "bg-brand-green/15 text-brand-green-deep/40",
                        current && "ring-2 ring-brand-gold ring-offset-2"
                      )}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={cn(
                        "mt-2 text-xs font-medium md:text-sm",
                        done ? "text-brand-green-deep" : "text-brand-green-deep/40"
                      )}
                    >
                      {s.label}
                    </span>
                  </li>
                );
              })}
            </ol>

            <p className="mt-8 text-center text-sm text-brand-green-deep/70">
              Status updates every few seconds. Questions? Call {BUSINESS.phoneLocal}{" "}
              ({BUSINESS.phoneE164}).
            </p>
          </div>
        )}
      </div>
    </>
  );
}
