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
function App() {
  const [isMenuClosed, setIsMenuClosed] = useState<boolean>(false); //butona basıldığında menümüz daha küçük hale gelir.
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
                <Route path="/brands" element={<Brand />} />
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
