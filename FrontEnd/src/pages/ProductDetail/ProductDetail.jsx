import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Rate,
  Table,
  Image,
  Typography,
  Spin,
  message,
} from "antd";
import {
  LeftOutlined,
  RightOutlined,
  ShoppingCartOutlined,
  SwapOutlined,
  HeartOutlined,
  HeartFilled,
} from "@ant-design/icons";
import "./ProductDetail.css";
import { getProductById } from "../../allAPIs/product";
import { addCart } from "../../allAPIs/cart";
import { useAuth } from "../../context/AuthContext";
import LoginRequiredModal from "../../components/LoginRequireModal/LoginRequireModal";
import { useCompare } from "../../context/CompareContext";
import {
  addProductToFavorites,
  removeProductFromFavorites,
  getFavoriteProductIds,
} from "../../allAPIs/favorites";
import Comments from "../../components/Comments/Comments";
import { getColorCode } from "../../utils/colorUtils";

const { Title, Text } = Typography;

// Helper function to safely get the color from attributes
const getProductColor = (product) => {
  if (!product || !product.attributes) return "Unknown";
  const attributes = product.attributes;
  return (
    attributes.Color ||
    attributes.color ||
    attributes.Renk ||
    attributes.renk ||
    "Unknown"
  );
};

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCompare } = useCompare();

  // States for dynamic structure
  const [allVariations, setAllVariations] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Other states
  const [loading, setLoading] = useState(true);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);

  const PENDING_CART_ITEM_KEY = "pendingCartItemProductId";
  const commentsRef = useRef(null);

  // Advanced data fetching logic
  useEffect(() => {
    const fetchProductGroup = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const productGroupData = await getProductById(id);
        if (!productGroupData || productGroupData.length === 0) {
          message.error("Product not found.");
          navigate("/");
          return;
        }

        setAllVariations(productGroupData);
        const activeProduct = productGroupData.find((p) => p._id === id);

        if (activeProduct) {
          setCurrentProduct(activeProduct);
          if (user?.id) {
            const favoriteIds = await getFavoriteProductIds(user.id);
            setIsFavorite(favoriteIds.includes(activeProduct._id));
          } else {
            setIsFavorite(false);
          }
        } else {
          message.info("Specified variation not found. Redirecting...");
          navigate(`/productDetail/${productGroupData[0]._id}`, {
            replace: true,
          });
        }
      } catch (error) {
        console.error("Error fetching product group:", error);
        message.error("Failed to load product information.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductGroup();
  }, [id, user, navigate]);

  useEffect(() => {
    if (currentProduct) setCurrentImageIndex(0);
  }, [currentProduct]);

  // Function to switch variants
  const handleVariantSelect = (variantId) => {
    if (currentProduct?._id === variantId) return;
    const newProduct = allVariations.find((p) => p._id === variantId);
    if (newProduct) {
      setCurrentProduct(newProduct);
      navigate(`/productDetail/${variantId}`, { replace: true });
    }
  };

  // --- Functions updated to use `currentProduct` ---

  const handleAddToCart = async () => {
    if (!currentProduct) return;
    if (user?.id) {
      setIsAdding(true);
      try {
        await addCart(user.id, currentProduct._id, 1);
        message.success(
          `${currentProduct.name} (${getProductColor(
            currentProduct
          )}) has been added to the cart!`
        );
      } catch (error) {
        message.error("There was a problem adding the product to the cart.");
      } finally {
        setIsAdding(false);
      }
    } else {
      localStorage.setItem(PENDING_CART_ITEM_KEY, currentProduct._id);
      message.info("Please log in to add items to your cart.");
      setIsLoginModalVisible(true);
    }
  };

  // Compare function using `currentProduct`
  const handleAddToCompare = () => {
    if (currentProduct) {
      const productForCompare = {
        id: currentProduct._id,
        name: currentProduct.name,
        image:
          currentProduct.mainImage ||
          (currentProduct.additionalImages &&
            currentProduct.additionalImages[0]) ||
          "",
        price: currentProduct.discountedPrice
          ? `${Math.round(currentProduct.discountedPrice)} TL`
          : `${currentProduct.price} TL`,
        attributes: currentProduct.attributes,
      };
      addToCompare(productForCompare);
    }
  };

  const handleToggleFavorite = async () => {
    if (!currentProduct) return;
    if (!user) {
      message.warning("Please log in to manage your favorites.");
      setIsLoginModalVisible(true);
      return;
    }
    setIsFavoriteLoading(true);
    try {
      if (isFavorite) {
        await removeProductFromFavorites(user.id, currentProduct._id);
        message.success(
          `${currentProduct.name} has been removed from favorites.`
        );
        setIsFavorite(false);
      } else {
        await addProductToFavorites(user.id, currentProduct._id);
        message.success(`${currentProduct.name} has been added to favorites.`);
        setIsFavorite(true);
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  // Render preparation
  if (loading) return <Spin tip="Loading..." fullscreen />;
  if (!currentProduct)
    return (
      <div style={{ padding: 50, textAlign: "center" }}>
        <Title level={3}>Product Not Found.</Title>
      </div>
    );

  const images = [
    currentProduct.mainImage,
    ...(currentProduct.additionalImages || []),
  ].filter(Boolean);
  const specifications = Object.entries(currentProduct.attributes || {}).map(
    ([key, value]) => ({ key, value })
  );
  const columns = [
    { title: "Specification", dataIndex: "key" },
    { title: "Value", dataIndex: "value" },
  ];

  const nextImage = () => {
    if (images.length > 1)
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    if (images.length > 1)
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
  };

  return (
    <div className="product-detail-root">
      <div className="product-detail-flex-row">
        <div className="product-detail-image-side">
          <div className="product-detail-image-box">
            {images.length > 1 && (
              <Button
                icon={<LeftOutlined />}
                className="product-detail-arrow-btn left"
                onClick={prevImage}
              />
            )}
            <Image
              src={images[currentImageIndex]}
              alt={currentProduct.name}
              className="product-detail-main-img"
              preview={false}
            />
            {images.length > 1 && (
              <Button
                icon={<RightOutlined />}
                className="product-detail-arrow-btn right"
                onClick={nextImage}
              />
            )}
          </div>
          <div className="product-detail-thumbs-row">
            {images.map((img, index) => (
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                key={index}
                className={`product-detail-thumb ${
                  currentImageIndex === index ? "selected" : ""
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        <div className="product-detail-info-side">
          <Card className="product-detail-card">
            <Title level={2} className="product-detail-title">
              {currentProduct.description}
            </Title>

            {allVariations.length > 1 && (
              <div className="product-variations-section">
                <Text strong style={{ color: "#6c5a8a" }}>
                  Color: {getProductColor(currentProduct)}
                </Text>
                <div className="color-options">
                  {allVariations.map((variation) => (
                    <div
                      key={variation._id}
                      className={`color-dot-wrapper ${
                        currentProduct._id === variation._id ? "selected" : ""
                      }`}
                      onClick={() => handleVariantSelect(variation._id)}
                    >
                      <div
                        className="color-dot"
                        style={{
                          backgroundColor: getColorCode(
                            getProductColor(variation)
                          ),
                        }}
                        title={getProductColor(variation)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <Rate
                disabled
                allowHalf
                value={currentProduct.averageRating || 0}
                className="product-detail-rate"
              />
              {currentProduct.reviewCount > 0 && (
                <Text strong>
                  {(currentProduct.averageRating || 0).toFixed(1)}
                </Text>
              )}
              <Text
                className="product-detail-comments"
                onClick={() =>
                  commentsRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                style={{ cursor: "pointer" }}
              >
                ({currentProduct.reviewCount || 0} Reviews)
              </Text>
            </div>

            <div className="product-detail-pricing">
              {currentProduct.discount > 0 && (
                <p className="product-detail-old-price">
                  <del>{currentProduct.price} TL</del>
                </p>
              )}
              <Title level={3} className="product-detail-current-price">
                {currentProduct.discountedPrice
                  ? `${Math.round(currentProduct.discountedPrice)} TL`
                  : `${currentProduct.price} TL`}
              </Title>
              <Text type="secondary" className="product-detail-brand">
                Brand: {currentProduct.brand?.name}
              </Text>
              <br />
              <Text type="secondary" className="product-detail-category">
                Category: {currentProduct.category?.name}
              </Text>
            </div>

            <div className="product-detail-buttons">
              <Button
                icon={<SwapOutlined />}
                size="large"
                className="product-detail-compare-btn"
                onClick={handleAddToCompare}
              >
                COMPARE
              </Button>
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                size="large"
                className="product-detail-cart-btn"
                onClick={handleAddToCart}
                loading={isAdding}
              >
                ADD TO CART
              </Button>
            </div>
            <Button
              icon={
                isFavorite ? (
                  <HeartFilled style={{ color: "#c41d7f" }} />
                ) : (
                  <HeartOutlined />
                )
              }
              onClick={handleToggleFavorite}
              loading={isFavoriteLoading}
              block
              style={{ marginTop: 8 }}
            >
              {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            </Button>

            <div className="product-detail-specs">
              <Title level={4}>Technical Specifications</Title>
              <Table
                dataSource={specifications}
                columns={columns}
                pagination={false}
                size="small"
                className="product-detail-specs-table"
                rowKey="key"
              />
            </div>
          </Card>
        </div>
      </div>

      <LoginRequiredModal
        visible={isLoginModalVisible}
        onClose={() => setIsLoginModalVisible(false)}
      />
      <div style={{ marginTop: 40 }} ref={commentsRef}>
        <Comments productId={id} />
      </div>
    </div>
  );
}

export default ProductDetail;
