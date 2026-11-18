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

  // Pagination للتصنيفات
  const [categoryPage, setCategoryPage] = useState(1);
  const categoriesPerPage = 5;

  // Pagination للمنتجات
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

  // Reset product pagination when category changes
  const handleCategoryChange = (id) => {
    setCategoryId(id);
    setCursors([null]);
  };

  // Go to next products page
  const goNext = () => {
    if (pagination.has_more_pages && pagination.next_cursor) {
      setCursors((prev) => [...prev, pagination.next_cursor]);
    }
  };

  // Go to previous products page
  const goPrev = () => {
    setCursors((prev) => prev.slice(0, -1));
  };

  // Categories tabs
  const tabs = [{ id: "all", name: "All" }, ...categories];

  // Local pagination for category tabs
  const totalCategoryPages = Math.ceil(tabs.length / categoriesPerPage);

  const visibleTabs = tabs.slice(
    (categoryPage - 1) * categoriesPerPage,
    categoryPage * categoriesPerPage,
  );

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
      {/* Page Header */}
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

      {/* Category Tabs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <Space wrap>
          {visibleTabs.map((tab) => (
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

        {totalCategoryPages > 1 && (
          <Space>
            <Button
              size="small"
              disabled={categoryPage === 1}
              onClick={() => setCategoryPage((page) => page - 1)}
            >
              Previous
            </Button>

            <Typography.Text type="secondary">
              {categoryPage} / {totalCategoryPages}
            </Typography.Text>

            <Button
              size="small"
              disabled={categoryPage === totalCategoryPages}
              onClick={() => setCategoryPage((page) => page + 1)}
            >
              Next
            </Button>
          </Space>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Products Table */}
      <Card title="Product List">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={items}
          columns={columns}
          scroll={{ x: true }}
          pagination={false}
        />

        {/* Products Pagination */}
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

          <Button onClick={goPrev} disabled={cursors.length === 1 || loading}>
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
