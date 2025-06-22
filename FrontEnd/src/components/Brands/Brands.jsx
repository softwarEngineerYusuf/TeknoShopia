import React, { useEffect, useState } from "react";
import "./Brands.css";
import { useNavigate } from "react-router-dom";
import { getAllBrands } from "../../allAPIs/brand";
import { Spin } from "antd";
const Brands = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  // Duplicate the brands array to create infinite scrolling effect
  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      const data = await getAllBrands();
      setBrands(data);
      setLoading(false);
    };
    fetchBrands();
  }, []);

  if (loading) {
    return <Spin tip="Markalar Yükleniyor..." />;
  }

  // Sonsuz kaydırma efekti için markaları ikiye katlayalım
  const duplicatedBrands = brands.length > 0 ? [...brands, ...brands] : [];

  return (
    <div className="brand-carousel-container">
      <h2 className="brand-carousel-title">Brands</h2>
      <div className="brand-carousel-track">
        {duplicatedBrands.map((brand, index) => (
          // Key için hem _id hem de index kullanarak benzersiz olmasını sağlıyoruz
          <div className="brand-carousel-item" key={`${brand._id}-${index}`}>
            <img
              // API'den gelen logo URL'sini kullanıyoruz
              src={brand.logo.url}
              alt={`${brand.name} logo`}
              className="brand-logo"
              title={brand.name}
              style={{ cursor: "pointer" }}
              // Dinamik route'a yönlendiriyoruz
              onClick={() => navigate(`/brands/${brand._id}`)}
            />
            <h1
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "0.5rem",
              }}
            >
              {brand.name}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brands;
