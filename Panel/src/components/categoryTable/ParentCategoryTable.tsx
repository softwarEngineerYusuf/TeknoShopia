import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableFooter,
  TablePagination,
  Paper,
  TableHead,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteMainCategory,
  getAllMainCategories,
} from "../../allAPIs/CategoryApi"; // API fonksiyonunu ve tipleri içe aktar
import { Category } from "../../types/ParentCategory";
import ParentCategoryAddDialog from "./ParentCategoryAddDialog";
import ParentCategoryDeleteDialog from "./ParentCategoryDeleteDialog";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";

const ParentCategoryTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddCategoryDialog, setOpenAddCategoryProductDialog] =
    useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedPCategoryName, setSelectedPCategoryName] =
    useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleOpenDialog = () => setOpenAddCategoryProductDialog(true);
  const handleCloseDialog = () => setOpenAddCategoryProductDialog(false);
  // API'den kategorileri çek
  // API'den kategorileri çekme fonksiyonunu dışarı aldık
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllMainCategories();
      setCategories(data.categories);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Kategoriler alınırken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect içinde çağır
  useEffect(() => {
    fetchCategories();
  }, []);

  // Boş satırları hesapla
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - categories.length) : 0;

  // Sayfa değişikliği
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  // Satır sayısı değişikliği
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };
  const openDeleteDialog = (id: string, name: string) => {
    setSelectedCategoryId(id);
    setSelectedPCategoryName(name);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCategory = async () => {
    if (selectedCategoryId) {
      try {
        await deleteMainCategory(selectedCategoryId);
        setCategories(
          categories.filter((category) => category._id !== selectedCategoryId)
        );
        setDeleteDialogOpen(false);
        toast.success("Category deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Error deleting product.");
      }
    }
  };

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Ana Kategoriler</TableCell>
              <TableCell align="center">Alt Kategori Sayısı</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? categories.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : categories
            ).map((category) => (
              <TableRow key={category._id}>
                <TableCell component="th" scope="row">
                  {category.name}
                </TableCell>
                <TableCell style={{ width: 160 }} align="center">
                  {category.subCategories ? category.subCategories.length : 0}{" "}
                  {/* SubCategories sayısı */}
                </TableCell>
                <TableCell align="center">
                  <div className="flex space-x-2 justify-center">
                    <button
                      // onClick={() => handleOpenUpdateDialog(product._id)}
                      className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() =>
                        openDeleteDialog(category._id, category.name)
                      }
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={2} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={2}
                count={categories.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <button
        onClick={handleOpenDialog}
        className="px-4 py-2 mt-2 text-white bg-green-500 rounded hover:bg-green-600"
      >
        Add Main Category
      </button>
      <ParentCategoryAddDialog
        open={openAddCategoryDialog}
        onClose={handleCloseDialog}
        fetchCategories={fetchCategories}
      />
      <ParentCategoryDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleDeleteCategory}
        parentCategoryName={selectedPCategoryName}
      />
    </>
  );
};

export default ParentCategoryTable;
