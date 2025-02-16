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
  TableHead, // Başlık için TableHead ekleyin
} from "@mui/material";
import {
  getAllSubCategories,
  deleteMainCategory,
} from "../../allAPIs/CategoryApi"; // API fonksiyonunu içe aktar
import { SubCategory } from "../../types/ParentCategory"; // Category tipini içe aktar
import SubCategoryAddDialog from "./SubCategoryAddDialog";
import SubCategoryDeleteDialog from "./SubCategoryDeleteDialog";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
const SubCategoryTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openAddCategoryDialog, setOpenAddCategoryProductDialog] =
    useState(false);
  const [subcategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>("");
  const handleOpenDialog = () => setOpenAddCategoryProductDialog(true);
  const handleCloseDialog = () => setOpenAddCategoryProductDialog(false);

  const fetchSubCategories = async () => {
    try {
      const data = await getAllSubCategories(); // API'den verileri al

      setSubCategories(data); // Kategorileri state'e kaydet
    } catch (err) {
      setError(err.message || "Alt kategoriler alınırken bir hata oluştu."); // Hata durumunda
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSubCategories();
  }, []);

  // Boş satırları hesapla
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - subcategories.length) : 0;

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

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteCategory = async () => {
    if (selectedCategoryId) {
      try {
        console.log("selectedCategoryId", selectedCategoryId);
        await deleteMainCategory(selectedCategoryId);
        setSubCategories(
          subcategories.filter(
            (category) => category._id !== selectedCategoryId
          )
        );
        setDeleteDialogOpen(false);
        toast.success("Category deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Error deleting product.");
      }
    }
  };
  const openDeleteDialog = (id: string, name: string) => {
    setSelectedCategoryId(id);
    setSelectedCategoryName(name);
    setDeleteDialogOpen(true);
  };
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <TableCell>Alt Kategori Adı</TableCell>
              <TableCell align="right">Ana Kategori Adı</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? subcategories.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : subcategories
            ).map((category) => (
              <TableRow key={category._id}>
                <TableCell component="th" scope="row">
                  {category.name}
                </TableCell>
                <TableCell style={{ width: 160 }} align="right">
                  {category.parentCategory
                    ? category.parentCategory.name
                    : "Ana Kategori Yok"}
                </TableCell>
                <TableCell align="center">
                  <div className="flex space-x-2 justify-center"></div>

                  <button
                    onClick={() =>
                      openDeleteDialog(category._id, category.name)
                    }
                    className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    <DeleteIcon />
                  </button>
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
                count={subcategories.length}
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
        Add Sub Category
      </button>
      <SubCategoryAddDialog
        open={openAddCategoryDialog}
        onClose={handleCloseDialog}
        fetchSubCategories={fetchSubCategories}
      />
      <SubCategoryDeleteDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onDelete={handleDeleteCategory}
        parentCategoryName={selectedCategoryName}
      />
    </>
  );
};

export default SubCategoryTable;
