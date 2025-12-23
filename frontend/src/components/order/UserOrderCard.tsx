import type { Order } from "../../services/api";
import { BaseOrderCard } from "./BaseOrderCard";
import { formatOrderDate } from "../../utils/orderdate";

const getStatusText = (status: string | undefined): string => {
  if (!status) return 'Невідомо';
  
  const statusMap: Record<string, string> = {
    'new': 'Нове',
    'in_progress': 'Готується',
    'done': 'Виконано',
  };
  
  return statusMap[status.toLowerCase()] || status;
}; //не питайте чому воно відрізняєється від admin версії. Просто так треба (:

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
          Статус: <strong>{getStatusText(order.status)}</strong>
        </div>
      }
    />
  );
};