import axios from "axios";

// Базовий інстанс
const api = axios.create({
  baseURL: "http://localhost:4000/api", // ⚠️ заміни на свій бекенд, якщо інший порт
  headers: {
    "Content-Type": "application/json",
  },
});

// Типи
export interface MenuItem {
  _id?: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface Order {
  _id?: string;
  items: {
    menuId: string | MenuItem; 
    quantity: number;
  }[];
  customerName: string;
  customerPhone: string;
  status?: "new" | "in_progress" | "done";
}




export interface LoginResponse {
  token: string;
}

// Запити
export const getMenu = async (): Promise<MenuItem[]> => {
  const res = await api.get("/menu");
  return res.data;
};

export const createMenuItem = async (item: MenuItem, token: string) => {
  const res = await api.post("/menu", item, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateMenuItem = async (
  id: string,
  item: Partial<MenuItem>,
  token: string
) => {
  const res = await api.put(`/menu/${id}`, item, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteMenuItem = async (id: string, token: string) => {
  const res = await api.delete(`/menu/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createOrder = async (order: Order) => {
  const res = await api.post("/orders", order);
  return res.data;
};

export const getOrders = async (token: string): Promise<Order[]> => {
  const res = await api.get("/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateOrderStatus = async (
  id: string,
  status: "new" | "in_progress" | "done",
  token: string
) => {
  const res = await api.patch(
    `/orders/${id}/status`,
    { status },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

export const getOrdersByPhone = async (phone: string): Promise<Order[]> => {
  const res = await api.get(`/orders/by-phone/${phone}`);
  return res.data;
};

export const loginAdmin = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};
