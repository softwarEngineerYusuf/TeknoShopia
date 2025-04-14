import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { HeartOutlined } from "@ant-design/icons";
import "./Compare.css";
import Navbar2 from "../../components/Navbar2/Navbar2.jsx";

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
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const features = [
    { title: "Sensörler", values: ["Hall Sensörü, İvmeölçer, Jiroskop, Ortam Işığı Sensörü, Sanal Yakınlık Sensörü", "İvmeölçer, Yakınlık Sensörü, Ortam Işığı Sensörü"] },
    { title: "İşlemci Türü", values: ["Exynos 1480", "Helio G85"] },
    { title: "İşlemci Hızı", values: ["2.75 GHz", "2.40"] },
    { title: "İşlemci Sayısı", values: ["8 Çekirdek", "8 Çekirdek"] },
    { title: "Ekran Boyutu", values: ["6,6 inch", "6,6 inch"] },
    { title: "Çözünürlük(Piksel)", values: ["1080 x 2340", "1080 x 2340"] },
    { title: "Ekran Yenileme Hızı", values: ["120 Hz", "80 Hz"] },
    { title: "Kamera Çözünürlük", values: ["50 MP+8 MP+5 MP", "50 MP+8 MP+5 MP"] },
    { title: "Arka Kamera Sayısı", values: ["4", "3"] },
    { title: "Otomatik Odaklama", values: ["VAR", "VAR"] },
    { title: "Ön Kamera Çözünürlüğü", values: ["32 MP", "13 MP"] },
    { title: "Video Kayıt Çözünürlüğü", values: ["4K, Ultra HD, FHD, HD", "4K, Ultra HD, FHD, HD"] },
    { title: "Pil Gücü", values: ["5000 mAh", "5000 mAh"] },
    { title: "Kablosuz Şarj", values: ["VAR", "YOK"] },
    { title: "Yüz Tanıma", values: ["VAR", "VAR"] },
    { title: "Suya Dayanıklılık", values: ["VAR", "VAR"] },
    { title: "Parmak İzi Okuyucu", values: ["VAR", "VAR"] },
    { title: "Dahili Hafıza", values: ["256 GB", "128 GB"] },
    { title: "Ram Boyutu", values: ["8 GB", "8 GB"] },
    { title: "Renk", values: ["Siyah", "Mavi"] },
    { title: "Garanti", values: ["24 Ay", "24 Ay"] },
    { title: "İşletim Sistemi", values: ["İos", "Android"] },
    { title: "Ağırlık", values: ["209 gr", "213 gr"] },
    { title: "Genişlik", values: ["78 mm", "77,4 mm"] },
    { title: "Kalınlık", values: ["8,2 mm", "8,2 mm"] },
  ];

  const renderFilteredRows = (filterType) => {
    return features
      .filter((feature) => {
        const [val1, val2] = feature.values;
        if (filterType === "all") return true;
        if (filterType === "same") return val1 === val2;
        if (filterType === "diff") return val1 !== val2;
        return true;
      })
      .map((feature, index) => (
        <div
          className={`feature-row ${index === 0 ? "header" : ""}`}
          key={index}
        >
          <div className="feature-title">{feature.title}</div>
          <div className="feature-value">{feature.values[0]}</div>
          <div className="feature-value">{feature.values[1]}</div>
        </div>
      ));
  };

  return (
    <Box className="compare-container">
      <div className="navbar2Home">
        <Navbar2 />
      </div>

      <div className="compare-cards-wrapper">
        {[0, 1].map((index) => (
          <div key={index} className="compare-card">
            <button className="favorite-button">
              <HeartOutlined style={{ fontSize: "20px" }} />
            </button>
            <img
              src="https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/129743-1_large.jpg"
              alt="Product"
              className="card-image"
            />
            <div className="card-details">
              <p className="product-name">iPhone 13 128 Gb Siyah</p>
              <div className="rating-price">
                <StarIcon />
                <p className="product-price">₺1,299.00</p>
              </div>
              <button className="buy-button">SEPETE EKLE</button>
            </div>
          </div>
        ))}
      </div>

      <AppBar position="static" className="compare-tabs">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Tüm Özellikler" {...a11yProps(0)} />
          <Tab label="Sadece Benzerlikler" {...a11yProps(1)} />
          <Tab label="Sadece Farklar" {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <div className="feature-table">
          {renderFilteredRows("all")}
        </div>
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <div className="feature-table">
          {renderFilteredRows("same")}
        </div>
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <div className="feature-table">
          {renderFilteredRows("diff")}
        </div>
      </TabPanel>
    </Box>
  );
};

export default Compare;