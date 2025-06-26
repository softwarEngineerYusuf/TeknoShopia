import "./Navbar2.css";
import Chatbot from "../../assets/chatbot.png";
import { useState, useEffect } from "react";
import {
  getAllMainCategories,
  getSubCategoriesByMainCategoryId,
} from "../../allAPIs/category";

function Navbar2() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const mainCategories = await getAllMainCategories();
        const categoriesWithSub = await Promise.all(
          mainCategories.map(async (category) => {
            const subCategories = await getSubCategoriesByMainCategoryId(
              category._id
            );
            return { ...category, subCategories };
          })
        );
        setCategories(categoriesWithSub);
      } catch (error) {
        console.error("Kategoriler yüklenirken hata oluştu:", error);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="Navbar2All">
      <div className="Navbar2Links">
        {categories.map((category) => (
          <div key={category._id} className="category">
            <a href={`/category/${category._id}`}>{category.name}</a>
            {category.subCategories.length > 0 && (
              <div className="subcategories">
                {category.subCategories.map((sub) => (
                  <a key={sub._id} href={`/category/${sub._id}`}>
                    {sub.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
        <a href="/chatbot" className="chatbot-link">
          <img
            style={{ width: "50px", height: "50px" }}
            src={Chatbot}
            alt="Chatbot"
          />
        </a>
      </div>
    </div>
  );
}

export default Navbar2;
