import { useState } from "react";
import TopPicksMoreFilter from "../../components/TopPicksMoreFilter/TopPicksMoreFilter";
import TopPicksMoreCards from "../../components/TopPicksMoreCards/TopPicksMoreCards";
import "./TopPicksMore.css";

function TopPicksMore() {
  const [selectedBrands, setSelectedBrands] = useState([]);

  return (
    <div className="container">
      <div className="subContainerTopPicksMore">
        <div className="categoryFilterTopPicksMore">
          <TopPicksMoreFilter
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
          />
        </div>
        <div className="categoryProductsTopPicksMore">
          <TopPicksMoreCards selectedBrands={selectedBrands} />
        </div>
      </div>
    </div>
  );
}

export default TopPicksMore;
