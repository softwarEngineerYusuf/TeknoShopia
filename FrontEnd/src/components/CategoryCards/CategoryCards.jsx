import React, { useState, useEffect } from "react";
import "./CategoryCards.css";
import "bootstrap/dist/css/bootstrap.min.css";
import StarIcon from "@mui/icons-material/Star";
import SortIcon from "@mui/icons-material/Sort";
import { Dropdown, Menu, Space } from "antd";
import { getProductsByCategory } from "../../allAPIs/product";

// eslint-disable-next-line react/prop-types
function CategoryCards({ categoryId }) {
  const [currentSort, setCurrentSort] = useState("price-asc");
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductsByCategory(categoryId);
        setProducts(response.products);
        setCategoryName(response.category);
        console.log("Ürünler:", response.products);
      } catch (error) {
        console.error("Ürünler yüklenirken hata:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

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
        {products.map((product) => (
          <div key={product._id} className="col-md-3 mb-4">
            <div className="category-cards container">
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
                <button className="buy-button-category-cards">İncele</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryCards;
