import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { addBrand } from "../../allAPIs/api";
import { toast } from "react-toastify";

interface BrandDialogProps {
  open: boolean;
  onClose: () => void;
  fetchBrands: () => void;
}

const BrandAddDialog: React.FC<BrandDialogProps> = ({
  open,
  onClose,
  fetchBrands,
}) => {
  const [brandName, setBrandName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setBrandName("");
    setError(null);
    onClose();
  };

  const handleAddBrand = async () => {
    if (!brandName) {
      setError("Brand name is required.");
      return;
    }

    try {
      await addBrand({ name: brandName });
      fetchBrands();
      toast.success(`${brandName} markası başarıyla eklendi`);
      handleClose();
    } catch (err: unknown) {
      setError("Failed to add brand.");
      if (err instanceof Error) {
        setError(err.message || "An unexpected error occurred.");
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Brand</DialogTitle>
      <DialogContent>
        <TextField
          label="Brand Name"
          variant="outlined"
          fullWidth
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          error={!!error}
          helperText={error}
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddBrand} color="primary" variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BrandAddDialog;
