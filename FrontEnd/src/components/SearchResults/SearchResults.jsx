import React from "react";
import { Link } from "react-router-dom";
import "./SearchResults.css";

function SearchResults({ results, onResultClick }) {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <ul className="search-results-list">
      {results.map((product) => (
        <li key={product._id} className="search-result-item">
          <Link
            to={`/productDetail/${product._id}`}
            className="search-result-link"
            onClick={onResultClick}
          >
            <img
              src={product.mainImage}
              alt={product.name}
              className="search-result-image"
            />
            <span className="search-result-name">{product.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default SearchResults;
