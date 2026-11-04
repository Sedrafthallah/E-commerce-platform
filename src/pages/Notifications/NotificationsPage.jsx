import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Card,
  Empty,
  List,
  Pagination,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";

import { BellOutlined, ShoppingCartOutlined } from "@ant-design/icons";

import { getNotifications } from "@/features/notifications/api";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { colors } from "@/theme/colors";

const { Title, Text, Paragraph } = Typography;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const body = await getNotifications({
        page,
        per_page: 20,
      });

      setNotifications(body.data?.notifications ?? []);
      setPagination(body.data?.pagination ?? null);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications(1);
  }, [loadNotifications]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Notifications
          </Title>
          <Text type="secondary">
            Stay updated with your latest notifications
          </Text>
        </div>
      </div>

      {/* Summary */}
      <Card
        style={{
          borderRadius: 14,
          marginBottom: 24,
          border: `1px solid ${colors.border}`,
        }}
      >
        <Space size="large">
          <BellOutlined style={{ fontSize: 30, color: colors.primary }} />

          <div>
            <Text type="secondary">Total Notifications</Text>
            <Title level={3} style={{ margin: 0 }}>
              {pagination.total}
            </Title>
          </div>
        </Space>
      </Card>

      {/* Notifications List */}
      <Card
        title="Recent Notifications"
        style={{
          borderRadius: 14,
          border: `1px solid ${colors.border}`,
        }}
      >
        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : notifications.length === 0 ? (
          <Empty description="No notifications found" />
        ) : (
          <>
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item
                  style={{
                    padding: "20px 12px",
                    background: item.read_at
                      ? "transparent"
                      : colors.gradientStart,
                    borderRadius: 10,
                    marginBottom: 8,
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          background: "#EEE8FA",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <ShoppingCartOutlined
                          style={{
                            fontSize: 20,
                            color: colors.primary,
                          }}
                        />
                      </div>
                    }
                    title={
                      <Space wrap>
                        <Text strong>{item.title}</Text>

                        {!item.read_at && <Tag color="purple">New</Tag>}
                      </Space>
                    }
                    description={
                      <div>
                        <Paragraph
                          style={{
                            margin: "6px 0",
                            color: colors.textSecondary,
                          }}
                        >
                          {item.body}
                        </Paragraph>

                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatDate(item.created_at)}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />

            {pagination.last_page > 1 && (
              <div style={{ display: "flex", justifyContent: "end" }}>
                <Pagination
                  current={pagination.current_page}
                  total={pagination.total}
                  pageSize={pagination.per_page}
                  onChange={(page) => loadNotifications(page)}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
