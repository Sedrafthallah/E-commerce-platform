import { useState } from "react";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { login } from "@/features/auth/api";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { TOKEN_KEY } from "@/constants/storage";
import { colors } from "@/theme/colors";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFinish = async (values) => {
    setError("");
    setLoading(true);
    try {
      const body = await login(values);
      const { access_token, user } = body.data;

      // Dashboard is for the Responsible role only
      if (user.role !== "Responsible") {
        setError("This account is not allowed to access the dashboard");
        return;
      }

      localStorage.setItem(TOKEN_KEY, access_token);
  navigate("/dashboard", { replace: true });
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) setError("Incorrect email or password");
      else if (status === 429)
        setError("Too many attempts, please try again shortly");
      else setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="ltr"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 16,
        background: `linear-gradient(160deg, ${colors.gradientStart}, ${colors.gradientMiddle} 55%, ${colors.gradientEnd})`,
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 20,
          border: `1px solid ${colors.border}`,
          boxShadow: `0 12px 40px ${colors.primaryShadow}`,
        }}
        styles={{ body: { padding: 32 } }}
      >
        <Typography.Title
          level={2}
          style={{ textAlign: "center", marginBottom: 4, color: colors.textPrimary }}
        >
          Sign in
        </Typography.Title>
        <Typography.Paragraph
          style={{ textAlign: "center", marginBottom: 28, color: colors.textSecondary }}
        >
          Welcome back, sign in to continue
        </Typography.Paragraph>

        {error && (
          <Alert type="error" showIcon message={error} style={{ marginBottom: 20 }} />
        )}

        <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input
              size="large"
              autoComplete="email"
              placeholder="name@example.com"
              prefix={<MailOutlined style={{ color: colors.prefixIcon }} />}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password
              size="large"
              autoComplete="current-password"
              prefix={<LockOutlined style={{ color: colors.prefixIcon }} />}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            style={{
              height: 48,
              marginTop: 8,
              fontWeight: 600,
              boxShadow: `0 8px 20px ${colors.buttonShadow}`,
            }}
          >
            Sign in
          </Button>
        </Form>
      </Card>
    </div>
  );
}