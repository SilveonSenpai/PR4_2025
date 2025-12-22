import type { Order } from "../../services/api";
import { BaseOrderCard } from "./BaseOrderCard";
import { formatOrderDate } from "../../utils/orderdate";

export const UserOrderCard = ({ order }: { order: Order }) => {
  return (
    <BaseOrderCard
      order={order}
      headerExtra={
        <span className="order-date">
          {formatOrderDate(order._id)}
        </span>
      }
      footer={
        <div className="order-status">
          Статус: <strong>{order.status}</strong>
        </div>
      }
    />
  );
};