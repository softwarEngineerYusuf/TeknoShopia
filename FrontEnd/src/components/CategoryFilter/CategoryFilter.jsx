import { useState, useEffect } from "react";
import "./CategoryFilter.css";
import { Checkbox, InputNumber, Radio, Button, Spin } from "antd";
import { getAllBrands } from "../../allAPIs/brand";

// eslint-disable-next-line react/prop-types
const BrandFilter = ({ brands, selectedBrands, onChange }) => (
  <div className="brand-filter-ctgrfltr">
    <Checkbox.Group value={selectedBrands} onChange={onChange}>
      {brands.map((brand) => (
        <div key={brand._id}>
          <Checkbox value={brand._id}>
            {brand.logo?.url ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <img
                  src={brand.logo.url}
                  alt={brand.name}
                  style={{
                    width: "20px",
                    height: "20px",
                    objectFit: "contain",
                  }}
                />
                {brand.name}
              </div>
            ) : (
              brand.name
            )}
          </Checkbox>
        </div>
      ))}
    </Checkbox.Group>
  </div>
);

// eslint-disable-next-line react/prop-types
const PriceFilter = ({ priceRange, setPriceRange }) => {
  const priceRanges = [
    [0, 10000],
    [10000, 20000],
    [20000, 30000],
    [30000, 40000],
    [40000, 150000],
  ];

  return (
    <div className="price-filter-ctgrfltr">
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
        onChange={(e) => setPriceRange(e.target.value)}
      >
        {priceRanges.map((range) => (
          <div key={range.join("-")} style={{ marginBottom: "8px" }}>
            <Radio value={range}>
              {range[1] ? `${range[0]} - ${range[1]}` : `${range[0]}+`}
            </Radio>
          </div>
        ))}
      </Radio.Group>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
function CategoryFilter({ onFilterChange }) {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 150000]);

  useEffect(() => {
    const fetchBrands = async () => {
      const brandsData = await getAllBrands();
      setBrands(brandsData);
      setLoading(false);
    };

    fetchBrands();
  }, []);

  const handleFilter = () => {
    const newFilters = {
      brands: selectedBrands,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    };

    console.log("Filtreleme Bilgileri:", {
      brandIds: selectedBrands,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });

    onFilterChange(newFilters);
  };

  if (loading) {
    return (
      <div className="category-filter-ctgrfltr">
        <div
          className="filter-container-ctgrfltr"
          style={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <Spin />
        </div>
      </div>
    );
  }

  return (
    <div className="category-filter-ctgrfltr">
      <div className="filter-container-ctgrfltr">
        <h4 style={{ marginBottom: "0.6rem" }}>Brands</h4>
        <BrandFilter
          brands={brands}
          selectedBrands={selectedBrands}
          onChange={setSelectedBrands}
        />

        <PriceFilter priceRange={priceRange} setPriceRange={setPriceRange} />

        <Button
          type="primary"
          style={{
            borderRadius: "20px",
            backgroundColor: "#003da6",
            width: "100%",
            marginTop: "16px",
          }}
          onClick={handleFilter}
        >
          Filter
        </Button>
      </div>
    </div>
  );
}

export default CategoryFilter;
