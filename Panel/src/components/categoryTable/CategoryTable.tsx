import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import CategoryTablePagination from "./CategoryTablePagination";

const rows = [
  { name: "Cupcake", calories: 305, fat: 3.7 },
  { name: "Donut", calories: 452, fat: 25.0 },
  { name: "Eclair", calories: 262, fat: 16.0 },
  { name: "Frozen yoghurt", calories: 159, fat: 6.0 },
  { name: "Gingerbread", calories: 356, fat: 16.0 },
  { name: "Honeycomb", calories: 408, fat: 3.2 },
  { name: "Ice cream sandwich", calories: 237, fat: 9.0 },
  { name: "Jelly Bean", calories: 375, fat: 0.0 },
  { name: "KitKat", calories: 518, fat: 26.0 },
  { name: "Lollipop", calories: 392, fat: 0.2 },
  { name: "Marshmallow", calories: 318, fat: 0 },
  { name: "Nougat", calories: 360, fat: 19.0 },
  { name: "Oreo", calories: 437, fat: 18.0 },
];

const CategoryTable = () => {
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
      <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.calories}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row.fat}
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={CategoryTablePagination}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default CategoryTable;
