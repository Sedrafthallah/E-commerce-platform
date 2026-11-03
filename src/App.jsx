import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "@/pages/Login/LoginPage";
import MainLayout from "@/layouts/MainLayout";
import OverviewPage from "@/pages/Overview/OverviewPage";
import ProductsPage from "@/pages/Products/ProductsPage";
import OrdersPage from "@/pages/Orders/OrdersPage";
import UsersPage from "@/pages/Users/UsersPage";
import NotificationsPage from "@/pages/Notifications/NotificationsPage";

export default function App() {
  return (
    <Routes>
      {/* صفحة بدون إطار */}
      <Route path="/login" element={<LoginPage />} />

      {/* صفحات داخل إطار الداشبورد */}
      <Route path="/dashboard" element={<MainLayout />}>
        <Route index element={<OverviewPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}