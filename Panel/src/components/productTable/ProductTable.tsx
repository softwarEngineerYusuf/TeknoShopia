import React, { useState } from "react";
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
import TablePaginationActions from "./ProductTablePagination";

interface Product {
  image: string;
  brand: string;
  name: string;
  price: number;
  stock: number;
  discountedPrice?: number;
}

const rows: Product[] = [
  {
    image: "https://via.placeholder.com/50",
    brand: "Brand 1",
    name: "Sample Product",
    price: 100,
    stock: 50,
    discountedPrice: 90,
  },
];

export default function ProductTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

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

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="product table">
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Stock</TableCell>
            <TableCell>Discounted Price</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                <img
                  src={row.image}
                  alt={row.name}
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{`$${row.price.toFixed(2)}`}</TableCell>
              <TableCell>{row.stock}</TableCell>
              <TableCell>
                {row.discountedPrice
                  ? `$${row.discountedPrice.toFixed(2)}`
                  : "No Discount"}
              </TableCell>
              <TableCell align="right">
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600">
                    Update
                  </button>
                  <button className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">
                    Delete
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={5} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={5}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}
