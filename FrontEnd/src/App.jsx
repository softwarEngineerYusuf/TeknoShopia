import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Basket from "./pages/Basket/Basket";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Footer from "./components/Footer/Footer";
import Compare from "./pages/Compare/Compare";
import Category from "./pages/Category/Category";

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/Home" element={<Home />} />
        </Route>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/productDetail" element={<ProductDetail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/category" element={<Category/>} />

      </Routes>
    </Router>
  );
}

export default App;
