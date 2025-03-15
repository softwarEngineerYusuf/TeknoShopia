import React from "react";
import "./Category.css";
import CategoryCards from "../../components/CategoryCards/CategoryCards";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";

function Category() {
  return (
    <div className="container">
      <div className="subContainer">
        <div className="categoryFilter">
          <CategoryFilter />
        </div>
        <div className="categoryProducts">
            <CategoryCards />
        </div>
      </div>
    </div>
  );
}

export default Category;
