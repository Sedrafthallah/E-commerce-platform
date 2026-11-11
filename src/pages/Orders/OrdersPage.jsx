
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

  const [pagination, setPagination] = useState({
    per_page: 5,
    has_more_pages: false,
    next_cursor: null,
  });

  // حفظ الـ Cursors للتنقل بين الصفحات
  const [cursors, setCursors] = useState([null]);
  const cursor = cursors[cursors.length - 1];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [updatingId, setUpdatingId] = useState(null);

  // Load orders when cursor, status, or reloadKey changes
  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const body = await getOrders({
          per_page: 5,
          ...(cursor && { cursor }),
          ...(status !== "all" && { status }),
        });

        if (ignore) return;

        setItems(body.data?.orders || []);
        setPagination(
          body.data?.pagination || {
            per_page: 5,
            has_more_pages: false,
            next_cursor: null,
          },
        );
      } catch (err) {
        if (!ignore) {
          setError(getErrorMessage(err));
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [cursor, status, reloadKey]);

  // Reset pagination when status changes
  const handleTabChange = (newStatus) => {
    setStatus(newStatus);
    setCursors([null]);
  };

  // Go to next page
  const goNext = () => {
    if (pagination.has_more_pages && pagination.next_cursor) {
      setCursors((prev) => [...prev, pagination.next_cursor]);
    }
  };

  // Go to previous page
  const goPrev = () => {
    setCursors((prev) => prev.slice(0, -1));
  };

  // Change order status
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
          message={error}
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
          pagination={false}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 12,
            marginTop: 16,
          }}
        >
          <Typography.Text type="secondary">
            Page {cursors.length}
          </Typography.Text>

          <Button
            onClick={goPrev}
            disabled={cursors.length === 1 || loading}
          >
            Previous
          </Button>

          <Button
            type="primary"
            onClick={goNext}
            disabled={!pagination.has_more_pages || loading}
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
}
