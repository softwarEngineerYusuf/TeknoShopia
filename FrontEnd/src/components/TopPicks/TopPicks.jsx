import { Card, Button } from "antd";
import { ShoppingCartOutlined, StarFilled } from "@ant-design/icons";
import "./TopPicks.css"; // Stil dosyanı korudum.

const { Meta } = Card;

const TopPicks = () => {
  const imageURL =
    "https://assets.mmsrg.com/isr/166325/c1/-/ASSET_MMS_133460515?x=280&y=190&format=jpg&quality=80&sp=yes&strip=yes&trim&ex=280&ey=190&align=center&resizesource&unsharp=1.5x1+0.7+0.02&cox=0&coy=0&cdx=280&cdy=190";

  return (
    <div className="container mt-4">
      <div className="top-picks-and-button d-flex justify-content-between align-items-center">
        <h2 className="TopPicksText">Top Picks</h2>
        <button className="buttonShowMore">
          <span>Show More</span>
        </button>
      </div>

      <div className="row mt-3">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="col-6 col-sm-6 col-md-6 col-lg-3 mb-4">
            <Card
              hoverable
              cover={<img alt="Product" src={imageURL} />}
              className="h-100 d-flex flex-column p-3"
              style={{ width: "100%", border: "3px solid #F0F0F0" }}
            >
              <Meta
                title="PHILIPS Erkek Bakım Seti Gri Siyah"
                description={
                  <div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div style={{ color: "#FADB14" }}>
                        {[...Array(5)].map((_, i) => (
                          <StarFilled key={i} />
                        ))}
                      </div>
                      <div className="price d-flex align-items-center">
                        <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                          599.00 TL
                        </span>
                      </div>
                    </div>
                  </div>
                }
              />
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                className="mt-3"
                block
                style={{
                  backgroundColor: "#52c41a",
                  borderColor: "#52c41a",
                  marginTop: "15px",
                }}
              >
                Add to Basket
              </Button>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPicks;
