import type { Order, MenuItem } from "../../services/api";

interface Props {
  order: Order;
  menuLookup?: Record<string, MenuItem>;
  headerExtra?: React.ReactNode;
  footer?: React.ReactNode;
}

export const BaseOrderCard = ({ order, menuLookup, headerExtra, footer }: Props) => {
  return (
    <div className={`order-card status-${order.status}`}>
      <div className="order-header">
        <div>
          <h3>{order.customerName}</h3>
          <span>{order.customerPhone}</span>
        </div>
        {headerExtra}
      </div>

      <ul className="items-list">
        {order.items.map((item, idx) => (
          <li key={idx}>
            <span>
              {menuLookup
                ? menuLookup[String(item.menuId)]?.name || "Товар видалено"
                : typeof item.menuId === "string"
                  ? item.menuId
                  : (item.menuId as MenuItem).name}
            </span>
            <span>× {item.quantity}</span>
          </li>
        ))}
      </ul>

      {footer}
    </div>
  );
};