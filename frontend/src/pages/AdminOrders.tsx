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

export const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<Record<string, MenuItem>>({});
  const [loading, setLoading] = useState(true);

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
      console.error("Failed to fetch data:", error);
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
    try {
      await updateOrderStatus(id, status, token);
      fetchData();
    } catch (error) {
      console.error("Failed to update order status:", error);
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

  return (
    <div className="admin-orders">
      <h2>Управління замовленнями</h2>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>Замовлень поки немає ☕</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
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
