import { useState, useEffect } from "react";
import "./CategoryCards.css";
import "bootstrap/dist/css/bootstrap.min.css";
import StarIcon from "@mui/icons-material/Star";
import SortIcon from "@mui/icons-material/Sort";
import { Dropdown, Menu, Space } from "antd";
import {
  getProductsByCategory,
  getProductsByBrand,
} from "../../allAPIs/product";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";

// eslint-disable-next-line react/prop-types
function CategoryCards({ categoryId, filters }) {
  const [currentSort, setCurrentSort] = useState("price-asc");
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Filtre varsa filtreli ürünleri getir
        // eslint-disable-next-line react/prop-types
        if (
          // eslint-disable-next-line react/prop-types
          filters.brands.length > 0 ||
          // eslint-disable-next-line react/prop-types
          filters.minPrice > 0 ||
          // eslint-disable-next-line react/prop-types
          filters.maxPrice < 150000
        ) {
          const response = await getProductsByBrand(
            // eslint-disable-next-line react/prop-types
            filters.brands,
            // eslint-disable-next-line react/prop-types
            filters.minPrice,
            // eslint-disable-next-line react/prop-types
            filters.maxPrice
          );
          // Filtrelenmiş ürünlerin aynı zamanda bu kategoriye ait olmasını sağla
          const filteredProducts = response.products.filter(
            (product) => product.category._id === categoryId
          );
          setProducts(filteredProducts);
          setCategoryName(filteredProducts[0]?.category?.name || "");
        } else {
          // Filtre yoksa normal kategori ürünlerini getir
          const response = await getProductsByCategory(categoryId);
          setProducts(response.products);
          setCategoryName(response.category);
        }
      } catch (error) {
        console.error("Ürünler yüklenirken hata:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, filters]);

  useEffect(() => {
    // Favoriler dizisini ürün sayısına göre güncelle
    setFavorites(Array(products.length).fill(false));
  }, [categoryId, filters, products.length]);

  const handleSortChange = (sortType) => {
    setCurrentSort(sortType);
    const sorted = [...products].sort((a, b) => {
      if (sortType === "price-asc")
        return a.discountedPrice - b.discountedPrice;
      if (sortType === "price-desc")
        return b.discountedPrice - a.discountedPrice;
      return 0;
    });
    setProducts(sorted);
  };

  const toggleFavorite = (index) => {
    setFavorites((prev) => {
      const newFavs = [...prev];
      newFavs[index] = !newFavs[index];
      return newFavs;
    });
  };

  const ProductSort = () => {
    const [open, setOpen] = useState(false);

    const menu = (
      <Menu
        onClick={({ key }) => {
          handleSortChange(key);
          setOpen(false);
        }}
      >
        <Menu.Item key="price-asc">Fiyat: Düşük-Yüksek</Menu.Item>
        <Menu.Item key="price-desc">Fiyat: Yüksek-Düşük</Menu.Item>
      </Menu>
    );

    return (
      <Dropdown
        overlay={menu}
        trigger={["click"]}
        open={open}
        onOpenChange={(flag) => setOpen(flag)}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space style={{ cursor: "pointer" }}>
            <SortIcon
              style={{
                fontSize: "2rem",
                color: "#000",
                verticalAlign: "middle",
              }}
            />
          </Space>
        </a>
      </Dropdown>
    );
  };

  if (loading) {
    return <div className="text-center py-5">Yükleniyor...</div>;
  }

  if (!products.length) {
    return (
      <div className="text-center py-5">Bu kategoride ürün bulunamadı.</div>
    );
  }

  return (
    <div className="container">
      <div className="category-cards-and-sort d-flex justify-content-between align-items-center">
        <h2 className="category-cards-title">{categoryName}</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.9rem", color: "#666" }}>Sırala:</span>
          <ProductSort />
        </div>
      </div>

      <div className="row">
        {products.map((product, index) => (
          <div key={product._id} className="col-md-3 mb-4">
            <div className="category-cards container" style={{position:'relative'}}>
              <button
                className="favorite-button"
                onClick={() => toggleFavorite(index)}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  background: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  zIndex: 2,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                {favorites[index] ? (
                  <HeartFilled style={{ fontSize: 24, color: 'red' }} />
                ) : (
                  <HeartOutlined style={{ fontSize: 24, color: '#bbb' }} />
                )}
              </button>
              <img
                src={product.mainImage}
                alt={product.name}
                className="card-image-category-cards"
              />
              <div className="card-details-category-cards">
                <p className="product-name-category-cards">{product.name}</p>
                <div
                  className="d-flex justify-content-between"
                  style={{ padding: "0rem 1rem" }}
                >
                  <div className="rating-category-cards">
                    <StarIcon />
                    <p>4.8</p>
                  </div>
                  <div>
                    {product.discount > 0 && (
                      <p
                        style={{ color: "red", textDecoration: "line-through" }}
                      >
                        ₺{product.price.toFixed(2)}
                      </p>
                    )}
                    <p className="product-price-category-cards">
                      ₺{product.discountedPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                <button className="buy-button-category-cards">See Detail</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryCards;
