import "./TopPicksMoreFilter.css";
import React, { useState } from "react";
import { Checkbox } from "antd";

const TopPicksMoreFilter = ({ selectedBrands, setSelectedBrands }) => {
  const [brands] = useState([
    "Apple",
    "Samsung",
    "Xiaomi",
    "Huawei",
    "Oppo",
    "Vivo",
    "OnePlus",
    "Nokia",
    "Sony",
    "LG",
    "Motorola",
    "Google",
    "HTC",
    "Lenovo",
    "Asus",
    "Realme",
    "Honor",
    "ZTE",
    "TCL",
    "Alcatel",
    "Panasonic",
  ]);

  return (
    <div className="top-picks-more-filter">
      <h4 style={{ marginBottom: "0.6rem" }}>Brands</h4>
      <Checkbox.Group value={selectedBrands} onChange={setSelectedBrands}>
        {brands.map((brand) => (
          <div key={brand} style={{ marginBottom: "8px" }}>
            <Checkbox value={brand}>{brand}</Checkbox>
          </div>
        ))}
      </Checkbox.Group>
    </div>
  );
};

export default TopPicksMoreFilter;
