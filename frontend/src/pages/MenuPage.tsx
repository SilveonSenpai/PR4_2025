import { useEffect, useState } from "react";
import { getMenu } from "../services/api";
import type { MenuItem } from "../services/api";
import { useCart } from "../context/CartContext";
import "./MenuPage.scss";

export const MenuPage = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenu();
        setMenu(data);
      } catch (err) {
        setError("Не вдалося завантажити меню ☹️");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) return <p className="p-4">Завантаження...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {menu.map((item) => (
        <div
          key={item._id}
          className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col"
        >
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-40 w-full object-cover"
          />
          <div className="p-4 flex flex-col flex-grow">
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-gray-600 text-sm flex-grow">{item.description}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xl font-bold">{item.price} грн</span>
              <button
                onClick={() => addToCart(item)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Додати
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

