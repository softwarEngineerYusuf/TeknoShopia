import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Paper,
} from "@mui/material";
import { toast } from "react-toastify";
import BrandPaginationActions from "./BrandTablePagination";
import { getAllBrands, deleteBrand } from "../../allAPIs/BrandApi";
import BrandAddDialog from "./BrandAddDialog";
import BrandDeleteDialog from "./BrandDeleteDialog";
import BrandUpdateDialog from "./BrandUpdateDialog";

interface Brand {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  logo?: {
    public_id: string;
    url: string;
  };
}

export default function BrandTable() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedBrandName, setSelectedBrandName] = useState<string>("");

  const handleClickOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const openUpdateDialog = (brand: Brand) => {
    setSelectedBrand(brand);
    setUpdateDialogOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setUpdateDialogOpen(false);
  };

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const data = await getAllBrands();
      setBrands(data);
    } catch (error) {
      setError("Markalar alınırken bir hata oluştu.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  y;
  const handleDeleteBrand = async () => {
    if (selectedBrandId) {
      try {
        await deleteBrand(selectedBrandId);
        setBrands(brands.filter((brand) => brand._id !== selectedBrandId));
        setDeleteDialogOpen(false);
        toast.success("Marka başarıyla silindi!");
      } catch (error) {
        console.error("Marka silinirken bir hata oluştu:", error);
        setError("Marka silinirken bir hata oluştu.");
        toast.error("Marka Silinemedi");
      }
    }
  };

  const openDeleteDialog = (id: string, name: string) => {
    setSelectedBrandId(id);
    setSelectedBrandName(name);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="brand table">
          <TableHead>
            <TableRow>
              <TableCell>Logo</TableCell>
              <TableCell>İsim</TableCell>
              <TableCell>Açıklama</TableCell>
              <TableCell>Resim</TableCell>
              <TableCell>İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? brands.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : brands
            ).map((brand) => (
              <TableRow key={brand._id}>
                <TableCell>
                  {brand.logo?.url ? (
                    <img
                      src={brand.logo.url}
                      alt={brand.name}
                      style={{ width: 50, height: 50, objectFit: "cover" }}
                    />
                  ) : (
                    "No Logo"
                  )}
                </TableCell>
                <TableCell>{brand.name}</TableCell>
                <TableCell>{brand.description || "Açıklama yok"}</TableCell>
                <TableCell>
                  <img
                    src={brand.imageUrl || "https://via.placeholder.com/50"}
                    alt={brand.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                      onClick={() => openUpdateDialog(brand)}
                    >
                      Güncelle
                    </button>
                    <button
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                      onClick={() => openDeleteDialog(brand._id, brand.name)}
                    >
                      Sil
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "Tümü", value: -1 }]}
                colSpan={5}
                count={brands.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={BrandPaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <button
        onClick={handleClickOpenDialog}
        className="px-4 py-2 mt-2 text-white bg-green-500 rounded hover:bg-green-600"
      >
        Marka Ekle
      </button>
      <BrandAddDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        fetchBrands={fetchBrands}
      />
      <BrandDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleDeleteBrand}
        brandName={selectedBrandName}
      />
      <BrandUpdateDialog
        open={updateDialogOpen}
        onClose={handleCloseUpdateDialog}
        fetchBrands={fetchBrands}
        brandId={selectedBrand?._id || ""}
        brandName={selectedBrand?.name || ""}
        brandDescription={selectedBrand?.description || ""}
      />
    </>
  );
}
