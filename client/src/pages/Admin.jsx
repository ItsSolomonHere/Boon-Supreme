import { useEffect, useState, useCallback } from "react";
import { api } from "../api/client";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

const STATUS_FLOW = ["pending", "preparing", "out_for_delivery", "delivered"];

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

const STATUS_LABELS = {
  pending: "🆕 New",
  preparing: "👨‍🍳 Preparing",
  out_for_delivery: "🛵 Out for Delivery",
  delivered: "✅ Delivered",
};

const NEXT_ACTION = {
  pending: { label: "Accept & Prepare", next: "preparing" },
  preparing: { label: "Mark Out for Delivery", next: "out_for_delivery" },
  out_for_delivery: { label: "Mark Delivered", next: "delivered" },
};

export function Admin() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState("all");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get("/api/orders");
      setOrders(res.data);
      setLastUpdated(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "admin") { navigate("/"); return; }
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [user, navigate, fetchOrders]);

  async function updateStatus(orderId, newStatus) {
    setUpdating(orderId);
    try {
      await api.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      await fetchOrders();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  }

  async function rejectOrder(orderId) {
    if (!confirm("Reject and delete this order?")) return;
    setUpdating(orderId);
    try {
      await api.delete(`/api/orders/${orderId}`);
      await fetchOrders();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(null);
    }
  }

  const filtered = filter === "all"
    ? orders
    : orders.filter(o => o.status === filter);

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    preparing: orders.filter(o => o.status === "preparing").length,
    out_for_delivery: orders.filter(o => o.status === "out_for_delivery").length,
    delivered: orders.filter(o => o.status === "delivered").length,
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-4xl mb-4">🍽️</div>
        <p className="text-gray-500">Loading orders...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🍽️ Boon Supreme</h1>
            <p className="text-sm text-gray-500">Restaurant Dashboard</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Auto-refreshes every 10s
            </p>
            {lastUpdated && (
              <p className="text-xs text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="max-w-7xl mx-auto px-4 pb-4 flex gap-3 overflow-x-auto">
          {[
            { key: "all", label: "All Orders", emoji: "📋" },
            { key: "pending", label: "New", emoji: "🆕" },
            { key: "preparing", label: "Preparing", emoji: "👨‍🍳" },
            { key: "out_for_delivery", label: "On the Way", emoji: "🛵" },
            { key: "delivered", label: "Delivered", emoji: "✅" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === tab.key
                  ? "bg-green-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.emoji} {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                filter === tab.key ? "bg-white text-green-700" : "bg-white text-gray-600"
              }`}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-xl font-semibold text-gray-700">No orders here</p>
            <p className="text-gray-400 mt-2">
              {filter === "pending" ? "All caught up! No new orders." : "Nothing to show for this filter."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(order => (
              <div
                key={order._id}
                className={`bg-white rounded-2xl shadow-sm border-2 transition-all ${
                  order.status === "pending" ? "border-yellow-300" : "border-transparent"
                }`}
              >
                {/* Order header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-gray-400">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{order.customer.name}</p>
                      <p className="text-sm text-gray-500">{order.customer.phone}</p>
                      {order.customer.address && (
                        <p className="text-xs text-gray-400 mt-1">📍 {order.customer.address}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-700">
                        KES {order.total.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        💳 {order.paymentMethod}
                        {order.mpesaCode && ` · ${order.mpesaCode}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order items */}
                <div className="p-4 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Items</p>
                  <div className="space-y-1">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {item.qty}x {item.menuItemId?.name || "Item"}
                        </span>
                        <span className="text-gray-500">
                          KES {(item.price * item.qty).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time */}
                <div className="px-4 pt-3 pb-2">
                  <p className="text-xs text-gray-400">
                    🕐 {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                {NEXT_ACTION[order.status] && (
                  <div className="p-4 pt-2 flex gap-2">
                    <button
                      onClick={() => updateStatus(order._id, NEXT_ACTION[order.status].next)}
                      disabled={updating === order._id}
                      className="flex-1 bg-green-700 text-white py-2 px-4 rounded-xl text-sm font-bold hover:bg-green-800 disabled:opacity-50 transition-all"
                    >
                      {updating === order._id ? "Updating..." : NEXT_ACTION[order.status].label}
                    </button>
                    {order.status === "pending" && (
                      <button
                        onClick={() => rejectOrder(order._id)}
                        disabled={updating === order._id}
                        className="px-4 py-2 rounded-xl text-sm font-bold text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-50 transition-all"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
