import { useEffect, useState } from "react";
import "./TopPicksMoreCards.css";
import "bootstrap/dist/css/bootstrap.min.css";
import StarIcon from "@mui/icons-material/Star";
import SortIcon from "@mui/icons-material/Sort";
import { Dropdown, Menu, Space } from "antd";
import { getTopPicksProducts } from "../../allAPIs/product"; // API çağrısını içe aktar
import { HeartOutlined, HeartFilled } from "@ant-design/icons";

function TopPicksMoreCards({ selectedBrands }) {
  const [currentSort, setCurrentSort] = useState("price-asc");
  const [products, setProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getTopPicksProducts(selectedBrands);
      setProducts(data);
      setFavorites(Array(data.length).fill(false));
      const sorted = [...data].sort((a, b) =>
        currentSort === "price-asc" ? a.price - b.price : b.price - a.price
      );
      setSortedProducts(sorted);
    };

    fetchProducts();
  }, [selectedBrands, currentSort]);

  const handleSortChange = (sortType) => {
    setCurrentSort(sortType);
    const sorted = [...products].sort((a, b) => {
      if (sortType === "price-asc") return a.price - b.price;
      if (sortType === "price-desc") return b.price - a.price;
      return 0;
    });
    setSortedProducts(sorted);
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
        <Menu.Item key="price-asc">Price: Low-High</Menu.Item>
        <Menu.Item key="price-desc">Price High-Low</Menu.Item>
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

  const cards = sortedProducts.map((product, index) => (
    <div key={product._id} className="col-md-3 mb-4">
      <div className="top-picks-more-cards container" style={{ position: "relative" }}>
        <button
          className="favorite-button"
          onClick={() => toggleFavorite(index)}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "white",
            border: "none",
            borderRadius: "50%",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            zIndex: 2,
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
        >
          {favorites[index] ? (
            <HeartFilled style={{ fontSize: 24, color: "red" }} />
          ) : (
            <HeartOutlined style={{ fontSize: 24, color: "#bbb" }} />
          )}
        </button>
        <img
          src={product.mainImage}
          alt={product.name}
          className="card-image-top-picks-more-cards"
        />
        <div className="card-details-top-picks-more-cards">
          <p className="product-name-top-picks-more-cards">{product.name}</p>
          <div
            className="d-flex justify-content-between"
            style={{ padding: "0rem 1rem" }}
          >
            <div className="rating-top-picks-more-cards">
              <StarIcon />
              <p>4.8</p>
            </div>
            <div>
              <p style={{ color: "red", textDecoration: "line-through" }}>
                ₺{product.oldPrice?.toFixed(2) || "1999.00"}
              </p>
              <p className="product-price-top-picks-more-cards">
                ₺{product.price.toFixed(2)}
              </p>
            </div>
          </div>
          <button className="buy-button-top-picks-more-cards">İncele</button>
        </div>
      </div>
    </div>
  ));

  return (
    <div className="container">
      <div className="top-picks-more-cards-and-sort d-flex justify-content-between align-items-center">
        <h2 className="top-picks-more-cards-title">Telephones</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.9rem", color: "#666" }}>Sort:</span>
          <ProductSort />
        </div>
      </div>
      <div className="row">{cards}</div>
    </div>
  );
}

export default TopPicksMoreCards;
