export interface Category {
  _id: string;
  name: string;
  parentCategory: { _id: string; name: string } | null; // Eğer parentCategory null veya nesne ise
  subCategories: Category[]; // Eğer ID dizisi geliyorsa string[] olarak değiştir
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
  subCategories: SubCategory[]; // Eğer ID'ler geliyorsa: string[]
  createdAt: string;
  updatedAt: string;
  __v: number;
}
