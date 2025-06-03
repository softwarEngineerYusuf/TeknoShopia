import { useState, useEffect } from "react";
import "./TopPicksMoreFilter.css";
import { Checkbox, Spin } from "antd";
import { getAllBrands } from "../../allAPIs/brand";

const TopPicksMoreFilter = ({ selectedBrands, setSelectedBrands }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      const brandsData = await getAllBrands();
      setBrands(brandsData);
      setLoading(false);
    };
    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="top-picks-more-filter">
        <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
          <Spin />
        </div>
      </div>
    );
  }

  return (
    <div className="top-picks-more-filter">
      <h4 style={{ marginBottom: "0.6rem" }}>Brands</h4>
      <div className="brand-filter-toppicks">
        <Checkbox.Group value={selectedBrands} onChange={setSelectedBrands}>
          {brands.map((brand) => (
            <div key={brand._id}>
              <Checkbox value={brand._id}>
                {brand.logo?.url ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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
    </div>
  );
};

export default TopPicksMoreFilter;
