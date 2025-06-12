import React, { useState } from 'react'
import './Brands.css' 
import "bootstrap/dist/css/bootstrap.min.css"
import StarIcon from "@mui/icons-material/Star";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import SortIcon from "@mui/icons-material/Sort";
import { Dropdown, Menu, Space } from "antd";

const brands = [
  { id: 1, name: "Apple", image: "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/0006-mlpg3tu-a_small.jpg", price: 45000, discountedPrice: 42200, rating: 4.8 },
  { id: 2, name: "Apple", image: "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/0008-mlpf3tu-a_small.jpg", price: 52000, discountedPrice: 48000, rating: 4.8 },
  { id: 3, name: "Apple", image: "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/1-295_small.jpg", price: 50440, discountedPrice: 45200, rating: 4.8 },
  { id: 4, name: "Apple", image: "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/0003-mpuf3tu-a_small.jpg", price: 50000, discountedPrice: 48899, rating: 4.8 },
  { id: 5, name: "Apple", image: "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/1-246_small.jpg", price: 50000, discountedPrice: 45000, rating: 4.8 },
  { id: 6, name: "Apple", image: "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/0006-mlpg3tu-a_small.jpg", price: 50000, discountedPrice: 55000, rating: 4.8 },
  { id: 7, name: "Apple", image: "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/0006-mlpg3tu-a_small.jpg", price: 50000, discountedPrice: 65000, rating: 4.8 },
  { id: 8, name: "Apple", image: "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/0006-mlpg3tu-a_small.jpg", price: 50000, discountedPrice: 70000, rating: 4.8 },
];

const imageBrand = "https://cdn.vatanbilgisayar.com/Upload/GENERAL/ter-ed-marka/apple.png";

function Brands() {
  const [currentSort, setCurrentSort] = useState("price-asc");
  const [sortedBrands, setSortedBrands] = useState([...brands]);
  // Favori durumlarını tutan state
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const handleSortChange = (sortType) => {
    setCurrentSort(sortType);
    let sorted = [...sortedBrands];
    if (sortType === "price-asc") {
      sorted.sort((a, b) => a.discountedPrice - b.discountedPrice);
    } else if (sortType === "price-desc") {
      sorted.sort((a, b) => b.discountedPrice - a.discountedPrice);
    }
    setSortedBrands(sorted);
  };

  // Favori toggle fonksiyonu (sadece görsel)
  const handleToggleFavorite = (id) => {
    setFavoriteIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
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
        <a onClick={e => e.preventDefault()}>
          <Space style={{ cursor: "pointer" }}>
            <SortIcon style={{ fontSize: "2rem", color: "#000", verticalAlign: "middle" }} />
          </Space>
        </a>
      </Dropdown>
    );
  };

  return (
    <div className="container-md">
      <div className="brands-cards-and-sort d-flex justify-content-between align-items-center">
       
        <h2 style={{marginBottom: "1rem"}} className="brands-cards-title">Apple </h2> <img src={imageBrand} alt="" />
        
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.9rem", color: "#666" }}>Sort:</span>
          <ProductSort />
        </div>
      </div>
      <div className="row">
        {sortedBrands.map((brand) => (
          <div className="col-md-3 mb-4" key={brand.id}>
            <div className="brands-cards container" style={{ position: "relative" }}>
              {/* Kalp ikonu */}
              <button
                className="favorite-btn-brands"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  zIndex: 2,
                  cursor: "pointer",
                  padding: 0,
                }}
                aria-label="Favorilere ekle"
                onClick={() => handleToggleFavorite(brand.id)}
              >
                {favoriteIds.has(brand.id) ? (
                  <HeartFilled style={{ fontSize: "24px", color: "red" }} />
                ) : (
                  <HeartOutlined style={{ fontSize: "24px" }} />
                )}
              </button>
              <img
                src={brand.image}
                alt={brand.name}
                className="card-image-brands-cards"
                style={{ height: "180px", objectFit: "contain", background: "#fff", width: "100%" }}
              />
              <div className="card-details-brands-cards text-center">
                <p className="product-name-brands-cards">{brand.name}</p>
                <div className="d-flex justify-content-between" style={{ padding: "0rem 1rem" }}>
                  <div className="rating-brands-cards" style={{ fontSize: "1.2rem" }}>
                    <StarIcon style={{ fontSize: "1.5rem", color: "#FFD700" }} />
                    <p style={{ margin: 0, fontWeight: "500", fontSize: "1.1rem" }}>{brand.rating}</p>
                  </div>
                  <div>
                    {brand.discountedPrice < brand.price ? (
                      <p style={{ color: "red", textDecoration: "line-through", fontSize: "1rem" }}>
                        ₺{brand.price.toFixed(2)}
                      </p>
                    ) : (
                      <p style={{ visibility: "hidden", fontSize: "1rem" }}>₺{brand.price.toFixed(2)}</p>
                    )}
                    <p className="product-price-brands-cards" style={{ fontSize: "1.2rem", fontWeight: "600" }}>
                      ₺{brand.discountedPrice.toFixed(2)}
                    </p>
                  </div>
                </div>
                <button className="buy-button-brands-cards">İncele</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Brands