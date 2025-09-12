import { useState, useEffect } from "react";
import { getOrdersByPhone, type Order, type MenuItem } from "../services/api";
import "./myOrders.scss";

export const MyOrdersPage = () => {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    try {
      const data = await getOrdersByPhone(phone);
      setOrders(data);
    } catch (err) {
      console.error("Помилка при завантаженні замовлень", err);
    } finally {
      setLoading(false);
    }
  };

  // автооновлення замовлень кожні 10 сек
  useEffect(() => {
    if (!phone) return;
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [phone]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Мої замовлення</h2>

      {/* форма пошуку */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Введіть номер телефону"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border rounded p-4 bg-white shadow">
              <h3 className="font-bold">
                Замовлення від {new Date(order._id?.toString().substring(0, 8) ?? "").toLocaleString()}
              </h3>
              <p>
                Ім’я: {order.customerName} | Телефон: {order.customerPhone}
              </p>
              <ul className="mt-2 list-disc list-inside text-sm">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {typeof item.menuId === "string"
                      ? item.menuId
                      : (item.menuId as MenuItem).name}{" "}
                    × {item.quantity}
                  </li>
                ))}
              </ul>
              <p className="mt-2">
                <strong>Статус:</strong>{" "}
                <span className="capitalize">{order.status}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

