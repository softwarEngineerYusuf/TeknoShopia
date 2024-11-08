import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";

interface BrandDialogProps {
  open: boolean;
  onClose: () => void;
  onBrandAdded: () => void; // Callback to refresh the brand list after adding
}

const BrandAddDialog: React.FC<BrandDialogProps> = ({
  open,
  onClose,
  onBrandAdded,
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
      await axios.post("http://localhost:5000/api/brand/addBrand", {
        name: brandName,
      });
      onBrandAdded();
      handleClose();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to add brand.");
      } else {
        setError("An unexpected error occurred.");
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
