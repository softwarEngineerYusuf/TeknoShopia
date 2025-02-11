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

  const cardsData = [
    {
      id: 1,
      title: "Apple iPhone 13 128GB",
      price: "500$",
      discountedPrice: "450$",
      imgSrc:
        "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/129885-1_large.jpg",
    },
    {
      id: 2,
      title: "Apple iPhone 12 64GB",
      price: "400$",
      discountedPrice: "450$",
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
      discountedPrice: "450$",
      imgSrc:
        "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/135150-1-10_small.jpg",
    },
    {
      id: 5,
      title: "Apple iPhone 15 128GB",
      price: "700$",
      discountedPrice: "450$",
      imgSrc:
        "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/140315-1-1_small.jpg",
    },
    {
      id: 6,
      title: "Apple iPhone 16 128GB",
      price: "800$",
      discountedPrice: "450$",
      imgSrc:
        "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/1-246_small.jpg",
    },
    {
      id: 7,
      title: "Samsung S24 256GB",
      price: "500$",
      discountedPrice: "450$",
      imgSrc:
        "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/samsung/thumb/1-116_small.jpg",
    },
    {
      id: 8,
      title: "Samsung S24+ 256GBGB",
      price: "550$",
      discountedPrice: "450$",
      imgSrc:
        "https://cdn.vatanbilgisayar.com/Upload/PRODUCT/samsung/thumb/1-113_small.jpg",
    },
  ];

  // Kartları 4'erli gruplar halinde bölen fonksiyon
  const chunkArray = (array, chunkSize) => {
    const results = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      results.push(array.slice(i, i + chunkSize));
    }
    return results;
  };

  const cardGroups = chunkArray(cardsData, 4); // Her bir `carousel-item` içinde 4 kart olacak

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

        <div
          className="TopPicksOnHomePage container"
          style={{ border: "1px solid black" }}
        >
          <TopPicks />
        </div>

        {/* Discounts Slider */}
        <div className="DiscountsTextOnHomePage">
          <p>Discounts</p>
        </div>
        <DiscountsCarousel cardGroups={cardGroups} />
      </div>
      <div className="GridCardsOnHomePage">
        <GridCards />
      </div>
    </div>
  );
}

export default Home;
