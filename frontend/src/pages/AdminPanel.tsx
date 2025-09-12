import { useEffect, useState } from "react";
import {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  type MenuItem,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import { AdminOrders } from "./AdminOrders";
import "./AdminPanel.scss";

export const AdminPanelPage = () => {
  const { token } = useAuth();
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [activeTab, setActiveTab] = useState<"menu" | "orders">("menu");

  const [form, setForm] = useState<MenuItem>({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
  });

  const fetchMenu = async () => {
    if (!token) return;
    const data = await getMenu();
    setMenu(data);
  };

  useEffect(() => {
    fetchMenu();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (editingItem) {
      await updateMenuItem(editingItem._id!, form, token);
    } else {
      await createMenuItem(form, token);
    }

    setForm({ name: "", description: "", price: 0, imageUrl: "" });
    setEditingItem(null);
    fetchMenu();
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setForm(item);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    await deleteMenuItem(id, token);
    fetchMenu();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Адмін-панель</h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("menu")}
          className={`px-4 py-2 rounded ${
            activeTab === "menu" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Меню
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded ${
            activeTab === "orders" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Замовлення
        </button>
      </div>

      {activeTab === "menu" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">
              {editingItem ? "Редагувати товар" : "Додати новий товар"}
            </h2>
            <input
              type="text"
              placeholder="Назва"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mb-2 p-2 border rounded"
              required
            />
            <textarea
              placeholder="Опис"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Ціна"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
              className="w-full mb-2 p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="URL зображення"
              value={form.imageUrl}
              onChange={(e) =>
                setForm({ ...form, imageUrl: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editingItem ? "Оновити" : "Додати"}
            </button>
          </form>

          <div>
            <h2 className="text-lg font-semibold mb-2">Список товарів</h2>
            {menu.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-white shadow p-3 rounded mb-2"
              >
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">{item.price} грн</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Редагувати
                  </button>
                  <button
                    onClick={() => handleDelete(item._id!)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <AdminOrders />
      )}
    </div>
  );
};

