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
import { getAllMainCategories } from "../../allAPIs/CategoryApi";
import { getAllSubCategories } from "../../allAPIs/CategoryApi";
import { getProductById, updateProduct } from "../../allAPIs/ProductApi";
import { Brand } from "../../types/Brand";
import { Category } from "../../types/ParentCategory";
import { Product } from "../../types/Product";
import { SubCategory } from "../../types/ParentCategory";

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
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isCategoriesLoaded, setIsCategoriesLoaded] = useState(false);
  const [additionalImages, setAdditionalImages] = useState<
    { imageUrl: string }[]
  >([]);
  const [attributes, setAttributes] = useState<
    { key: string; value: string }[]
  >([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const brandsData = await getAllBrands();
      setBrands(brandsData);
    };

    const fetchCategoriesAndSubCategories = async () => {
      try {
        const { categories } = await getAllMainCategories();
        const subCategoriesData = await getAllSubCategories();

        setCategories(categories);
        setSubCategories(subCategoriesData);
        setIsCategoriesLoaded(true); // Verilerin yüklendiğini belirt
      } catch (error) {
        console.error("Kategoriler alınırken hata oluştu:", error);
      }
    };

    if (open) {
      fetchBrands();
      fetchCategoriesAndSubCategories();
    }
  }, [open]);

  useEffect(() => {
    if (open && productId && isCategoriesLoaded) {
      const fetchProduct = async () => {
        const productData = await getProductById(productId);
        setProduct(productData);
        setSelectedBrand(productData.brand.name);

        // Kategori adını belirle
        const categoryName =
          categories.find((cat) => cat._id === productData.category._id)
            ?.name ||
          subCategories.find((sub) => sub._id === productData.category._id)
            ?.name ||
          "";

        setSelectedCategory(categoryName);

        const formattedAttributes = Object.entries(productData.attributes).map(
          ([key, value]) => ({ key, value })
        );
        setAttributes(formattedAttributes);

        // Set existing additional images
        setAdditionalImages(
          productData.additionalImages?.map((image: string) => ({
            imageUrl: image,
          })) || []
        );
      };

      fetchProduct();
    }
  }, [open, productId, isCategoriesLoaded]);

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

  const handleAddAdditionalImage = () => {
    setAdditionalImages([...additionalImages, { imageUrl: "" }]);
  };

  const handleRemoveAdditionalImage = (index: number) => {
    const updatedImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(updatedImages);
  };

  const handleAdditionalImageChange = (index: number, value: string) => {
    const updatedImages = [...additionalImages];
    updatedImages[index].imageUrl = value;
    setAdditionalImages(updatedImages);
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
        mainImage: product.mainImage, // Yeni eklenen alan
        description: product.description,
        additionalImages: additionalImages.map((image) => image.imageUrl), // Yeni eklenen alan
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
        {/* Yeni Alanlar */}
        <TextField
          label="Main Image URL"
          fullWidth
          margin="normal"
          value={product?.mainImage || ""}
          onChange={(e) =>
            setProduct((prev) =>
              prev ? { ...prev, mainImage: e.target.value } : null
            )
          }
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={product?.description || ""}
          onChange={(e) =>
            setProduct((prev) =>
              prev ? { ...prev, description: e.target.value } : null
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
              <MenuItem key={brand._id} value={brand.name}>
                {brand.name}
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
            {/* Ana Kategoriler Başlık */}
            <MenuItem disabled>
              <em>Ana Kategoriler</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}

            {/* Alt Kategoriler Başlık */}
            <MenuItem disabled>
              <em>Alt Kategoriler</em>
            </MenuItem>
            {subCategories.map((subCategory) => (
              <MenuItem key={subCategory._id} value={subCategory.name}>
                {subCategory.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Additional Images Inputs */}
        <h4>Additional Images</h4>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          {additionalImages.map((image, index) => (
            <div
              key={index}
              style={{
                alignItems: "center",
                position: "relative",
                marginBottom: "10px",
                width: "100%",
              }}
            >
              {/* Resmi göster */}
              {image.imageUrl ? (
                <div
                  style={{
                    display: "flex",
                    position: "relative",
                    width: "100px",
                    height: "100px",
                  }}
                >
                  <img
                    src={image.imageUrl}
                    alt={`Additional Image ${index}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      marginBottom: "10px", // Resmin altına boşluk ekledik
                    }}
                  />
                  {/* Resmin sağ üst köşesine remove butonu */}
                  <IconButton
                    onClick={() => handleRemoveAdditionalImage(index)}
                    color="secondary"
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                    }}
                  >
                    <Remove />
                  </IconButton>
                </div>
              ) : (
                <div style={{ position: "relative" }}>
                  <TextField
                    label="Image URL"
                    fullWidth
                    value={image.imageUrl}
                    onChange={(e) =>
                      handleAdditionalImageChange(index, e.target.value)
                    }
                    style={{ width: "100%" }}
                  />
                  {/* Inputun sağ üst köşesine remove butonu */}
                  <IconButton
                    onClick={() => handleRemoveAdditionalImage(index)}
                    color="secondary"
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                    }}
                  >
                    <Remove />
                  </IconButton>
                </div>
              )}
            </div>
          ))}
        </div>
        <Button
          onClick={handleAddAdditionalImage}
          variant="outlined"
          color="primary"
          startIcon={<Add />}
        >
          Add Additional Image
        </Button>
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
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductUpdateDialog;
