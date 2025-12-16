import { useEffect, useState } from "react";
import { getMenu } from "../services/api";
import type { MenuItem } from "../services/api";
import { useCart } from "../context/useCart";
import "./MenuPage.scss";
import { useToast } from "../context/useToast";

export const MenuPage = () => {
  const { showToast } = useToast();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart();

  useEffect(() => {
  const fetchMenu = async () => {
    try {
      const data = await getMenu();
      setMenu(data);
    } catch {
      showToast("Не вдалося завантажити меню", "error");
      setError("Помилка завантаження");
    } finally {
      setLoading(false);
    }
  };

  fetchMenu();
}, [showToast]);


  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="loader"></div>
      </div>
    );

  if (error)
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );

  return (
    <div className="menu-page">
      <div className="menu-grid">
        {menu.map((item) => (
          <div key={item._id} className="menu-item">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="item-image"
            />
            <div className="item-content">
              <h2 className="item-title">{item.name}</h2>
              <p className="item-description">{item.description}</p>
              <div className="item-footer">
                <span className="price">{item.price} грн</span>
                <button
                  onClick={() => addToCart(item)}
                  className="add-to-cart"
                  aria-label={`Add ${item.name} to cart`}
                >
                  Додати до кошика
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

