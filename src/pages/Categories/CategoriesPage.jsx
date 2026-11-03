import { useEffect, useState } from "react";
import { Alert, Table, Typography } from "antd";
import { getCategories } from "@/features/categories/api";
import { getErrorMessage } from "@/utils/getErrorMessage";

const columns = [
  { title: "ID", dataIndex: "id", width: 70 },
  { title: "Name", dataIndex: "name" },
  { title: "Slug", dataIndex: "slug" },
  {
    title: "Description",
    dataIndex: "description",
    render: (text) => text ?? "-",
  },
];

export default function CategoriesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const body = await getCategories();
        if (!ignore) setItems(body.data);
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
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={3}>Categories</Typography.Title>

      {error && (
        <Alert type="error" showIcon title={error} style={{ marginBottom: 16 }} />
      )}

      <Table
        rowKey="id"
        loading={loading}
        dataSource={items}
        columns={columns}
        pagination={false}
        scroll={{ x: true }}
      />
    </div>
  );
}