import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../api/client";
import { Seo } from "../components/Seo";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Dialog } from "../components/ui/Dialog";
import { useAuthStore } from "../store/authStore";

const emptyItem = {
  name: "",
  slug: "",
  description: "",
  priceKES: 400,
  category: "mains",
  image: "",
  popular: false,
  vegan: false,
  spicy: false,
};

export function Admin() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyItem);

  async function load() {
    try {
      const [m, o] = await Promise.all([
        api.get("/api/menu"),
        api.get("/api/orders"),
      ]);
      setMenu(m.data);
      setOrders(o.data);
    } catch {
      toast.error("Could not load admin data.");
    }
  }

  useEffect(() => {
    if (user?.role === "admin") load();
  }, [user]);

  if (loading) {
    return (
      <div className="p-12 text-center text-brand-green-deep/60">Loading…</div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  function openCreate() {
    setEditing(null);
    setForm(emptyItem);
    setDialogOpen(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      name: item.name,
      slug: item.slug,
      description: item.description || "",
      priceKES: item.priceKES,
      category: item.category,
      image: item.image || "",
      popular: !!item.popular,
      vegan: !!item.vegan,
      spicy: !!item.spicy,
    });
    setDialogOpen(true);
  }

  async function saveItem(e) {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/api/menu/${editing._id}`, form);
        toast.success("Menu item updated.");
      } else {
        await api.post("/api/menu", form);
        toast.success("Menu item created.");
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Save failed.");
    }
  }

  async function removeItem(id) {
    if (!confirm("Delete this item?")) return;
    try {
      await api.delete(`/api/menu/${id}`);
      toast.success("Deleted.");
      load();
    } catch {
      toast.error("Delete failed.");
    }
  }

  async function setStatus(orderId, status) {
    try {
      await api.patch(`/api/orders/${orderId}/status`, { status });
      toast.success("Status updated.");
      load();
    } catch {
      toast.error("Update failed.");
    }
  }

  return (
    <>
      <Seo
        title="Admin | Boon Supreme Restaurant"
        description="Manage menu and orders."
        path="/admin"
      />
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <h1 className="font-display text-4xl font-bold text-brand-green-deep">
          Admin
        </h1>

        <section className="mt-12">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold">Menu</h2>
            <Button variant="gold" onClick={openCreate}>
              Add item
            </Button>
          </div>
          <div className="mt-6 overflow-x-auto rounded-xl border border-brand-green/10 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-brand-green/10 bg-brand-cream">
                <tr>
                  <th className="p-3 font-semibold">Name</th>
                  <th className="p-3 font-semibold">Category</th>
                  <th className="p-3 font-semibold">KES</th>
                  <th className="p-3 font-semibold">Flags</th>
                  <th className="p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menu.map((item) => (
                  <tr key={item._id} className="border-b border-brand-green/5">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3 capitalize">{item.category}</td>
                    <td className="p-3">{item.priceKES}</td>
                    <td className="p-3 text-xs">
                      {[item.popular && "pop", item.vegan && "veg", item.spicy && "spicy"]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </td>
                    <td className="p-3 space-x-2">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(item)}>
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeItem(item._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">Orders</h2>
          <div className="mt-6 space-y-4">
            {orders.map((o) => (
              <div
                key={o._id}
                className="rounded-xl border border-brand-green/10 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-xs text-brand-green-deep/60">{o._id}</p>
                  <span className="rounded-full bg-brand-gold/20 px-3 py-1 text-xs font-semibold capitalize">
                    {o.status.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="mt-2 text-sm">
                  {o.customer.name} · {o.customer.phone}
                </p>
                <p className="font-semibold text-brand-terracotta">
                  KES {o.total.toLocaleString()} · {o.paymentMethod}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["pending", "preparing", "out_for_delivery", "delivered"].map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={o.status === s ? "gold" : "outline"}
                      className={
                        o.status === s
                          ? ""
                          : "border-brand-green/20 text-brand-green-deep bg-white"
                      }
                      onClick={() => setStatus(o._id, s)}
                    >
                      {s.replace(/_/g, " ")}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
            {orders.length === 0 ? (
              <p className="text-sm text-brand-green-deep/60">No orders yet.</p>
            ) : null}
          </div>
        </section>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editing ? "Edit menu item" : "New menu item"}
      >
        <form className="flex flex-col gap-3" onSubmit={saveItem}>
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            placeholder="Slug (url)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />
          <textarea
            className="min-h-[80px] rounded-xl border border-brand-green/20 px-4 py-2 text-sm"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Price KES"
            value={form.priceKES}
            onChange={(e) =>
              setForm({ ...form, priceKES: Number(e.target.value) })
            }
            required
          />
          <select
            className="h-11 rounded-xl border border-brand-green/20 px-4 text-sm"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="mains">mains</option>
            <option value="sides">sides</option>
            <option value="vegan">vegan</option>
            <option value="drinks">drinks</option>
          </select>
          <Input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.popular}
              onChange={(e) => setForm({ ...form, popular: e.target.checked })}
            />
            Popular
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.vegan}
              onChange={(e) => setForm({ ...form, vegan: e.target.checked })}
            />
            Vegan
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.spicy}
              onChange={(e) => setForm({ ...form, spicy: e.target.checked })}
            />
            Spicy
          </label>
          <Button type="submit" variant="gold">
            Save
          </Button>
        </form>
      </Dialog>
    </>
  );
}
