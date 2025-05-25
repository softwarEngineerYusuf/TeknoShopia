import { useNavigate } from "react-router-dom";

export const useGoToProductDetail = () => {
  const navigate = useNavigate();

  const goToProductDetail = (productId) => {
    if (productId) {
      navigate(`/productDetail/${productId}`);
    }
  };

  return goToProductDetail;
};
