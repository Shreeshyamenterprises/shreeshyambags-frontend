"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getToken } from "@/lib/auth";

function OrdersContent() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    try {
      const token = getToken();

      if (!token) {
        return;
      }

      const res = await api.get("/orders/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12">
        Loading orders...
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-zinc-600">You have not placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-100"
            >
              <div className="mb-4 flex justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Order ID</p>
                  <p className="font-medium">{order.id}</p>
                </div>

                <div>
                  <p className="text-sm text-zinc-500">Total</p>
                  <p className="font-semibold">
                    ₹{(order.total / 100).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.variant.product.title} — {item.variant.size} /{" "}
                      {item.variant.color}
                    </span>

                    <span>
                      {item.quantity} × ₹{(item.variant.price / 100).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function OrdersPage() {
  return (
    <AuthGuard>
      <OrdersContent />
    </AuthGuard>
  );
}
