import { useEffect, useState, useCallback } from "react";
import { api } from "../api/client";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

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
  const { user, loading: authLoading } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState("all");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/api/orders");
      const data = Array.isArray(res.data) ? res.data : [];
      setOrders(data);
      setLastUpdated(new Date());
    } catch (e) {
      console.error("Failed to fetch orders:", e);
      setError("Failed to load orders. Make sure you are logged in as admin.");
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login"); return; }
    if (user.role !== "admin") { navigate("/"); return; }
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [user, authLoading, navigate, fetchOrders]);

  async function updateStatus(orderId, newStatus) {
    setUpdating(orderId);
    try {
      await api.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      await fetchOrders();
    } catch (e) {
      console.error("Failed to update status:", e);
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdating(null);
    }
  }

  async function rejectOrder(orderId) {
    if (!window.confirm("Reject and delete this order?")) return;
    setUpdating(orderId);
    try {
      await api.delete(`/api/orders/${orderId}`);
      await fetchOrders();
    } catch (e) {
      console.error("Failed to delete order:", e);
      alert("Failed to reject order. Please try again.");
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

  // Show auth loading
  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-4xl mb-4">🔐</div>
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    </div>
  );

  // Show orders loading
  if (ordersLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-4xl mb-4">🍽️</div>
        <p className="text-gray-500">Loading orders...</p>
      </div>
    </div>
  );

  // Show error
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="text-red-600 font-semibold mb-4">{error}</p>
        <button
          onClick={fetchOrders}
          className="bg-green-700 text-white px-6 py-2 rounded-xl font-bold hover:bg-green-800"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🍽️ Boon Supreme</h1>
            <p className="text-sm text-gray-500">Restaurant Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-green-600 font-semibold">● Live — auto refreshes every 10s</p>
              {lastUpdated && (
                <p className="text-xs text-gray-400">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <button
              onClick={fetchOrders}
              className="bg-green-700 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-green-800"
            >
              🔄 Refresh
            </button>
            <button
              onClick={() => { useAuthStore.getState().logoutRemote(); navigate("/login"); }}
              className="border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Summary stats */}
        <div className="max-w-7xl mx-auto px-4 pb-2 grid grid-cols-5 gap-2 text-center">
          {[
            { key: "all", label: "All", emoji: "📋", color: "text-gray-700" },
            { key: "pending", label: "New", emoji: "🆕", color: "text-yellow-700" },
            { key: "preparing", label: "Preparing", emoji: "👨‍🍳", color: "text-blue-700" },
            { key: "out_for_delivery", label: "On Way", emoji: "🛵", color: "text-purple-700" },
            { key: "delivered", label: "Delivered", emoji: "✅", color: "text-green-700" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                filter === tab.key
                  ? "bg-green-700 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <div className="text-lg">{tab.emoji}</div>
              <div>{tab.label}</div>
              <div className={`text-lg font-extrabold ${filter === tab.key ? "text-white" : tab.color}`}>
                {counts[tab.key]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* New order alert */}
      {counts.pending > 0 && (
        <div className="bg-yellow-400 text-yellow-900 text-center py-2 px-4 font-bold text-sm animate-pulse">
          🔔 {counts.pending} new order{counts.pending > 1 ? "s" : ""} waiting to be accepted!
        </div>
      )}

      {/* Orders grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">
              {filter === "pending" ? "🎉" : "📭"}
            </div>
            <p className="text-xl font-semibold text-gray-700">
              {filter === "pending" ? "All caught up!" : "No orders here"}
            </p>
            <p className="text-gray-400 mt-2">
              {filter === "pending"
                ? "No new orders waiting."
                : "Nothing to show for this filter."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map(order => (
              <div
                key={order._id}
                className={`bg-white rounded-2xl shadow-sm border-2 transition-all hover:shadow-md ${
                  order.status === "pending"
                    ? "border-yellow-400 shadow-yellow-100"
                    : "border-gray-100"
                }`}
              >
                {/* Order ID + Status */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-sm font-bold text-gray-500">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>

                  {/* Customer info */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{order.customer.name}</p>
                      
                        href={`tel:${order.customer.phone}`}
                        className="text-sm text-blue-600 hover:underline font-medium"
                      >
                        📞 {order.customer.phone}
                      </a>
                      {order.customer.address && (
                        <p className="text-xs text-gray-500 mt-1">
                          📍 {order.customer.address}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-green-700">
                        KES {order.total.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-400 capitalize mt-1">
                        💳 {order.paymentMethod}
                      </p>
                      {order.mpesaCode && (
                        <p className="text-xs text-green-600 font-mono font-bold">
                          {order.mpesaCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order items */}
                <div className="p-4 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Order Items
                  </p>
                  <div className="space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full">
                            x{item.qty}
                          </span>
                          <span className="text-sm text-gray-700 font-medium">
                            {item.menuItemId?.name || "Unknown Item"}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 font-medium">
                          KES {(item.price * item.qty).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Time */}
                <div className="px-4 py-2 flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    🕐 {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {Math.round((Date.now() - new Date(order.createdAt)) / 60000)} min ago
                  </p>
                </div>

                {/* Action buttons */}
                <div className="p-4 pt-2 flex gap-2">
                  {NEXT_ACTION[order.status] ? (
                    <>
                      <button
                        onClick={() => updateStatus(order._id, NEXT_ACTION[order.status].next)}
                        disabled={updating === order._id}
                        className="flex-1 bg-green-700 text-white py-2.5 px-4 rounded-xl text-sm font-bold hover:bg-green-800 disabled:opacity-50 transition-all"
                      >
                        {updating === order._id ? "⏳ Updating..." : NEXT_ACTION[order.status].label}
                      </button>
                      {order.status === "pending" && (
                        <button
                          onClick={() => rejectOrder(order._id)}
                          disabled={updating === order._id}
                          className="px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 border-2 border-red-200 hover:bg-red-50 disabled:opacity-50 transition-all"
                        >
                          ✕ Reject
                        </button>
                      )}
                    </>
                  ) : (
                    <div className="flex-1 bg-gray-100 text-gray-500 py-2.5 px-4 rounded-xl text-sm font-bold text-center">
                      ✅ Order Complete
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}