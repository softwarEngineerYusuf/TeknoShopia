import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star"; // Örnek için kalabilir
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Empty } from "antd";
import { useCompare } from "../../context/CompareContext";
import "./Compare.css";
import Navbar2 from "../../components/Navbar2/Navbar2.jsx";
import { useMemo, useState } from "react";

// TabPanel ve a11yProps fonksiyonları aynı kalacak
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const Compare = () => {
  const theme = useTheme();
  const { compareList } = useCompare();

  // Favori butonu için state (her ürün için ayrı)
  const [favorites, setFavorites] = useState(compareList.map(() => false));
  const toggleFavorite = (index) => {
    setFavorites((prev) => {
      const newFavs = [...prev];
      newFavs[index] = !newFavs[index];
      return newFavs;
    });
  };

  const features = useMemo(() => {
    // ... (bu kısımda değişiklik yok, zaten dinamik)
    if (compareList.length < 2) return [];
    const [p1, p2] = compareList;
    const allKeys = new Set([
      ...Object.keys(p1.attributes || {}),
      ...Object.keys(p2.attributes || {}),
    ]);
    return Array.from(allKeys).map((key) => ({
      title: key,
      values: [
        p1.attributes?.[key] || "Belirtilmemiş",
        p2.attributes?.[key] || "Belirtilmemiş",
      ],
    }));
  }, [compareList]);

  // Bu fonksiyon da dinamik olduğu için bir değişiklik gerekmiyor.
  const renderAllRows = () => {
    if (features.length === 0) {
      return <Empty description="Karşılaştırılacak özellik bulunamadı." />;
    }
    return features.map((feature, index) => (
      <div className="feature-row" key={index}>
        <div className="feature-title">{feature.title}</div>
        <div className="feature-value">{feature.values[0]}</div>
        <div className="feature-value">{feature.values[1]}</div>
      </div>
    ));
  };

  if (compareList.length < 2) {
    return (
      <Box
        className="compare-container"
        style={{ textAlign: "center", marginTop: "50px" }}
      >
        <Navbar2 />
        <Empty description="Lütfen karşılaştırmak için en az 2 ürün seçin." />
      </Box>
    );
  }

  // Yeterli ürün varsa, ilk iki ürünü değişkene atayalım
  const [product1, product2] = compareList;

  return (
    <Box className="compare-container">
      <div className="navbar2Home">
        <Navbar2 />
      </div>

      <div className="compare-cards-wrapper">
        {/* compareList üzerinden map ile dinamik olarak kartları oluştur */}
        {compareList.map((product, index) => (
          <div key={product.id} className="compare-card">
            <button
              className="favorite-button"
              onClick={() => toggleFavorite(index)}
              aria-label="Favorilere ekle/kaldır"
            >
              {favorites[index] ? (
                <HeartFilled style={{ fontSize: "24px", color: "red" }} />
              ) : (
                <HeartOutlined style={{ fontSize: "24px" }} />
              )}
            </button>
            <img
              src={product.image}
              alt={product.name}
              className="card-image"
            />
            <div className="card-details">
              <p className="product-name">{product.name}</p>
              <div className="rating-price" style={{ gap: 6 }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: "#ffb300",
                  }}
                >
                  <StarIcon style={{ fontSize: "1.3em", marginRight: 2 }} />
                  <span
                    style={{
                      fontSize: "1.1em",
                      color: "#232526",
                      fontWeight: 700,
                      marginLeft: 2,
                    }}
                  >
                    {product.ratings?.toFixed(1) || "0.0"}
                  </span>
                </span>
                <p className="product-price">
                  {product.discountedPrice
                    ? `${Math.round(product.discountedPrice)}`
                    : `${product.price} `}
                </p>
              </div>
              <button className="buy-button">SEPETE EKLE</button>
            </div>
          </div>
        ))}
      </div>

      <AppBar position="static" className="compare-tabs">
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px 0",
          }}
        >
          <span
            style={{
              flexGrow: 2,
              fontWeight: "bold",
              fontSize: "1.1rem",
              color: "#fff",
              textAlign: "center",
              letterSpacing: "0.9px",
            }}
          >
            All Features
          </span>
        </div>
      </AppBar>

      {/* --- DİNAMİK ÖZELLİK TABLOLARI --- */}
      <TabPanel value={1} index={1} dir={theme.direction}>
        <div className="feature-table">
          {/* Dinamik Tablo Başlığı */}
          <div className="feature-row header">
            <div className="feature-title">Özellik</div>
            <div className="feature-value">{product1.name}</div>
            <div className="feature-value">{product2.name}</div>
          </div>
          {/* Sadece tüm özellikleri gösteren fonksiyonu çağırıyoruz */}
          {renderAllRows()}
        </div>
      </TabPanel>
    </Box>
  );
};
export default Compare;
