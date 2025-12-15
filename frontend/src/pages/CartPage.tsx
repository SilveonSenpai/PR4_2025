import { useState } from "react";
import { useCart } from "../context/useCart";
import { createOrder } from "../services/api";
import { Link } from "react-router-dom";
import "./CartPage.scss";

export const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const total = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

  const handleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    if (!formData.name.trim() || !formData.phone.trim()) {
      setMessage("Будь ласка, заповніть усі поля!");
      return;
    }
    if (cart.length === 0) {
      setMessage("Ваш кошик порожній!");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customerName: formData.name,
        customerPhone: formData.phone,
        items: cart.map((ci) => ({
          menuId: ci.menuItem._id!,
          quantity: ci.quantity,
        })),
        status: "new" as const,
      };

      const response = await createOrder(payload);

      if (!response) {
        throw new Error("Failed to create order");
      }

      setMessage("✅ Замовлення успішно оформлене!");
      clearCart();
      setFormData({ name: "", phone: "" });
    } catch (err) {
      console.error("Order creation error:", err);
      setMessage("❌ Помилка при оформленні замовлення.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <p>Ваш кошик порожній</p>
          <Link to="/" className="return-btn">
            Повернутися до меню
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Кошик</h1>
      </div>

      <div className="cart-items">
        {cart.map((item) => (
          <div key={item.menuItem._id} className="cart-item">
            <img src={item.menuItem.imageUrl} alt={item.menuItem.name} />

            <div className="item-details">
              <h3>{item.menuItem.name}</h3>
              <span className="price">{item.menuItem.price} грн</span>
            </div>

            <div className="quantity-controls">
              <button
                onClick={() =>
                  updateQuantity(item.menuItem._id!, Math.max(0, item.quantity - 1))
                }
                aria-label="Зменшити кількість"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.menuItem._id!, item.quantity + 1)}
                aria-label="Збільшити кількість"
              >
                +
              </button>
            </div>

            <button
              className="remove-btn"
              onClick={() => removeFromCart(item.menuItem._id!)}
              aria-label={`Видалити ${item.menuItem.name} з кошика`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="total">
          <span>Загальна сума:</span>
          <span>{total} грн</span>
        </div>

        <form onSubmit={handleOrder} className="checkout-form">
          <input
            type="text"
            placeholder="Ваше ім'я"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
          <input
            type="tel"
            placeholder="Номер телефону"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Обробка..." : "Оформити замовлення"}
          </button>
        </form>
      </div>
    </div>
  );
};
