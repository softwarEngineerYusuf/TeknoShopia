import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  //   Select,
  //   MenuItem,
  //   InputLabel,
  //   FormControl,
  //   IconButton,
} from "@mui/material";
import { addCategory } from "../../allAPIs/CategoryApi";
import { toast } from "react-toastify";
interface CategoryAddDialogProps {
  open: boolean;
  onClose: () => void;
  fetchCategories: () => void;
}

const ParentCategoryAddDialog: React.FC<CategoryAddDialogProps> = ({
  open,
  onClose,
  fetchCategories,
}) => {
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await addCategory(categoryName);
      fetchCategories();
      onClose();
      toast.success("Category Başarıyla Eklendi");
      console.log("response", response);
    } catch (error) {
      console.error("Kategori eklenirken hata oluştu:", error);
    }
  };
  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            fullWidth
            margin="normal"
            // value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            //   disabled={!name || !selectedBrand || !selectedCategory}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ParentCategoryAddDialog;
