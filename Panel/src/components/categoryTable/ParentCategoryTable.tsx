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
import { getAllMainCategories } from "../../allAPIs/CategoryApi"; // API fonksiyonunu ve tipleri içe aktar
import { Category } from "../../types/ParentCategory";

const ParentCategoryTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // API'den kategorileri çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllMainCategories();
        setCategories(data.categories);
      } catch (err) {
        setError(err.message || "Kategoriler alınırken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

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

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableHead>
          <TableRow>
            <TableCell>Ana Kategoriler</TableCell>
            <TableCell align="right">Alt Kategori Sayısı</TableCell>
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
              <TableCell style={{ width: 160 }} align="right">
                {category.subCategories ? category.subCategories.length : 0}{" "}
                {/* SubCategories sayısı */}
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
  );
};

export default ParentCategoryTable;
