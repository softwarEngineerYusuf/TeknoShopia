import { useState } from "react";
import "./Category.css";
import CategoryCards from "../../components/CategoryCards/CategoryCards";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import { useParams } from "react-router-dom";

function Category() {
  const { id } = useParams();
  const [filters, setFilters] = useState({
    brands: [],
    minPrice: 0,
    maxPrice: 150000,
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    console.log("Uygulanan Filtreler:", {
      brandIds: newFilters.brands,
      minPrice: newFilters.minPrice,
      maxPrice: newFilters.maxPrice,
    });
  };

  return (
    <div className="container">
      <div className="subContainer">
        <div className="categoryFilter">
          <CategoryFilter onFilterChange={handleFilterChange} />
        </div>
        <div className="categoryProducts">
          <CategoryCards categoryId={id} filters={filters} />
        </div>
      </div>
    </div>
  );
}

export default Category;
