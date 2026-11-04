import { Button, Layout, Menu, Typography } from "antd";
import {
  BellOutlined,
  DashboardOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { logout } from "../features/auth/api";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TOKEN_KEY } from "@/constants/storage";
import { colors } from "@/theme/colors";

const { Sider, Header, Content } = Layout;

const items = [
  { key: "/dashboard", icon: <DashboardOutlined />, label: "Overview" },
  { key: "/dashboard/products", icon: <ShoppingOutlined />, label: "Products" },
  { key: "/dashboard/orders", icon: <ShoppingCartOutlined />, label: "Orders" },
  { key: "/dashboard/users", icon: <TeamOutlined />, label: "Users" },
  {
    key: "/dashboard/notifications",
    icon: <BellOutlined />,
    label: "Notifications",
  },
];

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

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
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={230}
        breakpoint="lg"
        collapsedWidth={0}
        theme="light"
        style={{ borderInlineEnd: `1px solid ${colors.border}` }}
      >
        <div style={{ padding: "20px 24px" }}>
          <Typography.Title
            level={4}
            style={{ margin: 0, color: colors.primary }}
          >
            Admin Panel
          </Typography.Title>
        </div>

        <Menu
          mode="inline"
          items={items}
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          style={{ borderInlineEnd: "none" }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            borderBottom: `1px solid ${colors.border}`,
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 12,
          }}
        >
          <Typography.Text style={{ color: colors.textSecondary }}>
            Admin
          </Typography.Text>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </Header>

        <Content style={{ padding: 24, background: colors.gradientMiddle }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
