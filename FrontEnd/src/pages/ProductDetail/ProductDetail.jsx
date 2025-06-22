import { useEffect, useState, useRef } from "react";
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
  HeartOutlined, // YENİ: Boş kalp ikonu
  HeartFilled, // YENİ: Dolu kalp ikonu
} from "@ant-design/icons";
import "./ProductDetail.css";
import { getProductById } from "../../allAPIs/product";
import { addCart } from "../../allAPIs/cart";
import { useAuth } from "../../context/AuthContext";
import LoginRequiredModal from "../../components/LoginRequireModal/LoginRequireModal";
import { useCompare } from "../../context/CompareContext";
import { message } from "antd";

import {
  addProductToFavorites,
  removeProductFromFavorites,
  getFavoriteProductIds,
} from "../../allAPIs/favorites";
import Comments from "../../components/Comments/Comments"; // YENİ: Comments componentinin import edilmesi

function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const { Title, Text } = Typography;
  const { addToCompare } = useCompare();
  const [product, setProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const PENDING_CART_ITEM_KEY = "pendingCartItemProductId";

  const commentsRef = useRef(null);

  useEffect(() => {
    const fetchProductAndFavoriteStatus = async () => {
      setLoading(true);

      const productPromise = getProductById(id);
      let favoritePromise = Promise.resolve([]);

      if (user && user.id) {
        favoritePromise = getFavoriteProductIds(user.id);
      }

      const [productData, favoriteIds] = await Promise.all([
        productPromise,
        favoritePromise,
      ]);

      setProduct(productData);
      setCurrentImageIndex(0);

      if (productData && favoriteIds.length > 0) {
        setIsFavorite(favoriteIds.includes(productData.id));
      } else {
        setIsFavorite(false);
      }

      setLoading(false);
    };
    fetchProductAndFavoriteStatus();
  }, [id, user]);

  const handleAddToCart = async () => {
    if (user && user.id) {
      setIsAdding(true);
      try {
        const response = await addCart(user.id, product.id, 1);
        if (response && response.cart) {
          message.success(`${product.name} Added to cart successfully!`);
        } else {
          message.error("There was a problem adding the product to the cart.");
        }
      } catch (error) {
        message.error("An error occurred, please try again.");
      } finally {
        setIsAdding(false);
      }
    } else {
      localStorage.setItem(PENDING_CART_ITEM_KEY, product._id);
      message.info("This product will be added to your cart after logging in.");
      setIsLoginModalVisible(true);
    }
  };

  const handleAddToCompare = () => {
    // ... Bu fonksiyon aynı kalıyor ...
    if (product) {
      const productForCompare = {
        id: product.id,
        name: product.name,
        image:
          product.mainImage ||
          (product.additionalImages && product.additionalImages[0]) ||
          "",
        price: product.discountedPrice
          ? `${Math.round(product.discountedPrice)} TL`
          : `${product.price} TL`,
        attributes: product.attributes,
      };
      addToCompare(productForCompare);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      message.warning("Please log in to manage favorites.");
      setIsLoginModalVisible(true);
      return;
    }

    setIsFavoriteLoading(true);
    try {
      if (isFavorite) {
        await removeProductFromFavorites(user.id, product.id);
        message.success(`${product.name} removed from favorites.`);
        setIsFavorite(false);
      } else {
        await addProductToFavorites(user.id, product.id);
        message.success(`${product.name} added to favorites.`);
        setIsFavorite(true);
      }
    } catch (error) {
      message.error("An error occurred, please try again.");
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const nextImage = () => {
    if (images.length > 0)
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length > 0)
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
  };

  if (loading) return <Spin tip="Loading..." fullscreen />;
  if (!product) return <p>Product not found.</p>;

  const images =
    product && product.mainImage
      ? [product.mainImage, ...(product.additionalImages || [])]
      : [];
  const specifications = Object.entries(product.attributes || {}).map(
    ([key, value]) => ({ key, value })
  );
  const columns = [
    { title: "Özellik", dataIndex: "key" },
    { title: "Değer", dataIndex: "value" },
  ];

  return (
    <div className="product-detail-root">
      <div className="product-detail-flex-row">
        <div className="product-detail-image-side">
          {/* ... resim galerisi kısmı aynı ... */}
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
            <Rate disabled defaultValue={4} className="product-detail-rate" />
            <Text className="product-detail-comments" onClick={() => {
              if (commentsRef.current) {
                commentsRef.current.scrollIntoView({ behavior: 'smooth' });
              }
            }} style={{ cursor: 'pointer', color: '#1890ff' }}> Comments</Text>
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
                Brand: {product.brand?.name}
              </Text>
              <br />
              <Text type="secondary" className="product-detail-category">
                Category: {product.category?.name}
              </Text>
            </div>
            <div className="product-detail-buttons">
              <Button
                icon={
                  isFavorite ? (
                    <HeartFilled style={{ color: "red" }} />
                  ) : (
                    <HeartOutlined />
                  )
                }
                size="large"
                className="product-detail-favorite-btn"
                onClick={handleToggleFavorite}
                loading={isFavoriteLoading}
              >
                {isFavorite ? "Remove Favorite" : "Add Favorite"}
              </Button>
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                size="large"
                className="product-detail-cart-btn"
                onClick={handleAddToCart}
                loading={isAdding}
              >
                Add Basket
              </Button>
              <Button
                icon={<SwapOutlined />}
                size="large"
                className="product-detail-compare-btn"
                onClick={handleAddToCompare}
              >
                Compare
              </Button>
            </div>
            <div className="product-detail-specs">
              <Title level={4}>Technical Specifications</Title>
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
      {/* Yorumlar componenti en alta eklendi */}
      <div style={{ marginTop: 40 }} ref={commentsRef}>
        <Comments />
      </div>
    </div>
  );
}

export default ProductDetail;
