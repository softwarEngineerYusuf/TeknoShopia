import React from "react";
import "./CompareSection.css";

function CompareSection({ compareList }) {
  return (
    <div className="compare-section">
      <h2>Karşılaştırma Listesi</h2>
      <div className="compare-items">
        {compareList.map((product, index) => (
          <div key={index} className="compare-item">
            <img src={product.image} alt={product.name} className="compare-item-image" />
            <h3>{product.name}</h3>
            <p>{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompareSection;
