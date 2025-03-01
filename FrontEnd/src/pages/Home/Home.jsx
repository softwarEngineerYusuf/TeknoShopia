import "../Home/Home.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AdCarousel from "../../components/AdCorousel/AdCorousel.jsx";
import DiscountsCarousel from "../../components/DiscountsCorousel/DiscountsCorousel.jsx";
import Navbar2 from "../../components/Navbar2/Navbar2.jsx";
import TopPicks from "../../components/TopPicks/TopPicks.jsx";
import GridCards from "../../components/GridCards/GridCards.jsx";

function Home() {
  const images = [
    "https://cdn.vatanbilgisayar.com/Upload/BANNER//0banner/2024/011/apple-iphone13-1-11-24-web.jpg",
    "https://cdn.vatanbilgisayar.com/Upload/BANNER//0banner/2024/011/apple-iphone13-1-11-24-web.jpg",
    "https://cdn.vatanbilgisayar.com/Upload/BANNER//0banner/2024/011/apple-iphone13-1-11-24-web.jpg",
  ];

  // Her bir `carousel-item` içinde 4 kart olacak

  return (
    <div>
      <div className="navbar2Home">
        <Navbar2 />
      </div>

      <div className="allMainHomePage">
        {/* Reklam Carousel */}
        <div className="corouselOnHomePage">
          <AdCarousel images={images} />
        </div>

        <div className="TopPicksOnHomePage container">
          <TopPicks />
        </div>

        {/* Discounts Slider */}
        <div className="DiscountsTextOnHomePage container">
          <p>Discounts</p>
        </div>
        <DiscountsCarousel />
      </div>
      <div className="GridCardsOnHomePage">
        <GridCards />
      </div>
    </div>
  );
}

export default Home;
