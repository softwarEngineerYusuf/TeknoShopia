import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { Empty, message } from "antd";
import { useCompare } from "../../context/CompareContext";
import "./Compare.css";
import { useMemo, useState, useEffect } from "react";

import { useAuth } from "../../context/AuthContext";
import {
  addProductToFavorites,
  removeProductFromFavorites,
  getFavoriteProductIds,
} from "../../allAPIs/favorites";

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

  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  useEffect(() => {
    if (user && user.id) {
      getFavoriteProductIds(user.id).then((ids) => {
        setFavoriteIds(new Set(ids));
      });
    } else {
      setFavoriteIds(new Set());
    }
  }, [user]);

  const handleToggleFavorite = async (productId) => {
    if (!user) {
      message.warning("Please log in to manage favorites.");
      return;
    }

    const isFavorite = favoriteIds.has(productId);
    try {
      if (isFavorite) {
        await removeProductFromFavorites(user.id, productId);
        setFavoriteIds((prev) => {
          const newIds = new Set(prev);
          newIds.delete(productId);
          return newIds;
        });
        message.success("Product removed from favorites.");
      } else {
        await addProductToFavorites(user.id, productId);
        setFavoriteIds((prev) => {
          const newIds = new Set(prev);
          newIds.add(productId);
          return newIds;
        });
        message.success("Product added to favorites.");
      }
    } catch (error) {
      message.error("An error occurred, please try again.");
    }
  };

  const features = useMemo(() => {
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

  const renderAllRows = () => {
    if (features.length === 0) {
      return <Empty description="No features found for comparison." />;
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
        <Empty description="Lütfen karşılaştırmak için en az 2 ürün seçin." />
      </Box>
    );
  }

  const [product1, product2] = compareList;

  return (
    <Box className="compare-container">
      <div className="compare-cards-wrapper">
        {compareList.map((product, index) => (
          <div key={product.id} className="compare-card">
            <button
              className="favorite-button"
              onClick={() => handleToggleFavorite(product.id)}
              aria-label="Favorilere ekle/kaldır"
            >
              {favoriteIds.has(product.id) ? (
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

              <button className="buy-button">ADD TO CART</button>
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

      <TabPanel value={1} index={1} dir={theme.direction}>
        <div className="feature-table">
          <div className="feature-row header">
            <div className="feature-title">Feature</div>
            <div className="feature-value">{product1.name}</div>
            <div className="feature-value">{product2.name}</div>
          </div>
          {renderAllRows()}
        </div>
      </TabPanel>
    </Box>
  );
};
export default Compare;
