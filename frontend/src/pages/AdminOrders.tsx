import { useEffect, useState, useCallback } from "react";
import {
  getOrders,
  updateOrderStatus,
  getMenu,
  type Order,
  type MenuItem,
} from "../services/api";
import { useAuth } from "../context/useAuth";
import { AdminOrderCard } from "../components/order/AdminorderCard";
import "./AdminOrders.scss";
import { logger } from "../utils/logger";

export const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<Record<string, MenuItem>>({});
  const [loading, setLoading] = useState(true);
  const STATUS_PRIORITY: Record<NonNullable<Order["status"]>, number> = {
    new: 0,
    in_progress: 1,
    done: 2,
  };
  const [showArchived, setShowArchived] = useState(false);


  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [ordersData, menuData] = await Promise.all([
        getOrders(token),
        getMenu(),
      ]);

      const menuLookup = menuData.reduce((acc, item) => {
        acc[item._id!] = item;
        return acc;
      }, {} as Record<string, MenuItem>);

      setOrders(ordersData);
      setMenuItems(menuLookup);
    } catch (error) {
      logger.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleStatusChange = async (id: string, status: Order["status"]) => {
    if (!token || !status) return;

    // 1️⃣ optimistic update
    setOrders((prev) =>
      prev.map((order) =>
        order._id === id ? { ...order, status } : order
      )
    );

    try {
      await updateOrderStatus(id, status, token);
    } catch (error) {
      logger.error("Failed to update order status:", error);

      // 2️⃣ rollback у разі помилки
      fetchData();
    }
  };

  const formatDate = (orderId: string) => {
    try {
      const timestamp = parseInt(orderId.substring(0, 8), 16) * 1000;
      return new Date(timestamp).toLocaleString("uk-UA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Дата невідома";
    }
  };

  if (loading) {
    return <div className="loading">Завантаження...</div>;
  }
const visibleOrders = showArchived
  ? orders
  : orders.filter((order) => order.status !== "done");

  const sortedOrders = [...visibleOrders].sort((a, b) => {
  const aPriority = STATUS_PRIORITY[a.status ?? "new"];
  const bPriority = STATUS_PRIORITY[b.status ?? "new"];

  if (aPriority !== bPriority) {
    return aPriority - bPriority;
  }

  if (a._id && b._id) {
    return b._id.localeCompare(a._id);
  }

  return 0;
});


  return (
    <div className="admin-orders">
      <h2>Управління замовленнями</h2>
<label className="archive-toggle">
  <input
    type="checkbox"
    checked={showArchived}
    onChange={(e) => setShowArchived(e.target.checked)}
  />
  Показати виконані замовлення
</label>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>Замовлень поки немає ☕</p>
        </div>

      ) : (
        <div className="orders-list">
          {sortedOrders.map((order) => (
            <AdminOrderCard
              key={order._id}
              order={order}
              menuLookup={menuItems}
              formattedDate={formatDate(order._id!)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};
