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
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import { getAllBrands } from "../../allAPIs/BrandApi";
import { getAllCategories } from "../../allAPIs/CategoryApi";
import { addProduct } from "../../allAPIs/ProductApi";
import { Add, Remove } from "@mui/icons-material";

interface ProductAddDialogProps {
  open: boolean;
  onClose: () => void;
  fetchProducts: () => void;
}

const ProductAddDialog: React.FC<ProductAddDialogProps> = ({
  open,
  onClose,
  fetchProducts,
}) => {
  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [mainImage, setMainImage] = useState<string>("");
  const [description, setDescription] = useState<string>(""); // New description state
  const [attributes, setAttributes] = useState<
    { key: string; value: string }[]
  >([{ key: "", value: "" }]);

  useEffect(() => {
    const fetchBrands = async () => {
      const brandsData = await getAllBrands();
      setBrands(brandsData.map((brand: any) => brand.name));
    };

    const fetchCategories = async () => {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData.map((category: any) => category.name));
    };

    if (open) {
      fetchBrands();
      fetchCategories();
    }
  }, [open]);

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
    const updatedAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(updatedAttributes);
  };

  const handleSubmit = async () => {
    const productData = {
      name,
      brand: selectedBrand,
      category: selectedCategory,
      price,
      stock,
      mainImage,
      description,
      attributes: attributes.reduce((acc, attr) => {
        if (attr.key && attr.value) {
          acc[attr.key] = attr.value;
        }
        return acc;
      }, {} as Record<string, string>),
    };

    try {
      await addProduct(productData);

      fetchProducts();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setStock("");
    setMainImage("");
    setDescription("");
    setSelectedBrand("");
    setSelectedCategory("");
    setAttributes([{ key: "", value: "" }]);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Product</DialogTitle>
      <DialogContent>
        <TextField
          label="Product Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Price"
          type="number"
          fullWidth
          margin="normal"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <TextField
          label="Stock"
          type="number"
          fullWidth
          margin="normal"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
        />
        <TextField
          label="Main Image URL"
          fullWidth
          margin="normal"
          value={mainImage}
          onChange={(e) => setMainImage(e.target.value)}
        />
        <TextField
          label="Description" // Add description input
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Brand</InputLabel>
          <Select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            {brands.map((brand) => (
              <MenuItem key={brand} value={brand}>
                {brand}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
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
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!name || !selectedBrand || !selectedCategory}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductAddDialog;
