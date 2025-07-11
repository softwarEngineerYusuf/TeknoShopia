import "../Home/Home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AdCarousel from "../../components/AdCorousel/AdCorousel.jsx";
import DiscountsCarousel from "../../components/DiscountsCorousel/DiscountsCorousel.jsx";
// import Navbar2 from "../../components/Navbar2/Navbar2.jsx";
import TopPicks from "../../components/TopPicks/TopPicks.jsx";
import GridCards from "../../components/GridCards/GridCards.jsx";
import Brands from "../../components/Brands/Brands.jsx";

function Home() {
  const images = [
    "https://cdn.vatanbilgisayar.com/Upload/BANNER//0banner/2024/011/apple-iphone13-1-11-24-web.jpg",
    "https://cdn.vatanbilgisayar.com/Upload/BANNER//0banner/2025/006/samsung-tv-10-6-25-web1.jpg",
    "https://cdn.vatanbilgisayar.com/Upload/BANNER//0banner/2025/004/lg-tv-8-4-25-web.jpg",
    "https://cdn.vatanbilgisayar.com/Upload/BANNER//0banner/2025/005/huawei-watch-fit4-15-5-25-web1.jpg",
    "https://cdn.vatanbilgisayar.com/Upload/BANNER//0banner/2025/005/macbook-air-m4-22-5-25-web1.jpg",
    "https://cdn.vatanbilgisayar.com/Upload/BANNER//0banner/2025/005/genel-web-5-5-25.jpg"
  ];

  // Her bir `carousel-item` içinde 4 kart olacak

  return (
    <div>
      {/* <div className="navbar2Home">
        <Navbar2 />
      </div> */}

      <div className="allMainHomePage">
        {/* Reklam Carousel */}
        <div className="corouselOnHomePage">
          <AdCarousel images={images} />
        </div>

        <div className=" TopPicksOnHomePage ">
          <TopPicks />
        </div>

        {/* Discounts Slider */}
        <div className="container DiscountsTextOnHomePage "></div>
        <div className="DiscountsCarouselOnHomePage">
          <DiscountsCarousel />
        </div>
      </div>
      <div className="GridCardsOnHomePage">
        <GridCards />
      </div>
      <div className="BrandsOnHomePage">
        <Brands />
      </div>
    </div>
  );
}

export default Home;
