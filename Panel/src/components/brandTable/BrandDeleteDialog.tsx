import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

interface BrandDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  brandName: string;
}

const BrandDeleteDialog: React.FC<BrandDeleteDialogProps> = ({
  open,
  onClose,
  onDelete,
  brandName,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Silme Onayı</DialogTitle>
      <DialogContent>
        <p>
          {brandName} adlı markayı silmek istediğinize emin misiniz? Bu işlem
          geri alınamaz.
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="success" variant="contained">
          İptal
        </Button>
        <Button onClick={onDelete} color="error" variant="contained">
          Sil
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BrandDeleteDialog;
