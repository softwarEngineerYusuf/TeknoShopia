import { Brand } from "./Brand";
import { Category } from "./ParentCategory";

export interface Product {
  _id: string;
  name: string;
  mainImage: string;
  discount: number;
  description: string;
  price: number;
  stock: number;
  brand: Brand;
  category: Category;
  attributes: Record<string, string>;
}
