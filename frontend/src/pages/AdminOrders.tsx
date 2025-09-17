import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus, getMenu, type Order, type MenuItem } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./AdminOrders.scss";

export const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<Record<string, MenuItem>>({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [ordersData, menuData] = await Promise.all([
        getOrders(token),
        getMenu()
      ]);
      
      // Create a lookup object for menu items
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
  };

  useEffect(() => {
    fetchData();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const handleStatusChange = async (id: string, status: Order["status"]) => {
    if (!token) return;
    try {
      await updateOrderStatus(id, status!, token);
      fetchData();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const formatDate = (orderId: string) => {
    try {
      // Convert hex timestamp to decimal and multiply by 1000 for milliseconds
      const timestamp = parseInt(orderId.substring(0, 8), 16) * 1000;
      return new Date(timestamp).toLocaleString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Дата невідома';
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
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="customer-info">
                  <h3>{order.customerName}</h3>
                  <span className="phone">{order.customerPhone}</span>
                </div>
                <span className="order-date">
                  {formatDate(order._id!)}
                </span>
              </div>

              <ul className="items-list">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    <span>{menuItems[String(item.menuId)]?.name || 'Товар видалено'}</span>
                    <span>× {item.quantity}</span>
                  </li>
                ))}
              </ul>

              <div className="status-control">
                <span className="status-label">Статус замовлення:</span>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(
                      order._id!,
                      e.target.value as Order["status"]
                    )
                  }
                  className={order.status}
                >
                  <option value="new">Нове</option>
                  <option value="in_progress">В обробці</option>
                  <option value="done">Виконано</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

