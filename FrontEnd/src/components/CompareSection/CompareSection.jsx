import "./CompareSection.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useCompare } from "../../context/CompareContext";

// eslint-disable-next-line react/prop-types
function CompareSection() {
  const { compareList, removeFromCompare, clearCompareList } = useCompare();
  const navigate = useNavigate();
  const location = useLocation();
  const handleCompare = () => {
    navigate("/compare");
  };
  if (compareList.length === 0 || location.pathname === "/compare") {
    return null;
  }
  return (
    <div className="compare-section">
      <h2>Compare List ({compareList.length}/2)</h2>
      <div className="compare-items-wrapper">
        <div className="compare-items">
          {compareList.map((product) => (
            <div key={product.id} className="compare-item">
              <button
                className="remove-btn"
                onClick={() => removeFromCompare(product.id)}
                title="Remove from list"
              >
                ×
              </button>
              <img
                src={product.image}
                alt={product.name}
                className="compare-item-image"
              />
              <h3>{product.name}</h3>
              <p>{product.price}</p>
            </div>
          ))}
          {/* Listede 2'den az ürün varsa boş kutucuklar göster */}
          {[...Array(2 - compareList.length)].map((_, index) => (
            <div
              key={`placeholder-${index}`}
              className="compare-item placeholder"
            >
              <p>Add a product</p>
            </div>
          ))}
        </div>
        <div className="compare-actions">
          <button
            className="action-btn compare"
            onClick={handleCompare}
            disabled={compareList.length < 2} // 2'den az ürün varsa butonu devre dışı bırak
          >
            Compare
          </button>
          <button className="action-btn clear" onClick={clearCompareList}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompareSection;
