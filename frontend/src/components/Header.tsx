import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Header.scss";

export default function Header() {
  const { token, logout } = useAuth();

  return (
    <header className="Header">
      <h1>☕ Кав'ярня Online</h1>
      <nav>
        <Link to="/">Меню</Link>
        <div></div>
        <Link to="/cart">Кошик</Link>
        <div></div>
        <Link to="/my-orders">Мої замовлення</Link>
        <div></div>
        {!token ? (
          <Link to="/login">Логін</Link>
        ) : (
          <>
            <Link to="/admin">Адмін панель</Link>
            <button onClick={logout} className="underline">
              Вийти
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

