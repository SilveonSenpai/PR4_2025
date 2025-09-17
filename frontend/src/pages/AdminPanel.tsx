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
  const [loading, setLoading] = useState(false);

  const initialForm = {
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
  };

  const [form, setForm] = useState<MenuItem>(initialForm);

  const fetchMenu = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getMenu();
      setMenu(data);
    } catch (error) {
      console.error("Failed to fetch menu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setLoading(true);

    try {
      if (editingItem) {
        await updateMenuItem(editingItem._id!, form, token);
      } else {
        await createMenuItem(form, token);
      }
      setForm(initialForm);
      setEditingItem(null);
      await fetchMenu();
    } catch (error) {
      console.error("Failed to save item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setForm(item);
  };

  const handleDelete = async (id: string) => {
    if (!token || !window.confirm("Видалити цей товар?")) return;
    setLoading(true);
    try {
      await deleteMenuItem(id, token);
      await fetchMenu();
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setForm(initialForm);
  };

  return (
    <div className="admin-panel">
      <div className="panel-header">
        <h1>Адмін-панель</h1>
        <div className="tabs">
          <button
            onClick={() => setActiveTab("menu")}
            className={activeTab === "menu" ? "active" : ""}
          >
            Управління меню
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={activeTab === "orders" ? "active" : ""}
          >
            Замовлення
          </button>
        </div>
      </div>

      {activeTab === "menu" ? (
        <div className="menu-section">
          <div className="item-form">
            <h3>{editingItem ? "Редагувати товар" : "Додати новий товар"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Назва</label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Опис</label>
                <textarea
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Ціна</label>
                <input
                  id="price"
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="image">URL зображення</label>
                <input
                  id="image"
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Збереження..." : editingItem ? "Оновити" : "Додати"}
                </button>
                {editingItem && (
                  <button
                    type="button"
                    className="cancel"
                    onClick={handleCancel}
                  >
                    Скасувати
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="menu-items">
            <div className="menu-header">
              <h3>Список товарів</h3>
            </div>
            <div className="menu-grid">
              {menu.map((item) => (
                <div key={item._id} className="menu-item">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="item-image"
                  />
                  <div className="item-content">
                    <h4>{item.name}</h4>
                    <p>{item.description}</p>
                    <span className="price">{item.price} грн</span>
                  </div>
                  <div className="item-actions">
                    <button className="edit" onClick={() => handleEdit(item)}>
                      Редагувати
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDelete(item._id!)}
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <AdminOrders />
      )}
    </div>
  );
};

