import "./App.css";
import { Route, Routes, Outlet } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Basket from "./pages/Basket/Basket";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Footer from "./components/Footer/Footer";
import Compare from "./pages/Compare/Compare";
import Category from "./pages/Category/Category";
import Favorites from "./components/Favorites/Favorites";
import MyOrders from "./components/MyOrders/MyOrders";
import TopPicksMore from "./pages/TopPicksMore/TopPicksMore";
import Payment from "./pages/Payment/Payment";
import { AuthProvider } from "./context/AuthContext";
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
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/productDetail/:id" element={<ProductDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/TopPicksMore" element={<TopPicksMore />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/payment" element={<Payment />} />
        </Route>
        <Route path="/Login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
