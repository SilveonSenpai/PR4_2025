import { useState } from "react";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";
import "./CartPage.scss";

export const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.menuItem.price * item.quantity,
    0
  );

const handleOrder = async () => {
  if (!name.trim() || !contact.trim()) {
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
      customerName: name,
      customerPhone: contact,
      items: cart.map((ci) => ({
        menuId: ci.menuItem._id!, // ⚠️ бекенд хоче menuId
        quantity: ci.quantity,
      })),
    };

    await createOrder(payload);
    setMessage("✅ Замовлення успішно оформлене!");
    clearCart();
    setName("");
    setContact("");
  } catch (err) {
    console.error(err);
    setMessage("❌ Помилка при оформленні замовлення.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ваш кошик</h1>

      {cart.length === 0 ? (
        <p>Кошик порожній ☹️</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.menuItem._id}
              className="flex items-center justify-between bg-white shadow-md p-4 rounded-lg"
            >
              <div>
                <h2 className="font-semibold">{item.menuItem.name}</h2>
                <p className="text-gray-600">{item.menuItem.price} грн</p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateQuantity(item.menuItem._id!, Number(e.target.value))
                  }
                  className="w-16 border rounded text-center"
                />
                <button
                  onClick={() => removeFromCart(item.menuItem._id!)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Видалити
                </button>
              </div>
            </div>
          ))}

          <div className="text-right text-xl font-bold">
            Всього: {total} грн
          </div>
        </div>
      )}

      {/* Форма замовлення */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-inner">
        <h2 className="text-lg font-semibold mb-2">Оформлення замовлення</h2>
        <input
          type="text"
          placeholder="Ваше ім’я"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Телефон або email"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <button
          onClick={handleOrder}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Відправка..." : "Оформити замовлення"}
        </button>
        {message && (
          <p className="mt-2 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
};
