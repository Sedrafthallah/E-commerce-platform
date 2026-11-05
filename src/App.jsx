import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "@/pages/Login/LoginPage";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import ProductsPage from "@/pages/Products/ProductsPage";
import CategoriesPage from "@/pages/Categories/CategoriesPage";
import OrdersPage from "@/pages/Orders/OrdersPage";
import UsersPage from "@/pages/Users/UsersPage";
import NotificationsPage from "@/pages/Notifications/NotificationsPage";
import ProductDetailsPage from "@/pages/Products/ProductDetailsPage";
import AddProductPage from "@/pages/Products/AddProductPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<ProductsPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/add" element={<AddProductPage />} />
          <Route path="products/:id" element={<ProductDetailsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
