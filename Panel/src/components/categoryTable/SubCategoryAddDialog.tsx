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
  //   IconButton,
} from "@mui/material";
import { addCategory, getAllMainCategories } from "../../allAPIs/CategoryApi";
import { toast } from "react-toastify";
import { Category } from "../../types/ParentCategory";

interface CategoryAddDialogProps {
  open: boolean;
  onClose: () => void;
  fetchSubCategories: () => void;
}

const SubCategoryAddDialog: React.FC<CategoryAddDialogProps> = ({
  open,
  onClose,
  fetchSubCategories,
}) => {
  const [categoryName, setCategoryName] = useState("");
  const [parentCategory, setParentCategory] = useState<string | "">(""); // Sadece ID tutuyoruz
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { categories } = await getAllMainCategories();
        setCategories(categories); // API'den gelen veriyi kaydediyoruz
      } catch (error) {
        console.error("Ana kategoriler alınırken hata oluştu:", error);
      }
    };

    if (open) fetchCategories();
  }, [open]);

  const handleSubmit = async () => {
    try {
      await addCategory(categoryName, parentCategory || undefined);
      fetchSubCategories();
      onClose();
      toast.success("Alt kategori başarıyla eklendi");
    } catch (error) {
      console.error("Alt kategori eklenirken hata oluştu:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Sub Category</DialogTitle>
      <DialogContent>
        <TextField
          label="Sub Category Name"
          fullWidth
          margin="normal"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />

        {/* Ana Kategori Seçme Alanı */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Parent Category (Optional)</InputLabel>
          <Select
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!(categoryName && parentCategory)}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubCategoryAddDialog;
