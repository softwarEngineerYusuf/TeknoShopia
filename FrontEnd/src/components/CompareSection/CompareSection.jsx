import "./CompareSection.css";

// eslint-disable-next-line react/prop-types
function CompareSection({ compareList }) {
  return (
    <div className="compare-section">
      <h2>Karşılaştırma Listesi</h2>
      <div className="compare-items">
        {compareList.map(
          (
            product // map parametrelerinden index'i kaldırdık
          ) => (
            <div key={product.id} className="compare-item">
              {" "}
              {/* <<< key'i product.id olarak DEĞİŞTİRDİK */}
              <img
                src={product.image}
                alt={product.name}
                className="compare-item-image"
              />
              <h3>{product.name}</h3>
              <p>{product.price}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default CompareSection;
