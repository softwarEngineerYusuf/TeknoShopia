export interface Category {
  _id: string;
  name: string;
  parentCategory: { _id: string; name: string } | null; // Eğer parentCategory varsa nesne, yoksa null
  subCategories: string[]; // ID dizisi olarak geliyor
  products: string[]; // Ürünlerin ID listesi geliyor
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface SubCategory {
  _id: string;
  name: string;
  parentCategory: {
    _id: string;
    name: string;
  } | null;
  subCategories: string[]; // ID dizisi olarak geldiği için string[]
  products: string[]; // Ürünlerin ID listesi
  createdAt: string;
  updatedAt: string;
  __v: number;
}
