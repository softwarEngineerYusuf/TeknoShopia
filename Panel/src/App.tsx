import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Order from "./pages/Order";
import Product from "./pages/Product";
import Menu from "./components/menu/Menu";
import User from "./pages/User";
import Brand from "./pages/Brand";
import ParentCategory from "./pages/ParentCategory";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductDetails from "./components/productTable/ProductDetails";
import SubCategory from "./pages/SubCategory";
function App() {
  const [isMenuClosed, setIsMenuClosed] = useState<boolean>(false); //menü küçültmek için.
  return (
    <>
      <Router>
        <div className="bg-gray-800 text-white min-h-screen flex flex-col">
          <Navbar
            isMenuClosed={isMenuClosed}
            setIsMenuClosed={setIsMenuClosed}
          />
          <div className="flex flex-grow">
            <div
              className={`${
                isMenuClosed ? "w-15" : "w-52"
              } min-w-[3rem] bg-gray-700 transition-all duration-300  flex-shrink-0`}
            >
              <Menu isMenuClosed={isMenuClosed} />
            </div>
            <div className="flex-grow overflow-auto">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/user" element={<User />} />
                <Route path="/products" element={<Product />} />
                <Route path="/orders" element={<Order />} />
                <Route path="/brands" element={<Brand />} />4
                <Route path="/paretCategories" element={<ParentCategory />} />
                <Route path="/subCategories" element={<SubCategory />} />
                <Route
                  path="/productDetails/:id"
                  element={<ProductDetails />}
                />
              </Routes>
            </div>
          </div>
          <Footer />
        </div>
      </Router>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}

export default App;
