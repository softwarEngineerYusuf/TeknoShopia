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
import { getAllSubCategories } from "../../allAPIs/CategoryApi"; // API fonksiyonunu içe aktar
import { SubCategory } from "../../types/ParentCategory"; // Category tipini içe aktar
const SubCategoryTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [subcategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // API'den alt kategorileri çek
  useEffect(() => {
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

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell>Alt Kategori Adı</TableCell>
            <TableCell align="right">Ana Kategori Adı</TableCell>
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
  );
};

export default SubCategoryTable;
