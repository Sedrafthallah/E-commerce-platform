import { useEffect, useState } from "react";
import { Alert, Button, Card, Space, Table, Tag, Typography } from "antd";
import { Alert, Button, Table, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";

import { getProducts } from "@/features/products/api";
import { getCategories } from "@/features/categories/api";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function ProductsPage() {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("all");
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 5,
    total: 0,
  });

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // تبويبات التصنيفات: مرة وحدة
  useEffect(() => {
    getCategories()
      .then((body) => setCategories(body.data))
      .catch((err) => setError(getErrorMessage(err)));
  }, []);

  // المنتجات: كل ما تغيّرت الصفحة أو التصنيف
  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const body = await getProducts({
          page,
          per_page: 5,
          include_inactive: 1,
          ...(categoryId !== "all" && { category_id: categoryId }),
        });
        const body = await getProducts({ page, per_page: 5 });

        if (ignore) return;

        setItems(body.data.items);
        setPagination(body.data.pagination);
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
  }, [page, categoryId]);

  const handleCategoryChange = (id) => {
    setCategoryId(id);
    setPage(1); // رجّع لأول صفحة
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
      <Typography.Title level={3} style={{ marginBottom: 4 }}>
        Products
      </Typography.Title>
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
        <Alert type="error" showIcon title={error} style={{ marginBottom: 16 }} />
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
