import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { changeOrderStatus, getOrders } from "@/features/orders/api";
import { getErrorMessage } from "@/utils/getErrorMessage";

const statusColors = {
  Pending: "orange",
  Confirmed: "blue",
  Shipped: "purple",
  Delivered: "green",
  Cancelled: "red",
};

const tabs = [
  "all",
  "Pending",
  "Confirmed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function OrdersPage() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 5,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const body = await getOrders({
          page,
          per_page: 5,
          ...(status !== "all" && { status }),
        });
        if (ignore) return;
        setItems(body.data?.orders || []);
        setPagination(
          body.data?.pagination || { current_page: 1, per_page: 5, total: 0 },
        );
      } catch (err) {
        if (!ignore) setError(getErrorMessage(err));
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [page, status, reloadKey]);

  const handleTabChange = (newStatus) => {
    setStatus(newStatus);
    setPage(1);
  };

  const handleChangeStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await changeOrderStatus(id, newStatus);
      message.success(`Order #${id} is now ${newStatus}`);
      setReloadKey((k) => k + 1);
    } catch (err) {
      message.error(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 70 },
    { title: "User ID", dataIndex: "user_id" },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      render: (amount) => Number(amount).toFixed(2),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (value) => (
        <Tag color={statusColors[value] || "default"}>{value}</Tag>
      ),
    },
    {
      title: "Products",
      render: (_, record) => record.items?.length || 0,
    },
    {
      title: "Change status",
      render: (_, record) => {
        const next = record.allowed_next_statuses ?? [];

        if (next.length === 0) {
          return <Typography.Text type="secondary">-</Typography.Text>;
        }

        return (
          <Space wrap>
            {next.map((s) => (
              <Popconfirm
                key={s}
                title={`Change order #${record.id} to ${s}?`}
                okText="Yes"
                cancelText="No"
                onConfirm={() => handleChangeStatus(record.id, s)}
              >
                <Button
                  size="small"
                  type={s === "Cancelled" ? "default" : "primary"}
                  danger={s === "Cancelled"}
                  loading={updatingId === record.id}
                >
                  {s}
                </Button>
              </Popconfirm>
            ))}
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Typography.Title level={3} style={{ marginBottom: 4 }}>
        Orders
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        Browse orders and update their status.
      </Typography.Paragraph>

      <Space wrap style={{ marginBottom: 20 }}>
        {tabs.map((tab) => (
          <Button
            key={tab}
            shape="round"
            type={status === tab ? "primary" : "default"}
            onClick={() => handleTabChange(tab)}
          >
            {tab === "all" ? "All" : tab}
          </Button>
        ))}
      </Space>

      {error && (
        <Alert
          type="error"
          showIcon
          title={error}
          style={{ marginBottom: 16 }}
        />
      )}

      <Card title="Orders List">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={items}
          columns={columns}
          scroll={{ x: true }}
          pagination={{
            current: pagination.current_page,
            pageSize: pagination.per_page,
            total: pagination.total,
            showSizeChanger: false,
            onChange: setPage,
          }}
        />
      </Card>
    </div>
  );
}
