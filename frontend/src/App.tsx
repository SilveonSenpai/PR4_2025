import { BrowserRouter, Routes, Route } from "react-router-dom";
import  Header  from "./components/Header";
import { MenuPage } from "./pages/MenuPage";
import { CartPage } from "./pages/CartPage";
import { AdminLoginPage } from "./pages/AdminLogin";
import { AdminPanelPage } from "./pages/AdminPanel";
import { AuthProvider } from "./context/authProvider";
import  ProtectedRoute  from "./components/ProtectedRoute";
import { MyOrdersPage } from "./pages/myOrders";
import "./App.scss";


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <main className="p-4">
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<AdminLoginPage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanelPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}

