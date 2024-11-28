import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { getAllBrands } from "../../allAPIs/BrandApi";
import { getAllCategories } from "../../allAPIs/CategoryApi";
import { getProductById, updateProduct } from "../../allAPIs/ProductApi";

// Tiplerin belirlenmesi
interface Brand {
  _id: string;
  name: string;
  description: string;
  logo: string | null;
  imageUrl: string;
}

interface Category {
  _id: string;
  name: string;
  subCategories: string[];
}

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  brand: Brand;
  category: Category;
  discount: number;
  discountStartDate: string;
  discountEndDate: string;
  additionalImages: string[];
  attributes: {
    color: string;
    size: string;
    weight: string;
  };
}

interface ProductUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  fetchProducts: () => void;
}

interface ProductUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  fetchProducts: () => void;
}

const ProductUpdateDialog: React.FC<ProductUpdateDialogProps> = ({
  open,
  onClose,
  productId,
  fetchProducts,
}) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  useEffect(() => {
    const fetchBrands = async () => {
      const brandsData = await getAllBrands();
      setBrands(brandsData);
    };

    const fetchCategories = async () => {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    };

    if (open && productId) {
      const fetchProduct = async () => {
        const productData = await getProductById(productId);
        setProduct(productData);
        setSelectedBrand(productData.brand._id); // Brand _id'sini kullanıyoruz
        setSelectedCategory(productData.category._id); // Category _id'sini kullanıyoruz
      };
      fetchProduct();
    }

    if (open) {
      fetchBrands();
      fetchCategories();
    }
  }, [open, productId]);

  const handleBrandChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const brandId = e.target.value as string;
    setSelectedBrand(brandId);

    // Update the product object with the new selected brand
    if (product) {
      setProduct((prevProduct) =>
        prevProduct
          ? {
              ...prevProduct,
              brand: brands.find((b) => b._id === brandId) ?? prevProduct.brand,
            }
          : null
      );
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const categoryId = e.target.value as string;
    setSelectedCategory(categoryId);

    // Update the product object with the new selected category
    if (product) {
      setProduct((prevProduct) =>
        prevProduct
          ? {
              ...prevProduct,
              category:
                categories.find((c) => c._id === categoryId) ??
                prevProduct.category,
            }
          : null
      );
    }
  };

  const handleSubmit = async () => {
    if (product) {
      const updatedProduct = {
        name: product.name,
        brand: selectedBrand, // Send the updated brand _id
        category: selectedCategory, // Send the updated category _id
        price: product.price,
        stock: product.stock,
      };
      console.log("Updated product:", updatedProduct);

      try {
        await updateProduct(productId, updatedProduct);
        fetchProducts();
        onClose();
      } catch (error) {
        console.error("Error updating product:", error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Product</DialogTitle>
      <DialogContent>
        <TextField
          label="Product Name"
          fullWidth
          margin="normal"
          value={product?.name || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProduct((prev) =>
              prev ? { ...prev, name: e.target.value } : null
            )
          }
        />
        <TextField
          label="Price"
          type="number"
          fullWidth
          margin="normal"
          value={product?.price || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProduct((prev) =>
              prev ? { ...prev, price: Number(e.target.value) } : null
            )
          }
        />
        <TextField
          label="Stock"
          type="number"
          fullWidth
          margin="normal"
          value={product?.stock || ""}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setProduct((prev) =>
              prev ? { ...prev, stock: Number(e.target.value) } : null
            )
          }
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Brand</InputLabel>
          <Select value={selectedBrand} onChange={handleBrandChange}>
            {brands.map((brand) => (
              <MenuItem key={brand._id} value={brand._id}>
                {brand.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select value={selectedCategory} onChange={handleCategoryChange}>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductUpdateDialog;
