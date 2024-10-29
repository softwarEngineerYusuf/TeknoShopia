import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Order from "./pages/Order";
import Product from "./pages/Product";
import Menu from "./components/menu/Menu";
function App() {
  return (
    <>
      <Router>
        <div className="bg-gray-800 text-white min-h-screen flex flex-col">
          {" "}
          <Navbar />
          <div className="flex flex-grow">
            {/* flex flex-col menüyü sonuna kadar iter */}
            <div className=" w-1/6 min-w-[12rem] bg-gray-700 ">
              <Menu />
            </div>
            <div className="flex-grow ">
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
