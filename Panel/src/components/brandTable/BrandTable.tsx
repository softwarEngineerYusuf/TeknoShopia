import React, { useState, useEffect } from "react";
import axios from "axios";
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
import BrandPaginationActions from "./BrandTablePagination";
import BrandAddDialog from "./BrandAddDialog";

interface Brand {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  logo?: string;
}

export default function BrandTable() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClickOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/brand/getAllBrands"
      );
      setBrands(response.data);
    } catch (error) {
      setError("Failed to fetch brands.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBrand = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/brand/deleteBrand/${id}`);
      setBrands(brands.filter((brand) => brand._id !== id));
    } catch (error) {
      console.error("Failed to delete brand:", error);
      setError("Failed to delete brand.");
    }
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
    return <div>Loading...</div>;
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
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
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
              <TableRow key={brand.name}>
                <TableCell component="th" scope="row">
                  <img
                    src={brand.logo || "https://via.placeholder.com/50"}
                    alt={brand.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                </TableCell>
                <TableCell>{brand.name}</TableCell>
                <TableCell>{brand.description || "No Description"}</TableCell>
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
                    <button className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">
                      Update
                    </button>
                    <button
                      className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                      onClick={() => handleDeleteBrand(brand._id)}
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
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
        Add Brand
      </button>
      <BrandAddDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onBrandAdded={fetchBrands}
      />
    </>
  );
}
