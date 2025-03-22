import { useState, useEffect } from "react";
import { getDiscountedProducts } from "../../allAPIs/product"; // API fonksiyonunu ekledik
import "bootstrap/dist/css/bootstrap.min.css";
import StarIcon from "@mui/icons-material/Star";
import "./DiscountsCorousel.css";

function DiscountsCarousel() {
  const [products, setProducts] = useState([]);
  const [itemsPerSlide, setItemsPerSlide] = useState(4);

  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      const data = await getDiscountedProducts();
      setProducts(data);
    };

    fetchDiscountedProducts();
  }, []);

  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth < 768) {
        setItemsPerSlide(1);
      } else if (window.innerWidth < 992) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(4);
      }
    };

    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, []);

  const chunkArray = (array, size) => {
    return array.reduce((acc, _, i) => {
      if (i % size === 0) acc.push(array.slice(i, i + size));
      return acc;
    }, []);
  };

  const groupedCards = chunkArray(products, itemsPerSlide);

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
                {group.map((product) => (
                  <div
                    key={product._id}
                    className="col-12 col-sm-6 col-md-6 col-lg-3"
                  >
                    <div className="card-discount-corousel container">
                      <img
                        src={product.mainImage}
                        alt={product.title}
                        className="card-image-discount-corousel"
                      />
                      <div className="card-details-discount-corousel">
                        <p className="product-name-discount-corousel">
                          {product.name}
                        </p>
                        <div
                          className="d-flex justify-content-between"
                          style={{ padding: "0rem 1rem" }}
                        >
                          <StarIcon />
                          <p className="product-price-discount-corousel">
                            {product.discountedPrice}₺
                          </p>
                        </div>
                        <button className="buy-button-discount-corousel">
                          Satın Al
                        </button>
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
