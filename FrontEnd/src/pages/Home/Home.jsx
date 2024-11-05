import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../Home/Home.css';

function Home() {
  return (
    <div>

      <div className='allMainHomePage'>

        <div className='corouselOnHomePage'>
          <div id="carouselExample" className="carousel slide">
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src="https://cdn.vatanbilgisayar.com/Upload/BANNER//0banner/2024/011/apple-iphone13-1-11-24-web.jpg" className="d-block w-100" alt="..." />
              </div>
              <div className="carousel-item">
                <img src="https://cdn.vatanbilgisayar.com/Upload/BANNER//0banner/2024/011/apple-iphone13-1-11-24-web.jpg" className="d-block w-100" alt="..." />
              </div>
              <div className="carousel-item">
                <img src="https://cdn.vatanbilgisayar.com/Upload/BANNER//0banner/2024/011/apple-iphone13-1-11-24-web.jpg" className="d-block w-100" alt="..." />
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>

        <div className='DiscountsTextOnHomePage'>
          <p>Discounts</p>
        </div>

        <div className="discountsListOnHomePage">
  <div className="card" style={{ width: "18rem" }}>
    <img
      src="https://cdn.vatanbilgisayar.com/Upload/PRODUCT/apple/thumb/129885-1_large.jpg?_gl=1*u15i64*_gcl_au*NTAwMzQ5NTI0LjE3Mjg5MjM5Nzg."
      className="card-img-top"
      alt="..."
    />
    <div className="card-body">
      <p className="card-text">Apple iPhone 13 128GB</p>
      <div className="pricesOnDiscountsList">
        <div className="canceledPriceOnDiscound">
          <p>500$</p>
        </div>
        <div className="lastPriceOnDiscound">
          <p>450$</p>
        </div>
      </div>
    </div>
  </div>
</div>

      </div>

    </div>
  );
}

export default Home;
