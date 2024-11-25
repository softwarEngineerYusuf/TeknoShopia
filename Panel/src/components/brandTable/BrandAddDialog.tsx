import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { addBrand } from "../../allAPIs/BrandApi";
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
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setBrandName("");
    setDescription("");
    setImageUrl("");
    setLogo(null);
    setError(null);
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLogo(event.target.files[0]);
    }
  };

  const handleAddBrand = async () => {
    if (!brandName) {
      setError("Brand name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", brandName);
    formData.append("description", description);
    formData.append("imageUrl", imageUrl);
    if (logo) {
      formData.append("logo", logo);
    }

    try {
      await addBrand(formData);
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
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="dense"
        />
        <TextField
          label="Image URL"
          variant="outlined"
          fullWidth
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          margin="dense"
        />
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
        >
          Upload Logo
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        {logo && <div>Selected file: {logo.name}</div>}
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
