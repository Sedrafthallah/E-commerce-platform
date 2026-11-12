
import { useEffect, useState } from "react";
import { Alert, Button, Card, Space, Table, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";

import { getProducts } from "@/features/products/api";
import { getCategories } from "@/features/categories/api";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function ProductsPage() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("all");
  const [items, setItems] = useState([]);

  const [pagination, setPagination] = useState({
    per_page: 5,
    has_more_pages: false,
    next_cursor: null,
  });

  // Cursor history: أول عنصر null يمثل الصفحة الأولى
  const [cursors, setCursors] = useState([null]);
  const cursor = cursors[cursors.length - 1];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Load categories once
  useEffect(() => {
    getCategories()
      .then((body) => setCategories(body.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  // Load products when cursor or category changes
  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const body = await getProducts({
          per_page: 5,
          include_inactive: 1,
          ...(cursor && { cursor }),
          ...(categoryId !== "all" && {
            category_id: categoryId,
          }),
        });

        if (ignore) return;

        setItems(body.data.items);
        setPagination(body.data.pagination);
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
  }, [cursor, categoryId]);

  // Reset pagination when category changes
  const handleCategoryChange = (id) => {
    setCategoryId(id);
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

  const tabs = [{ id: "all", name: "All" }, ...categories];

  const columns = [
    { title: "ID", dataIndex: "id", width: 70 },
    { title: "Name", dataIndex: "name" },
    {
      title: "Category",
      render: (_, record) => record.category?.name ?? "-",
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => Number(price).toFixed(2),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (active) =>
        active ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    { title: "Created", dataIndex: "created_at" },
    {
      title: "Action",
      width: 110,
      render: (_, record) => (
        <Button
          type="primary"
          ghost
          size="small"
          onClick={() => navigate(`/dashboard/products/${record.id}`)}
        >
          Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Products
        </Typography.Title>

        <Button
          type="primary"
          onClick={() => navigate("/dashboard/products/add")}
        >
          + Add Product
        </Button>
      </div>

      <Typography.Paragraph type="secondary">
        Browse products by category.
      </Typography.Paragraph>

      <Space wrap style={{ marginBottom: 20 }}>
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            shape="round"
            type={categoryId === tab.id ? "primary" : "default"}
            onClick={() => handleCategoryChange(tab.id)}
          >
            {tab.name}
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

      <Card title="Product List">
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
