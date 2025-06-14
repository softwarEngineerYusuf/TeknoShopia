import React from "react";
import "./GridCards.css";
import img1 from "../../assets/Ad1.jpg";
import img2 from "../../assets/Ad2.jpg";
import img3 from "../../assets/Ad3.jpg";
import img4 from "../../assets/Ad4.jpg";
import img5 from "../../assets/Ad5.jpg";

const GridCards = () => {
  return (
    <div className="grid-container">
      {/* Üst satır */}
      <div className="top-row">
        <img src={img1} alt="Üst Resim 1" />
        <img src={img2} alt="Üst Resim 2" />
        <img src={img3} alt="Üst Resim 3" />
      </div>

      {/* Alt satır */}
      <div className="bottom-row">
        <img src={img4} alt="Alt Resim 1" />
        <img src={img5} alt="Alt Resim 2" />
      </div>
    </div>
  );
};

export default GridCards;
