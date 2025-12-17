import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/api";
import { useAuth } from "../context/useAuth";
import "./AdminLogin.scss";
import { useToast } from "../context/useToast";

export const AdminLoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { token } = await loginAdmin(email, password);
      login(token);
      showToast("Успішний вхід", "success");
      navigate("/admin");
    } catch {
      showToast("Невірний email або пароль", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          Вхід адміністратора
        </h1>

        <input
          type="email"
          disabled={loading}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="password"
          disabled={loading}
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Вхід..." : "Увійти"}
        </button>

      </form>
    </div>
  );
};
