import React, { useState } from "react";
import "./CategoryFilter.css";
import { Checkbox, InputNumber, Radio } from "antd";

const BrandFilter = ({ brands, selectedBrands, onChange }) => {
  return (
    <div className="brand-filter">
      <Checkbox.Group value={selectedBrands} onChange={onChange}>
        {brands.map((brand) => (
          <div key={brand} style={{ marginBottom: "8px" }}>
            <Checkbox value={brand}>{brand}</Checkbox>
          </div>
        ))}
      </Checkbox.Group>
    </div>
  );
};

const PriceFilter = ({ priceRange, setPriceRange }) => {
  const handleRangeChange = (selectedRange) => {
    // Seçilen aralığı min ve max olarak ayarlama
    setPriceRange(selectedRange);
  };

  return (
    <div className="price-filter">
      <h4 style={{ marginBottom: "0.6rem" }}>Price</h4>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <InputNumber
          min={0}
          max={150000}
          value={priceRange[0]}
          onChange={(value) => setPriceRange([value || 0, priceRange[1]])}
          placeholder="Min"
        />
        <span style={{ margin: "0 10px" }}>-</span>
        <InputNumber
          min={0}
          max={150000}
          value={priceRange[1]}
          onChange={(value) => setPriceRange([priceRange[0], value || 150000])}
          placeholder="Max"
        />
      </div>

      <Radio.Group
        value={priceRange}
        onChange={(e) => handleRangeChange(e.target.value)}
      >
        {[
          [0, 10000],
          [10000, 20000],
          [20000, 30000],
          [30000, 40000],
          [40000],
        ].map((range) => (
          <div key={range.join("-")} style={{ marginBottom: "8px" }}>
            <Radio value={range}>{`${range[0]} - ${range[1]}`}</Radio>
          </div>
        ))}
      </Radio.Group>
    </div>
  );
};

function CategoryFilter() {
  const [brands] = useState([
    "Apple",
    "Samsung",
    "Xiaomi",
    "Huawei",
    "Oppo",
    "Vivo",
    "Xiaomi",
    "Xiaomi",
    "Xiaomi",
    "Xiaomi",
    "Xiaomi",
    "Xiaomi",
    "Xiaomi",
    "Xiaomi",
    "Xiaomi",
    "Xiaomi",
    "Xiaomi",
  ]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);

  return (
    <div className="category-filter">
      <div className="filter-container">
        <h4 style={{ marginBottom: "0.6rem" }}>Brands</h4>
        <BrandFilter
          brands={brands}
          selectedBrands={selectedBrands}
          onChange={setSelectedBrands}
        />
        <PriceFilter priceRange={priceRange} setPriceRange={setPriceRange} />
        <button type="button" style={{borderRadius:'20px', backgroundColor:'#003da6'}} className="btn btn-primary container">
          Filter
        </button>
      </div>
    </div>
  );
}

export default CategoryFilter;
