import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus, type Order } from "../services/api";
import { useAuth } from "../context/AuthContext";

export const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    if (!token) return;
    const data = await getOrders(token);
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const handleStatusChange = async (id: string, status: Order["status"]) => {
    if (!token) return;
    await updateOrderStatus(id, status!, token);
    fetchOrders();
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Список замовлень</h2>
      {orders.length === 0 ? (
        <p>Замовлень поки немає ☕</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow rounded p-4 flex flex-col"
            >
              <h3 className="font-bold">{order.customerName}</h3>
              <p className="text-gray-600">{order.customerPhone}</p>

              <ul className="mt-2 list-disc list-inside text-sm">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    Товар ID: {item.menuId} × {item.quantity}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center justify-between">
                <span className="font-semibold">
                  Статус:{" "}
                  <span className="capitalize">
                    {order.status || "new"}
                  </span>
                </span>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(
                      order._id!,
                      e.target.value as Order["status"]
                    )
                  }
                  className="border rounded px-2 py-1"
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

