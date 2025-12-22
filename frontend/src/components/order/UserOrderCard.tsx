import type { Order } from "../../services/api";
import { BaseOrderCard } from "./BaseOrderCard";

export const UserOrderCard = ({ order }: { order: Order }) => {
  return (
    <BaseOrderCard
      order={order}
      footer={
        <div className="order-status">
          Статус: <strong>{order.status}</strong>
        </div>
      }
    />
  );
};
