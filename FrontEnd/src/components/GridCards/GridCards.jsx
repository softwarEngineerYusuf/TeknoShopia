import React from 'react'

function GridCards() {
  const imageGrid = "https://img-teknosa-sap.mncdn.com/home/widget/widget_jeneriktv_250120@2x.jpg";

  return (
    <div>
      <div className="container text-center">

        <div className="row ">
          <div className="col-4 col-md-4">
            <img src={imageGrid} alt="" />
          </div>
          <div className="col-4 col-md-4">  <img src={imageGrid} alt="" /></div>
          <div className="col-4 col-md-4">  <img src={imageGrid} alt="" /></div>
        </div>

        <div className="row mt-2">
          <div className="col-3 col-md-3">  <img src={imageGrid} alt="" /></div>
          <div className="col-3 col-md-3 ">  <img src={imageGrid} alt="" /></div>
          <div className="col-3 col-md-3 ">  <img src={imageGrid} alt="" /></div>
          <div className="col-3 col-md-3 ">  <img src={imageGrid} alt="" /></div>
        </div>
      </div>
    </div>
  )
}

export default GridCards
