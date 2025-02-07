import React from "react";
import "./TopPicks.css";
import StarRateIcon from "@mui/icons-material/StarRate";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function TopPicks() {
  const imageURL =
    "https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_133460515?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190";

  return (
    <div>
      
      <div className="top-picks-and-button">
        <div className="TopPicksText">
          Top Picks
        </div>
        <div>
          <button
            className="buttonShowMore"
            style={{ verticalAlign: "middle" }}
          >
            <span>Show More </span>
          </button>
        </div>
      </div>

      <div className="card-group top-picks">
        <div className="card top-picks-card" style={{height:'40vh'}}>
          <img src={imageURL} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">PHILIPS Erkek Bakım Seti Gri Siyah</h5>
            <p className="card-text" style={{ fontSize: "25px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ color: "yellow" }}>
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                </div>
                <div style={{ display: "flex" }}>
                  <p>599.00</p>
                  <p>TL</p>
                </div>
              </div>
            </p>
          </div>
          <div className="add-basket-button" style={{ display: "flex" }}>
            <Stack direction="row" spacing={2} style={{ width: "100%" }}>
              <Button variant="contained" color="success">
                Add Basket 
                <p style={{marginLeft:'8px'}}><ShoppingCartIcon/></p>
              </Button>
            </Stack>
          </div>
        </div>
        <div className="card top-picks-card" style={{height:'40vh'}}>
          <img src={imageURL} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">PHILIPS Erkek Bakım Seti Gri Siyah</h5>
            <p className="card-text" style={{ fontSize: "25px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ color: "yellow" }}>
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                </div>
                <div style={{ display: "flex" }}>
                  <p>599.00</p>
                  <p>TL</p>
                </div>
              </div>
            </p>
          </div>
          <div className="add-basket-button" style={{ display: "flex" }}>
            <Stack direction="row" spacing={2} style={{ width: "100%" }}>
              <Button variant="contained" color="success">
                Add Basket 
                <p style={{marginLeft:'8px'}}><ShoppingCartIcon/></p>
              </Button>
            </Stack>
          </div>
        </div>
        <div className="card top-picks-card" style={{height:'40vh'}}>
          <img src={imageURL} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">PHILIPS Erkek Bakım Seti Gri Siyah</h5>
            <p className="card-text" style={{ fontSize: "25px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ color: "yellow" }}>
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                </div>
                <div style={{ display: "flex" }}>
                  <p>599.00</p>
                  <p>TL</p>
                </div>
              </div>
            </p>
          </div>
          <div className="add-basket-button" style={{ display: "flex" }}>
            <Stack direction="row" spacing={2} style={{ width: "100%" }}>
              <Button variant="contained" color="success">
                Add Basket 
                <p style={{marginLeft:'8px'}}><ShoppingCartIcon/></p>
              </Button>
            </Stack>
          </div>
        </div>
        <div className="card top-picks-card" style={{height:'40vh'}}>
          <img src={imageURL} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">PHILIPS Erkek Bakım Seti Gri Siyah</h5>
            <p className="card-text" style={{ fontSize: "25px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ color: "yellow" }}>
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                </div>
                <div style={{ display: "flex" }}>
                  <p>599.00</p>
                  <p>TL</p>
                </div>
              </div>
            </p>
          </div>
          <div className="add-basket-button" style={{ display: "flex" }}>
            <Stack direction="row" spacing={2} style={{ width: "100%" }}>
              <Button variant="contained" color="success">
                Add Basket 
                <p style={{marginLeft:'8px'}}><ShoppingCartIcon/></p>
              </Button>
            </Stack>
          </div>
        </div>
      </div>

      <div className="card-group top-picks">
      <div className="card top-picks-card" style={{height:'40vh'}}>
          <img src={imageURL} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">PHILIPS Erkek Bakım Seti Gri Siyah</h5>
            <p className="card-text" style={{ fontSize: "25px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ color: "yellow" }}>
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                </div>
                <div style={{ display: "flex" }}>
                  <p>599.00</p>
                  <p>TL</p>
                </div>
              </div>
            </p>
          </div>
          <div className="add-basket-button" style={{ display: "flex" }}>
            <Stack direction="row" spacing={2} style={{ width: "100%" }}>
              <Button variant="contained" color="success">
                Add Basket 
                <p style={{marginLeft:'8px'}}><ShoppingCartIcon/></p>
              </Button>
            </Stack>
          </div>
        </div>
        <div className="card top-picks-card" style={{height:'40vh'}}>
          <img src={imageURL} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">PHILIPS Erkek Bakım Seti Gri Siyah</h5>
            <p className="card-text" style={{ fontSize: "25px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ color: "yellow" }}>
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                </div>
                <div style={{ display: "flex" }}>
                  <p>599.00</p>
                  <p>TL</p>
                </div>
              </div>
            </p>
          </div>
          <div className="add-basket-button" style={{ display: "flex" }}>
            <Stack direction="row" spacing={2} style={{ width: "100%" }}>
              <Button variant="contained" color="success">
                Add Basket 
                <p style={{marginLeft:'8px'}}><ShoppingCartIcon/></p>
              </Button>
            </Stack>
          </div>
        </div>
        <div className="card top-picks-card" style={{height:'40vh'}}>
          <img src={imageURL} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">PHILIPS Erkek Bakım Seti Gri Siyah</h5>
            <p className="card-text" style={{ fontSize: "25px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ color: "yellow" }}>
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                </div>
                <div style={{ display: "flex" }}>
                  <p>599.00</p>
                  <p>TL</p>
                </div>
              </div>
            </p>
          </div>
          <div className="add-basket-button" style={{ display: "flex" }}>
            <Stack direction="row" spacing={2} style={{ width: "100%" }}>
              <Button variant="contained" color="success">
                Add Basket 
                <p style={{marginLeft:'8px'}}><ShoppingCartIcon/></p>
              </Button>
            </Stack>
          </div>
        </div>
        <div className="card top-picks-card" style={{height:'40vh'}}>
          <img src={imageURL} className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">PHILIPS Erkek Bakım Seti Gri Siyah</h5>
            <p className="card-text" style={{ fontSize: "25px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ color: "yellow" }}>
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                  <StarRateIcon />
                </div>
                <div style={{ display: "flex" }}>
                  <p>599.00</p>
                  <p>TL</p>
                </div>
              </div>
            </p>
          </div>
          <div className="add-basket-button" style={{ display: "flex" }}>
            <Stack direction="row" spacing={2} style={{ width: "100%" }}>
              <Button variant="contained" color="success">
                Add Basket 
                <p style={{marginLeft:'8px'}}><ShoppingCartIcon/></p>
              </Button>
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopPicks;
