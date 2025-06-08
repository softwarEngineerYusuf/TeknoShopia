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
import { addCart } from "../../allAPIs/cart";
import { useAuth } from "../../context/AuthContext";
import LoginRequiredModal from "../../components/LoginRequireModal/LoginRequireModal";
import { useCompare } from "../../context/CompareContext";

import { message } from "antd";
function ProductDetail() {
  const { id } = useParams(); // URL'den ID'yi al
  const { user } = useAuth();
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const { Title, Text } = Typography;
  // const [compareList, setCompareList] = useState([]);
  const { addToCompare } = useCompare();
  // const [showCompareSection, setShowCompareSection] = useState(false);
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const PENDING_CART_ITEM_KEY = "pendingCartItemProductId";

  useEffect(() => {
    console.log("user", user);
    const fetchProduct = async () => {
      setLoading(true); // Yüklemeyi başlat
      const data = await getProductById(id);
      setProduct(data);
      setCurrentImageIndex(0); // Yeni ürün geldiğinde resmi sıfırla
      setLoading(false); // Yüklemeyi bitir
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (user && user.id) {
      // --- SENARYO 1: KULLANICI GİRİŞ YAPMIŞ ---
      setIsAdding(true);
      try {
        const response = await addCart(user.id, product.id, 1);
        if (response && response.cart) {
          message.success(`${product.name} başarıyla sepete eklendi!`);
        } else {
          message.error("Ürün sepete eklenirken bir sorun oluştu.");
        }
      } catch (error) {
        message.error("Bir hata oluştu. Lütfen tekrar deneyin.");
        console.error("Sepete ekleme hatası:", error);
      } finally {
        setIsAdding(false);
      }
    } else {
      // --- SENARYO 2: KULLANICI GİRİŞ YAPMAMIŞ (MİSAFİR) ---
      // Ürün ID'sini localStorage'a kaydet
      localStorage.setItem(PENDING_CART_ITEM_KEY, product._id);

      // Kullanıcıya bilgi ver
      message.info("Giriş yaptıktan sonra bu ürün sepetinize eklenecektir.");

      // Giriş yapma modalını göster
      setIsLoginModalVisible(true);
    }
  };

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
    <div className="product-detail-root">
      <div className="product-detail-flex-row">
        <div className="product-detail-image-side">
          <div className="product-detail-image-box">
            <Button
              icon={<LeftOutlined />}
              className="product-detail-arrow-btn left"
              onClick={prevImage}
            />
            <Image
              src={images[currentImageIndex]}
              alt={product.name}
              className="product-detail-main-img"
            />
            <Button
              icon={<RightOutlined />}
              className="product-detail-arrow-btn right"
              onClick={nextImage}
            />
          </div>
          <div className="product-detail-thumbs-row">
            {images.map((img, index) => (
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                key={index}
                className={`product-detail-thumb${
                  currentImageIndex === index ? " selected" : ""
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
        <div className="product-detail-info-side">
          <Card className="product-detail-card">
            <Title level={2} className="product-detail-title">
              {product.name}
            </Title>
            <Rate
              disabled
              defaultValue={4}
              className="product-detail-rate"
            />
            <Text className="product-detail-comments"> (Yorumlar)</Text>
            <div className="product-detail-pricing">
              {product.discount > 0 && (
                <p className="product-detail-old-price">
                  <del>{product.price}₺</del>
                </p>
              )}
              <Title level={3} className="product-detail-current-price">
                {product.discountedPrice
                  ? `${Math.round(product.discountedPrice)} TL`
                  : `${product.price} TL`}
              </Title>
              <Text type="secondary" className="product-detail-brand">
                Marka: {product.brand?.name}
              </Text>
              <br />
              <Text type="secondary" className="product-detail-category">
                Kategori: {product.category?.name}
              </Text>
            </div>
            <div className="product-detail-buttons">
              <Button
                type="primary"
                icon={<SwapOutlined />}
                size="large"
                className="product-detail-compare-btn"
                onClick={handleAddToCompare}
              >
                Compare
              </Button>
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                size="large"
                className="product-detail-cart-btn"
                onClick={handleAddToCart}
                loading={isAdding}
              >
                Sepete Ekle
              </Button>
            </div>
            <div className="product-detail-specs">
              <Title level={4}>Teknik Özellikler</Title>
              <Table
                dataSource={specifications}
                columns={columns}
                pagination={false}
                size="small"
                className="product-detail-specs-table"
              />
            </div>
          </Card>
        </div>
      </div>
      <LoginRequiredModal
        visible={isLoginModalVisible}
        onClose={() => setIsLoginModalVisible(false)}
      />
    </div>
  );
}

export default ProductDetail;
