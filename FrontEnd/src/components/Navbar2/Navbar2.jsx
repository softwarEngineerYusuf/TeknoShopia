import "./Navbar2.css";
import Chatbot from "../../assets/chatbot.png";
import { useState } from "react";

function Navbar2() {
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [
    { name: "TV", subcategories: ["Samsung", "Philips", "Vestel", "LG", "Grundig", "Toshiba", "Sunny", "Beko"] },
    { name: "Telephone", subcategories: ["Apple", "Samsung", "Huawei", "Xiaomi", "Oppo", "General Mobile"] },
    { name: "Computer", subcategories: ["Apple",  "Samsung", "Monster", "Huawei", "Lenovo", "Asus","Casper"] },
    { name: "Smart Watch", subcategories: ["Apple", "Samsung", "Huawei", "Xiaomi"] },
    { name: "Camera", subcategories: ["Canon", "Nikon", "Sony", "Everest", "Insta360"] },
    { name: "Speaker", subcategories: ["JBL", "Marshall", "Logitech","Apple", "Anker"] },
    { name: "Printer", subcategories: ["Asus", "Canon", "Epson", "HP"] },
    { name: "Game Console", subcategories: ["Sony", "Microsoft", "Nintendo", "Razer"] },
    { name: "Vacuum Cleaner", subcategories: ["Dyson", "Bosch", "Roborock", "Philips", "Xiaomi", "Fakir", "Shark"] },
    { name: "Earphones", subcategories: ["Apple", "Samsung", "Steelseries", "Logitech", "Oppo", "Marshall"] },
    { name: "Coffee Machine", subcategories: ["Philips", "Arzum", "Nespresso", "Siemens", "Grundig", "Fakir"] },
  ];

  return (
    <div className="Navbar2All">
      <div className="Navbar2Links">
        {categories.map((category, index) => (
          <div
            key={index}
            className="category"
            onMouseEnter={() => setActiveCategory(category.name)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <a href="/category" className={activeCategory === category.name ? "active" : ""}>
              {category.name}
            </a>
            {activeCategory === category.name && (
              <div className="subcategories">
                {category.subcategories.map((sub, subIndex) => (
                  <a key={subIndex} href="#">{sub}</a>
                ))}
              </div>
            )}
          </div>
        ))}
        <a href="#">
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