import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

interface ProductDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
  productName: string;
}

const ProductDeleteDialog: React.FC<ProductDeleteDialogProps> = ({
  open,
  onClose,
  onDelete,
  productName,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Confirmation</DialogTitle>
      <DialogContent>
        <p>
          Are you sure you want to delete the product "{productName}"? This
          action cannot be undone.
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="success" variant="contained">
          Cancel
        </Button>
        <Button onClick={onDelete} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDeleteDialog;
