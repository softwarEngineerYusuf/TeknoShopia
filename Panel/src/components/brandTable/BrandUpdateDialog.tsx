import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { updateBrand } from "../../allAPIs/api"; // Güncelleme fonksiyonunuzun yolu
import { toast } from "react-toastify";

interface BrandUpdateDialogProps {
  open: boolean;
  onClose: () => void;
  fetchBrands: () => void;
  brandId: string | null;
  brandName: string;
  brandDescription?: string;
  brandImageUrl?: string;
  brandLogo?: string;
}

const BrandUpdateDialog: React.FC<BrandUpdateDialogProps> = ({
  open,
  onClose,
  fetchBrands,
  brandId,
  brandName,
  brandDescription,
  brandImageUrl,
  brandLogo,
}) => {
  const [name, setName] = useState(brandName);
  const [description, setDescription] = useState(brandDescription || "");
  const [imageUrl, setImageUrl] = useState(brandImageUrl || "");
  const [logo, setLogo] = useState<File | null>(null); // Logo dosyası
  const [currentLogo, setCurrentLogo] = useState(brandLogo || ""); // Mevcut logo
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(brandName);
    setDescription(brandDescription || "");
    setImageUrl(brandImageUrl || "");
    setCurrentLogo(brandLogo || "");
  }, [brandName, brandDescription, brandImageUrl, brandLogo]);

  const handleClose = () => {
    setName(brandName);
    setDescription(brandDescription || "");
    setImageUrl(brandImageUrl || "");
    setLogo(null);
    setCurrentLogo(brandLogo || "");
    setError(null);
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLogo(event.target.files[0]);
    }
  };

  const handleUpdateBrand = async () => {
    if (!name) {
      setError("Brand name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("imageUrl", imageUrl);

    if (logo) {
      formData.append("logo", logo);
    } else if (currentLogo) {
      formData.append("logo", currentLogo);
    }

    try {
      if (brandId) {
        await updateBrand(brandId, formData);
        fetchBrands();
        toast.success(`${name} markası başarıyla güncellendi`);
        handleClose();
      } else {
        setError("Brand ID is required.");
      }
    } catch (err: unknown) {
      setError("Failed to update brand.");
      if (err instanceof Error) {
        setError(err.message || "An unexpected error occurred.");
      }
    }
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update Brand</DialogTitle>
      <DialogContent>
        <TextField
          label="Brand Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        {!logo && currentLogo && <div>Current Logo: {currentLogo}</div>}{" "}
        {/* Mevcut logo bilgisi gösteriliyor */}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleUpdateBrand} color="primary" variant="contained">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BrandUpdateDialog;
