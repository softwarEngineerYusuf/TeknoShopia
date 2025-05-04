import { useState } from "react";
import "./Category.css";
import CategoryCards from "../../components/CategoryCards/CategoryCards";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import { useParams } from "react-router-dom";

function Category() {
  const { id } = useParams();
  const [filters, setFilters] = useState({});

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Burada filtre değişikliklerini işleyebilirsiniz
    // Örneğin, filtreleme yapılmış ürünleri yeniden çekebilirsiniz
    console.log("Yeni filtreler:", newFilters);
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
