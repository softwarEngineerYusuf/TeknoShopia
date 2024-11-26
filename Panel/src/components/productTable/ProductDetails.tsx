import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../../allAPIs/ProductApi";

interface Product {
  _id: string;
  mainImage?: string;
  brand: { name: string };
  name: string;
  price: number;
  stock: number;
  discountedPrice?: number;
}
const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [productDetails, setProductDetails] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id!);
        setProductDetails(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: "green", height: "100%" }}>
      {productDetails.name}
    </div>
  );
};

export default ProductDetails;
