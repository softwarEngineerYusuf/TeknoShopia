import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import StarIcon from "@mui/icons-material/Star";
import "./DiscountsCorousel.css"; // Add a new CSS file for styling

function DiscountsCarousel() {
  const cardsData = [
    {
      id: 1,
      title: "Apple iPhone 13 128GB",
      price: "500$",
      discountedPrice: "600$",
      imgSrc:
        "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/129885-1_large.jpg",
    },
    {
      id: 2,
      title: "Apple iPhone 12 64GB",
      price: "400$",
      discountedPrice: "550$",
      imgSrc:
        "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/110622-1-1_small.jpg",
    },
    {
      id: 3,
      title: "Apple iPhone 11 64GB",
      price: "300$",
      discountedPrice: "450$",
      imgSrc:
        "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/113155-1-1_small.jpg",
    },
    {
      id: 4,
      title: "Apple iPhone 14 128GB",
      price: "600$",
      discountedPrice: "750$",
      imgSrc:
        "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/135150-1-10_small.jpg",
    },
    {
      id: 5,
      title: "Apple iPhone 15 128GB",
      price: "700$",
      discountedPrice: "850$",
      imgSrc:
        "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/140315-1-1_small.jpg",
    },
    {
      id: 6,
      title: "Apple iPhone 16 128GB",
      price: "800$",
      discountedPrice: "950$",
      imgSrc:
        "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/1-246_small.jpg",
    },
    {
      id: 7,
      title: "Samsung S24 256GB",
      price: "500$",
      discountedPrice: "350$",
      imgSrc:
        "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/samsung/thumb/1-116_small.jpg",
    },
    {
      id: 8,
      title: "Samsung S24+ 256GBGB",
      price: "550$",
      discountedPrice: "550$",
      imgSrc:
        "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/samsung/thumb/1-113_small.jpg",
    },
  ];

  // Ekran genişliğine göre ürün sayısını belirle
  const [itemsPerSlide, setItemsPerSlide] = useState(4);

  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth < 768) {
        setItemsPerSlide(1); // Küçük ekranlarda 1 ürün
      } else if (window.innerWidth < 992) {
        setItemsPerSlide(2); // Orta ekranlarda 2 ürün
      } else {
        setItemsPerSlide(4); // Büyük ekranlarda 4 ürün
      }
    };

    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  // Ürünleri belirlenen sayıda gruplara bölme
  const chunkArray = (array, size) => {
    return array.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(array.slice(i, i + size));
      return acc;
    }, []);
  };

  const groupedCards = chunkArray(cardsData, itemsPerSlide);

  return (
    <div
      id="carouselExampleFade"
      className="carousel slide carousel-fade"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        {groupedCards.map((group, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <div className="container">
              <div className="row">
                {group.map((card) => (
                  <div
                    key={card.id}
                    className="col-12 col-sm-6 col-md-6 col-lg-3"
                  >
                    <div className="card-discount-corousel container">
                      <img
                        src={card.imgSrc}
                        alt={card.title}
                        className="card-image-discount-corousel"
                      />
                      <div className="card-details-discount-corousel">
                        <p className="product-name-discount-corousel">{card.title}</p>
                        <div className="d-flex justify-content-between" style={{ padding: "0rem 1rem" }}>
                          <StarIcon />
                          <p className="product-price-discount-corousel">{card.discountedPrice}</p>
                        </div>
                        <button className="buy-button-discount-corousel">Satın Al</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleFade"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleFade"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default DiscountsCarousel;
