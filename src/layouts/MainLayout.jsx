import { Button, Layout, Menu, Typography } from "antd";
import {
  
  BellOutlined,
  DashboardOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TOKEN_KEY } from "@/constants/storage";
import { logout } from "@/features/auth/api";

const { Sider, Header, Content } = Layout;

const items = [
  { key: "/dashboard", icon: <DashboardOutlined />, label: "Overview" },
  { key: "/dashboard/products", icon: <ShoppingOutlined />, label: "Products" },
 
  { key: "/dashboard/orders", icon: <ShoppingCartOutlined />, label: "Orders" },
 
  {
    key: "/dashboard/notifications",
    icon: <BellOutlined />,
    label: "Notifications",
  },
];

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = location.pathname.startsWith("/dashboard/products/")
    ? "/dashboard/products"
    : location.pathname;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      navigate("/login", { replace: true });
    }
  };

  return (
    <Layout className="admin-layout">
      <Sider
        width={250}
        breakpoint="lg"
        collapsedWidth={0}
        className="admin-sidebar"
      >
        <div className="sidebar-brand">
          <ShoppingCartOutlined className="sidebar-brand-icon" />
          <Typography.Title level={4}>Admin Panel</Typography.Title>
        </div>

        <Menu
          className="admin-sidebar-menu"
          mode="inline"
          theme="dark"
          items={items}
          selectedKeys={[selectedKey]}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout className="admin-main-layout">
        <Header className="admin-header">
          <Typography.Text className="admin-user">Admin</Typography.Text>

          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="admin-logout"
          >
            Logout
          </Button>
        </Header>

        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}