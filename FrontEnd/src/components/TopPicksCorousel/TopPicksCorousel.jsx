import React from 'react';

function TopPicksCorousel({ cardGroups }) {
  return (
    <div id="TopPicksCorousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        {cardGroups.map((group, index) => (
          <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
            <div className="container">
              <div className="row">
                {group.map((card) => (
                  <div key={card.id} className="col-md-3">
                    <div className="card" style={{ width: "100%" }}>
                      <img src={card.imgSrc} className="card-img-top" alt={card.title} />
                      <div className="card-body">
                        <p className="card-text">{card.title}</p>
                        <div className="pricesOnDiscountsList">
                          <div className="canceledPriceOnDiscound">
                            <p>{card.price}</p>
                          </div>
                          <div className="lastPriceOnDiscound">
                            <p>{card.discountedPrice}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#discountsCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#discountsCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default TopPicksCorousel;
