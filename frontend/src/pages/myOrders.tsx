import { useState, useEffect, useCallback } from "react";
import { getOrdersByPhone, type Order } from "../services/api";
import "./myOrders.scss";
import { normalizePhone, isValidUAPhone, formatPhoneDisplay } from "../utils/phone";
import { UserOrderCard } from "../components/order/UserOrderCard";
import { logger } from "../utils/logger";

export const MyOrdersPage = () => {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = useCallback(async () => {
    if (!phone.trim()) return;
    setLoading(true);
    try {
      const data = await getOrdersByPhone(phone);
      setOrders(data);
    } catch (err) {
      logger.error("Помилка при завантаженні замовлень", err);
      if (!isValidUAPhone(phone)) {
        logger.warn("Некоректний номер телефону");
        return;
      }

    } finally {
      setLoading(false);
    }
  }, [phone]);


  // автооновлення замовлень кожні 10 сек
  useEffect(() => {
    if (!phone) return;
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [phone, fetchOrders]);


  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Мої замовлення</h2>

      {/* форма пошуку */}
      <div className="mb-4 flex gap-2">
        <input
          type="tel"
          placeholder="+380 XX XXX XX XX"
          value={formatPhoneDisplay(phone)}
          onChange={(e) => setPhone(normalizePhone(e.target.value))}
          className="border rounded px-3 py-2 flex-1"
        />

        <button
          onClick={fetchOrders}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Пошук
        </button>
      </div>

      {loading && <p>Завантаження...</p>}

      {/* список замовлень */}
      {orders.length === 0 && !loading ? (
        <p>Немає замовлень для цього номера ☕</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <UserOrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

