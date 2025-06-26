import "./Navbar2.css";
import Chatbot from "../../assets/chatbot.png";
import { useState, useEffect } from "react";
import {
  getAllMainCategories,
  getSubCategoriesByMainCategoryId,
} from "../../allAPIs/category";

function Navbar2() {
  const [categories, setCategories] = useState([]); // Ana kategori + alt kategori verisi
  const [activeCategory, setActiveCategory] = useState(null); // Açılan kategori

  // Sayfa yüklenince tüm kategorileri ve alt kategorileri çek
  useEffect(() => {
    async function fetchCategories() {
      try {
        const mainCategories = await getAllMainCategories(); // Ana kategorileri çek
        const categoriesWithSub = await Promise.all(
          mainCategories.map(async (category) => {
            const subCategories = await getSubCategoriesByMainCategoryId(
              category._id
            );
            return { ...category, subCategories }; // Ana kategori + Alt kategoriler
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
          <div
            key={category._id}
            className="category"
            onMouseEnter={() => setActiveCategory(category._id)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <a
              href={`/category/${category._id}`}
              className={activeCategory === category._id ? "active" : ""}
            >
              {category.name}
            </a>

            {activeCategory === category._id &&
              category.subCategories.length > 0 && (
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
