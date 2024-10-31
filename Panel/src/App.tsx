import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Order from "./pages/Order";
import Product from "./pages/Product";
import Menu from "./components/menu/Menu";
function App() {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(false);
  return (
    <>
      <Router>
        <div className="bg-gray-800 text-white min-h-screen flex flex-col">
          <Navbar
            isMenuCollapsed={isMenuCollapsed}
            setIsMenuCollapsed={setIsMenuCollapsed}
          />
          <div className="flex flex-grow">
            <div
              className={`${
                isMenuCollapsed ? "w-1/6" : "w-1/6"
              } min-w-[3rem] bg-gray-700 transition-all duration-300`}
            >
              <Menu isCollapsed={isMenuCollapsed} />
            </div>
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Product />} />
                <Route path="/orders" element={<Order />} />
              </Routes>
            </div>
          </div>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
