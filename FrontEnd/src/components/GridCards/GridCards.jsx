import React from "react";
import "./GridCards.css";

const GridCards = () => {
  return (
    <div className="grid-container">
      {/* Üst satır */}
      <div className="top-row">
        <img src="https://cdn.shopify.com/s/files/1/0559/9235/2977/files/Hassas-iPath_-Lazer-Navigasyon.jpg?v=1708423323" alt="Üst Resim 1" />
        <img src="https://boost-lifestyle.co/cdn/shop/files/Sonic.webp?v=1717165532&width=3240" alt="Üst Resim 2" />
        <img src="https://xrockergaming.com/cdn/shop/files/2.0714401copy_1000x1000_crop_center.webp?v=1724850525" alt="Üst Resim 3" />
      </div>

      {/* Alt satır */}
      <div className="bottom-row">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR11SKbimicMDThlwgZWR09_ZjK8wiuH8FeDJxqsHB0oPwfh0jPQmLsVez9xTGtGxiaJy0&usqp=CAU" alt="Alt Resim 1" />
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT62WtJsFITf3MMDd5B_F8z0LDrzLMnsXjLSg&s" alt="Alt Resim 2" />
      </div>
    </div>
  );
};

export default GridCards;
