
import { singleProduct } from "../../../menuData";
import Single from "../../components/single/Single";
import "./productDetail.scss";

const ProductDetail = () => {
  //veri çek ve single Componente gönder

  return <div className="productDetail">
     <Single {...singleProduct}/>
  </div>;
};

export default ProductDetail;
