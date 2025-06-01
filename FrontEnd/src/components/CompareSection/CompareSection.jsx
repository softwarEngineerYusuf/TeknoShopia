import "./CompareSection.css";

// eslint-disable-next-line react/prop-types
function CompareSection({ compareList }) {
  return (
    <div className="compare-section">
      <h2>Karşılaştırma Listesi</h2>
      <div className="compare-items-wrapper">
        <div className="compare-items">
          {compareList.map((product) => (
            <div key={product.id} className="compare-item">
              <button className="remove-btn">×</button>
              <img
                src={product.image}
                alt={product.name}
                className="compare-item-image"
              />
              <h3>{product.name}</h3>
              <p>{product.price}</p>
            </div>
          ))}
        </div>
        <div className="compare-actions">
          <button className="action-btn">Karşılaştır</button>
          <button className="action-btn">Temizle</button>
        </div>
      </div>
    </div>
  );
}

export default CompareSection;
