import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Col,
  Image,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
} from "antd";

import {
  ArrowLeftOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

import { colors } from "@/theme/colors";
import productPlaceholder from "@/assets/product-placeholder.png";

import { getProductById } from "@/features/products/api";
import { getErrorMessage } from "@/utils/getErrorMessage";

const { Title, Text, Paragraph } = Typography;

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadProduct() {
      setLoading(true);
      setError("");

      try {
        const body = await getProductById(id);

        if (!ignore) {
          setProduct(body.data.product);
          setAvailableQuantity(body.data.available_quantity ?? 0);
        }
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

    loadProduct();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/dashboard/products")}
        >
          Back to Products
        </Button>

        <Alert
          type="error"
          showIcon
          message={error}
          style={{ marginTop: 20 }}
        />
      </div>
    );
  }

  if (!product) return null;

  const images =
    product.images?.length > 0
      ? product.images
      : [{ id: "placeholder", url: productPlaceholder }];

  const sectionStyle = {
    borderRadius: 16,
    border: `1px solid ${colors.border}`,
    overflow: "hidden",
    height: "100%",
  };

  const labelStyle = {
    color: colors.textSecondary,
    fontSize: 13,
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            title: (
              <a
                onClick={() => navigate("/dashboard/products")}
                style={{ color: colors.primary }}
              >
                Products
              </a>
            ),
          },
          { title: "Product Details" },
        ]}
        style={{ marginBottom: 22 }}
      />

      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div>
          <Title level={3} style={{ margin: 0 }}>
            Product Details
          </Title>
          <Text style={{ color: colors.textSecondary }}>
            View product information and availability
          </Text>
        </div>

        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/dashboard/products")}
          style={{
            borderColor: colors.primary,
            color: colors.primary,
            borderRadius: 9,
            height: 40,
          }}
        >
          Back to Products
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* Product Image */}
        <Col xs={24} md={10}>
          <Card
            title={
              <Space>
                <ShoppingOutlined style={{ color: colors.primary }} />
                Product Image
              </Space>
            }
            style={sectionStyle}
            styles={{
              header: {
                background: colors.gradientStart,
                borderBottom: `1px solid ${colors.border}`,
              },
              body: { padding: 24 },
            }}
          >
            <div
              style={{
                background: colors.gradientStart,
                borderRadius: 14,
                padding: 20,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 300,
              }}
            >
              <Image.PreviewGroup>
                <Image
                  src={images[0].url}
                  fallback={productPlaceholder}
                  alt={product.name}
                  width="100%"
                  height={270}
                  style={{
                    objectFit: "contain",
                    borderRadius: 10,
                  }}
                  preview={{
                    mask: "View Image",
                  }}
                />
              </Image.PreviewGroup>
            </div>

            {images.length > 1 && (
              <Row gutter={[10, 10]} style={{ marginTop: 14 }}>
                {images.slice(1).map((image) => (
                  <Col span={8} key={image.id}>
                    <Image
                      src={image.url}
                      fallback={productPlaceholder}
                      alt={product.name}
                      width="100%"
                      height={85}
                      style={{
                        objectFit: "contain",
                        background: colors.gradientStart,
                        borderRadius: 9,
                        padding: 5,
                      }}
                    />
                  </Col>
                ))}
              </Row>
            )}

            {product.images?.length === 0 && (
              <Text
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: 14,
                  color: colors.textSecondary,
                }}
              >
                Default product image
              </Text>
            )}
          </Card>
        </Col>

        {/* General Information */}
        <Col xs={24} md={14}>
          <Card
            title="General Information"
            style={sectionStyle}
            styles={{
              header: {
                background: colors.gradientStart,
                borderBottom: `1px solid ${colors.border}`,
              },
              body: { padding: 28 },
            }}
          >
            <Space direction="vertical" size={20} style={{ width: "100%" }}>
              <div>
                <Text style={labelStyle}>Product Name</Text>
                <Title level={3} style={{ margin: "5px 0" }}>
                  {product.name}
                </Title>
              </div>

              <div
                style={{
                  background: colors.gradientStart,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 12,
                  padding: "16px 20px",
                }}
              >
                <Text style={labelStyle}>Product Price</Text>
                <Title
                  level={2}
                  style={{
                    color: colors.primary,
                    margin: "5px 0 0",
                  }}
                >
                  ${Number(product.price).toFixed(2)}
                </Title>
              </div>

              <Row gutter={[12, 12]}>
                <Col xs={12}>
                  <div
                    style={{
                      background: "#F0F9F1",
                      borderRadius: 10,
                      padding: 12,
                    }}
                  >
                    <Text style={{ color: "#54875A", fontSize: 12 }}>
                      Status
                    </Text>
                    <div style={{ marginTop: 6 }}>
                      {product.is_active ? (
                        <Tag color="success">Active</Tag>
                      ) : (
                        <Tag color="error">Inactive</Tag>
                      )}
                    </div>
                  </div>
                </Col>

                <Col xs={12}>
                  <div
                    style={{
                      background: colors.gradientStart,
                      borderRadius: 10,
                      padding: 12,
                    }}
                  >
                    <Text style={labelStyle}>Available Quantity</Text>
                    <Title
                      level={4}
                      style={{
                        color: colors.primary,
                        margin: "6px 0 0",
                      }}
                    >
                      {availableQuantity}
                    </Title>
                  </div>
                </Col>
              </Row>

              <div>
                <Space>
                  <AppstoreOutlined style={{ color: colors.primary }} />
                  <Text strong>Category</Text>
                </Space>
                <Paragraph style={{ margin: "8px 0 0 24px" }}>
                  {product.category?.name || "-"}
                </Paragraph>
              </div>

              <div>
                <Text strong>Description</Text>
                <Paragraph
                  style={{
                    marginTop: 8,
                    color: colors.textSecondary,
                    lineHeight: 1.8,
                  }}
                >
                  {product.description || "No description available."}
                </Paragraph>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
