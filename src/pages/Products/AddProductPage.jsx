// import { useEffect, useState } from "react";
// import {
//   Alert,
//   Breadcrumb,
//   Button,
//   Card,
//   Form,
//   Input,
//   InputNumber,
//   Select,
//   Switch,
//   Upload,
//   message,
//   Typography,
//   Space,
// } from "antd";
// import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";

// import { createProduct } from "@/features/products/api";
// import { getCategories } from "@/features/categories/api";
// import { getErrorMessage } from "@/utils/getErrorMessage";

// const { Title, Text } = Typography;
// const { TextArea } = Input;

// export default function AddProductPage() {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();

//   const [categories, setCategories] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const loadCategories = async () => {
//       try {
//         setLoadingCategories(true);

//         const body = await getCategories();
//         setCategories(body.data?.items ?? body.data ?? []);
//       } catch (err) {
//         setError(getErrorMessage(err));
//       } finally {
//         setLoadingCategories(false);
//       }
//     };

//     loadCategories();
//   }, []);

//   const handleSubmit = async (values) => {
//     try {
//       setSaving(true);
//       setError("");

//       const formData = new FormData();

//       formData.append("name", values.name);
//       formData.append("description", values.description || "");
//       formData.append("price", String(values.price));
//       formData.append("category_id", String(values.category_id));
//       formData.append("is_active", values.is_active ? "1" : "0");

//       (values.images || []).forEach((item, index) => {
//         const file = item.originFileObj || item;
//         formData.append(`images[${index}]`, file);
//       });

//       await createProduct(formData);

//       message.success("Product created successfully");
//       navigate("/dashboard/products");
//     } catch (err) {
//       setError(getErrorMessage(err));
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <Space direction="vertical" size="large" style={{ width: "100%" }}>
//       <Breadcrumb
//         items={[
//           { title: "Dashboard" },
//           {
//             title: (
//               <a onClick={() => navigate("/dashboard/products")}>Products</a>
//             ),
//           },
//           { title: "Add Product" },
//         ]}
//       />

//       <div>
//         <Button
//           icon={<ArrowLeftOutlined />}
//           onClick={() => navigate("/dashboard/products")}
//           style={{ marginBottom: 16 }}
//         >
//           Back to Products
//         </Button>

//         <Title level={2}>Add New Product</Title>
//         <Text type="secondary">
//           Enter product information and upload its images.
//         </Text>
//       </div>

//       {error && <Alert type="error" message={error} showIcon />}

//       <Card>
//         <Form
//           form={form}
//           layout="vertical"
//           onFinish={handleSubmit}
//           initialValues={{ is_active: true }}
//         >
//           <Form.Item
//             label="Product Name"
//             name="name"
//             rules={[{ required: true, message: "Please enter product name" }]}
//           >
//             <Input placeholder="Enter product name" />
//           </Form.Item>

//           <Form.Item label="Description" name="description">
//             <TextArea rows={4} placeholder="Enter product description" />
//           </Form.Item>

//           <Form.Item
//             label="Price"
//             name="price"
//             rules={[{ required: true, message: "Please enter price" }]}
//           >
//             <InputNumber
//               min={0}
//               style={{ width: "100%" }}
//               placeholder="Enter price"
//             />
//           </Form.Item>

//           <Form.Item
//             label="Category"
//             name="category_id"
//             rules={[{ required: true, message: "Please select a category" }]}
//           >
//             <Select
//               loading={loadingCategories}
//               placeholder="Select category"
//               options={categories.map((category) => ({
//                 label: category.name,
//                 value: category.id,
//               }))}
//             />
//           </Form.Item>

//           <Form.Item
//             label="Product Images"
//             name="images"
//             valuePropName="fileList"
//             getValueFromEvent={(event) =>
//               Array.isArray(event) ? event : event?.fileList
//             }
//           >
//             <Upload
//               listType="picture"
//               multiple
//               beforeUpload={() => false}
//               accept="image/*"
//             >
//               <Button icon={<UploadOutlined />}>Choose Images</Button>
//             </Upload>
//           </Form.Item>

//           <Form.Item label="Active" name="is_active" valuePropName="checked">
//             <Switch />
//           </Form.Item>

//           <Space>
//             <Button onClick={() => navigate("/dashboard/products")}>
//               Cancel
//             </Button>

//             <Button type="primary" htmlType="submit" loading={saving}>
//               Create Product
//             </Button>
//           </Space>
//         </Form>
//       </Card>
//     </Space>
//   );
// }

import { useEffect, useState } from "react";
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Upload,
  message,
  Typography,
  Space,
} from "antd";

import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { createProduct } from "@/features/products/api";
import { getCategories } from "@/features/categories/api";
import { getErrorMessage } from "@/utils/getErrorMessage";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function AddProductPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);

        const body = await getCategories();
        setCategories(body.data?.items ?? body.data ?? []);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (values) => {
    try {
      setSaving(true);
      setError("");

      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("price", String(values.price));
      formData.append("category_id", String(values.category_id));
      formData.append("is_active", values.is_active ? "1" : "0");
      formData.append("quantity", String(values.quantity));

      (values.images || []).forEach((item, index) => {
        const file = item.originFileObj || item;
        formData.append(`images[${index}]`, file);
      });

      await createProduct(formData);

      message.success("Product created successfully");
      navigate("/dashboard/products");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Breadcrumb
        items={[
          { title: "Dashboard" },
          {
            title: (
              <a onClick={() => navigate("/dashboard/products")}>Products</a>
            ),
          },
          { title: "Add Product" },
        ]}
      />

      <div>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/dashboard/products")}
          style={{ marginBottom: 16 }}
        >
          Back to Products
        </Button>

        <Title level={2}>Add New Product</Title>
        <Text type="secondary">
          Enter product information and upload its images.
        </Text>
      </div>

      {error && <Alert type="error" message={error} showIcon />}

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ is_active: true }}
        >
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea rows={4} placeholder="Enter product description" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Enter price"
            />
          </Form.Item>

          {/* Quantity */}
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[
              {
                required: true,
                message: "Please enter product quantity",
              },
              {
                type: "number",
                min: 0,
                message: "Quantity must be 0 or greater",
              },
            ]}
          >
            <InputNumber
              min={0}
              precision={0}
              style={{ width: "100%" }}
              placeholder="Enter product quantity"
            />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category_id"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select
              loading={loadingCategories}
              placeholder="Select category"
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Product Images"
            name="images"
            valuePropName="fileList"
            getValueFromEvent={(event) =>
              Array.isArray(event) ? event : event?.fileList
            }
          >
            <Upload
              listType="picture"
              multiple
              beforeUpload={() => false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Choose Images</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Active" name="is_active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Space>
            <Button onClick={() => navigate("/dashboard/products")}>
              Cancel
            </Button>

            <Button type="primary" htmlType="submit" loading={saving}>
              Create Product
            </Button>
          </Space>
        </Form>
      </Card>
    </Space>
  );
}
