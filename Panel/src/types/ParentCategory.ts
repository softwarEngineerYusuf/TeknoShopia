export interface Category {
  _id: string;
  name: string;
  parentCategory: string | null;
  subCategories: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface SubCategory {
  _id: string;
  name: string;
  parentCategory: {
    _id: string;
    name: string;
  } | null;
  subCategories: Category[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
