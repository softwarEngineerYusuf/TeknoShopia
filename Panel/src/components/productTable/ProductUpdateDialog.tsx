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
  IconButton,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { getAllBrands } from "../../allAPIs/BrandApi";
import { getAllCategories } from "../../allAPIs/CategoryApi";
import { getProductById, updateProduct } from "../../allAPIs/ProductApi";
import { Brand } from "../../types/Brand";
import { Category } from "../../types/ParentCategory";
import { Product } from "../../types/Product";

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
  const [attributes, setAttributes] = useState<
    { key: string; value: string }[]
  >([]);

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
        setSelectedBrand(productData.brand._id);
        setSelectedCategory(productData.category._id);

        // Attributes'ı düzenlenebilir formata dönüştür
        const formattedAttributes = Object.entries(productData.attributes).map(
          ([key, value]) => ({ key, value })
        );
        setAttributes(formattedAttributes);
      };
      fetchProduct();
    }

    if (open) {
      fetchBrands();
      fetchCategories();
    }
  }, [open, productId]);

  const handleAttributeChange = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index][field] = value;
    setAttributes(updatedAttributes);
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { key: "", value: "" }]);
  };

  const handleRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (product) {
      const updatedProduct = {
        name: product.name,
        brand: selectedBrand,
        category: selectedCategory,
        price: product.price,
        stock: product.stock,
        attributes: attributes.reduce((acc, attr) => {
          if (attr.key && attr.value) {
            acc[attr.key] = attr.value;
          }
          return acc;
        }, {} as Record<string, string>),
      };

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
          onChange={(e) =>
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
          onChange={(e) =>
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
          onChange={(e) =>
            setProduct((prev) =>
              prev ? { ...prev, stock: Number(e.target.value) } : null
            )
          }
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Brand</InputLabel>
          <Select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value as string)}
          >
            {brands.map((brand) => (
              <MenuItem key={brand._id} value={brand._id}>
                {brand.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as string)}
          >
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div>
          <h4>Attributes</h4>
          {attributes.map((attribute, index) => (
            <div key={index} style={{ display: "flex", marginBottom: "10px" }}>
              <TextField
                label="Key"
                value={attribute.key}
                onChange={(e) =>
                  handleAttributeChange(index, "key", e.target.value)
                }
                style={{ marginRight: "10px", flex: 1 }}
              />
              <TextField
                label="Value"
                value={attribute.value}
                onChange={(e) =>
                  handleAttributeChange(index, "value", e.target.value)
                }
                style={{ marginRight: "10px", flex: 1 }}
              />
              <IconButton
                onClick={() => handleRemoveAttribute(index)}
                color="secondary"
              >
                <Remove />
              </IconButton>
            </div>
          ))}
          <Button
            onClick={handleAddAttribute}
            variant="outlined"
            color="primary"
            startIcon={<Add />}
          >
            Add Attribute
          </Button>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductUpdateDialog;
