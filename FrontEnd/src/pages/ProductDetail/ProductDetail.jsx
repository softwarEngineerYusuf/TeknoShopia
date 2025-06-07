import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Button,
  Rate,
  Table,
  Image,
  Typography,
  Spin,
} from "antd";
import {
  LeftOutlined,
  RightOutlined,
  ShoppingCartOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import "./ProductDetail.css";
import { getProductById } from "../../allAPIs/product";

import { useCompare } from "../../context/CompareContext";
const { Title, Text } = Typography;

function ProductDetail() {
  const { id } = useParams(); // URL'den ID'yi al
  // const [compareList, setCompareList] = useState([]);
  const { addToCompare } = useCompare();
  // const [showCompareSection, setShowCompareSection] = useState(false);
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true); // Yüklemeyi başlat
      const data = await getProductById(id);
      setProduct(data);
      setCurrentImageIndex(0); // Yeni ürün geldiğinde resmi sıfırla
      setLoading(false); // Yüklemeyi bitir
    };
    fetchProduct();
  }, [id]);

  const handleAddToCompare = () => {
    if (product) {
      const productForCompare = {
        id: product.id,
        name: product.name,
        // Ana resim ve ek resimler varsa kullan, yoksa boş bir string ata
        image:
          product.mainImage ||
          (product.additionalImages && product.additionalImages[0]) ||
          "",
        price: product.discountedPrice
          ? `${Math.round(product.discountedPrice)} TL`
          : `${product.price} TL`,
        // Compare sayfasında lazım olacak tüm özellikler
        attributes: product.attributes,
      };
      // Context'teki fonksiyonu çağır
      addToCompare(productForCompare);
    }
  };

  const nextImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    }
  };

  if (loading) {
    return <Spin tip="Yükleniyor..." fullscreen />;
  }

  if (!product) {
    return <p>Ürün bulunamadı.</p>;
  }

  const images =
    product && product.mainImage
      ? [product.mainImage, ...(product.additionalImages || [])]
      : [];

  const specifications = Object.entries(product.attributes || {}).map(
    ([key, value]) => ({
      key,
      value,
    })
  );

  const columns = [
    {
      title: "Özellik",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Değer",
      dataIndex: "value",
      key: "value",
    },
  ];

  return (
    <>
      <div className="container">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div
              style={{ position: "relative", width: "90%", margin: "0 auto" }}
            >
              <Button
                icon={<LeftOutlined />}
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 1,
                  backgroundColor: "rgba(255,255,255,0.8)",
                }}
                onClick={prevImage}
              />
              <Image
                src={images[currentImageIndex]}
                alt={product.name}
                style={{ width: "100%" }}
              />
              <Button
                icon={<RightOutlined />}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 1,
                  backgroundColor: "rgba(255,255,255,0.8)",
                }}
                onClick={nextImage}
              />
            </div>

            <Row
              gutter={[8, 8]}
              style={{ marginTop: 16, width: "80%", margin: "0 auto" }}
            >
              {images.map((img, index) => (
                <Col span={8} key={index}>
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    style={{ width: "100%", cursor: "pointer" }}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                </Col>
              ))}
            </Row>
          </Col>

          <Col xs={24} md={12}>
            <Card>
              <Title level={2}>{product.name}</Title>
              <Rate disabled defaultValue={4} />
              <Text> (Yorumlar)</Text>

              <div style={{ margin: "24px 0" }}>
                {product.discount > 0 && (
                  <p style={{ color: "red" }}>
                    <del>{product.price}₺</del>
                  </p>
                )}
                <Title level={3}>
                  {product.discountedPrice
                    ? `${Math.round(product.discountedPrice)} TL`
                    : `${product.price} TL`}
                </Title>
                <Text type="secondary">Marka: {product.brand?.name}</Text>
                <br />
                <Text type="secondary">Kategori: {product.category?.name}</Text>
              </div>

              <div
                className="product-buttons"
                style={{ display: "flex", gap: 4 }}
              >
                <Button
                  type="primary"
                  icon={<SwapOutlined />}
                  size="large"
                  style={{ backgroundColor: "green", width: "30%" }}
                  className="compare-btn-product-detail"
                  onClick={handleAddToCompare}
                >
                  Compare
                </Button>

                <Button
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  size="large"
                  style={{ backgroundColor: "#32174D", width: "70%" }}
                >
                  Sepete Ekle
                </Button>
              </div>

              <div style={{ marginTop: 24 }}>
                <Title level={4}>Teknik Özellikler</Title>
                <Table
                  dataSource={specifications}
                  columns={columns}
                  pagination={false}
                  size="small"
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ProductDetail;
