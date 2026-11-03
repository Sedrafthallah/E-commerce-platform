import { useEffect, useState } from "react";
import { Alert, Table, Tag, Typography } from "antd";
import { getProducts } from "@/features/products/api";
import { getErrorMessage } from "@/utils/getErrorMessage";

const columns = [
  { title: "ID", dataIndex: "id", width: 70 },
  { title: "Name", dataIndex: "name" },
  { title: "Category", render: (_, record) => record.category?.name ?? "-" },
  {
    title: "Price",
    dataIndex: "price",
    render: (price) => Number(price).toFixed(2),
  },
  {
    title: "Status",
    dataIndex: "is_active",
    render: (active) =>
      active ? <Tag color="green">Active</Tag> : <Tag>Inactive</Tag>,
  },
  { title: "Created", dataIndex: "created_at" },
];

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 5,
    total: 0,
  });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
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
  }, [page]);

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={3}>Products</Typography.Title>

      {error && (
        <Alert type="error" showIcon message={error} style={{ marginBottom: 16 }} />
      )}

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
    </div>
  );
}