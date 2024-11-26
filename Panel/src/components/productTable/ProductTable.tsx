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
import TablePaginationActions from "./ProductTablePagination";
import { getAllProducts } from "../../allAPIs/ProductApi";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
interface Product {
  _id: string;
  mainImage?: string;
  brand: { name: string };
  name: string;
  price: number;
  stock: number;
  discountedPrice?: number;
}

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();

  const handleProductDetails = (id: string) => {
    navigate(`/productDetails/${id}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();

        const formattedProducts = data.map((product: Product) => ({
          ...product,
          brand: product?.brand?.name || "Unknown Brand",
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  //paginations

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

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
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="product table">
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Discounted Price</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? products.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : products
            ).map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                </TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{`$${product.price.toFixed(2)}`}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>
                  {product.discountedPrice
                    ? `$${product.discountedPrice.toFixed(2)}`
                    : "No Discount"}
                </TableCell>
                <TableCell align="right">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleProductDetails(product._id)}
                      className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                      <RemoveRedEyeIcon />
                    </button>
                    <button className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600">
                      <DeleteIcon />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={7}
                count={products.length}
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
      <button className="px-4 py-2 mt-2 text-white bg-green-500 rounded hover:bg-green-600">
        Add Product
      </button>
    </>
  );
}
