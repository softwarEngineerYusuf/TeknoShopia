import React from "react";
import "./Category.css";
import CategoryCards from "../../components/CategoryCards/CategoryCards";

function Category() {
  return (
    <div className="container">
      <div className="subContainer">
        <div className="categoryFilter">filter</div>
        <div className="categoryProducts">
            <CategoryCards />
        </div>
      </div>
    </div>
  );
}

export default Category;
