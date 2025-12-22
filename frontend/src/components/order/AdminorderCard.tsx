import type { Order, MenuItem } from "../../services/api";
import { BaseOrderCard } from "./BaseOrderCard";

interface Props {
  order: Order;
  menuLookup: Record<string, MenuItem>;
  onStatusChange: (id: string, status: Order["status"]) => void;
  formattedDate: string;
}

export const AdminOrderCard = ({
  order,
  menuLookup,
  onStatusChange,
  formattedDate,
}: Props) => {
  return (
    <BaseOrderCard
      order={order}
      menuLookup={menuLookup}
      headerExtra={
        <span className="order-date">{formattedDate}</span>
      }
      footer={
        <div className="status-control">
          <span className="status-label">Статус замовлення:</span>
          <select
            value={order.status}
            onChange={(e) =>
              onStatusChange(order._id!, e.target.value as Order["status"])
            }
            className={`status-select ${order.status}`}
          >
            <option value="new">Нове</option>
            <option value="in_progress">В обробці</option>
            <option value="done">Виконано</option>
          </select>
        </div>
      }
    />
  );
};
