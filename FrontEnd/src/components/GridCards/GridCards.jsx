import React from "react";
import "./GridCards.css";
import img1 from "../../assets/Ad1.jpg";
import img2 from "../../assets/Ad2.jpg";
import img3 from "../../assets/Ad3.jpg";

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
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR11SKbimicMDThlwgZWR09_ZjK8wiuH8FeDJxqsHB0oPwfh0jPQmLsVez9xTGtGxiaJy0&usqp=CAU" alt="Alt Resim 1" />
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT62WtJsFITf3MMDd5B_F8z0LDrzLMnsXjLSg&s" alt="Alt Resim 2" />
      </div>
    </div>
  );
};

export default GridCards;
