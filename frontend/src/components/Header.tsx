import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Header.scss";

export default function Header() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header__logo">
        Food<span>Order</span>
      </div>

      <nav className="header__nav">
        <NavLink to="/" end>
          Меню
        </NavLink>
        <NavLink to="/cart">
          Кошик
        </NavLink>
        <NavLink to="/my-orders">
          Мої замовлення
        </NavLink>
      </nav>

      <div className="header__actions">
        {isAdmin && (
          <button onClick={handleLogout} className="logout-btn">
            Вийти
          </button>
        )}
        <NavLink to={isAdmin ? "/admin" : "/login"} className="login-btn">
          Адмін
        </NavLink>
      </div>
    </header>
  );
}
