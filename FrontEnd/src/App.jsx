import "./App.css";
import { Route, Routes, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { CompareProvider } from "./context/CompareContext";
import { useCompare } from "./context/CompareContext";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Basket from "./pages/Basket/Basket";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Compare from "./pages/Compare/Compare";
import Category from "./pages/Category/Category";
import Payment from "./pages/Payment/Payment";
import Brands from "./pages/Brands/Brands";
import TopPicksMore from "./pages/TopPicksMore/TopPicksMore";
import "antd/dist/reset.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Favorites from "./components/Favorites/Favorites";
import MyOrders from "./components/MyOrders/MyOrders";
import CompareSection from "./components/CompareSection/CompareSection";
import Navbar2 from "./components/Navbar2/Navbar2";
import Chatbot from "./pages/Chatbot/Chatbot";

function MainLayout() {
  return (
    <>
      <Navbar />
      <Navbar2 />
      <Outlet />
      <Footer />
    </>
  );
}

function AppRoutes() {
  const { compareList } = useCompare();

  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/productDetail/:id" element={<ProductDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/TopPicksMore" element={<TopPicksMore />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/brands/:brandId" element={<Brands />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/basket" element={<Basket />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Route>
      </Routes>

      {compareList.length > 0 && <CompareSection />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <CompareProvider>
          <AppRoutes />
        </CompareProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

// import "./App.css";
// import { Route, Routes, Outlet } from "react-router-dom";
// import Login from "./pages/Login/Login";
// import Register from "./pages/Register/Register";
// import Home from "./pages/Home/Home";
// import Navbar from "./components/Navbar/Navbar";
// import Basket from "./pages/Basket/Basket";
// import ProductDetail from "./pages/ProductDetail/ProductDetail";
// import Footer from "./components/Footer/Footer";
// import Compare from "./pages/Compare/Compare";
// import Category from "./pages/Category/Category";
// import Favorites from "./components/Favorites/Favorites";
// import MyOrders from "./components/MyOrders/MyOrders";
// import TopPicksMore from "./pages/TopPicksMore/TopPicksMore";
// import Payment from "./pages/Payment/Payment";
// import { AuthProvider } from "./context/AuthContext";
// import { CompareProvider } from "./context/CompareContext";
// import Brands from "./pages/Brands/Brands";
// import CompareSection from "./components/CompareSection/CompareSection";
// import { useCompare } from "./context/CompareContext";
// function Layout() {
//   return (
//     <>
//       <Navbar />
//       <Outlet />
//       <Footer />
//     </>
//   );
// }
// function App() {
//   const { compareList } = useCompare();
//   return (
//     <AuthProvider>
//       <CompareProvider>
//         <Routes>
//           <Route element={<Layout />}>
//             <Route path="/" element={<Home />} />
//             <Route path="/productDetail/:id" element={<ProductDetail />} />
//             <Route path="/favorites" element={<Favorites />} />
//             <Route path="/myorders" element={<MyOrders />} />
//             <Route path="/TopPicksMore" element={<TopPicksMore />} />
//             <Route path="/category/:id" element={<Category />} />
//             <Route path="/payment" element={<Payment />} />
//             <Route path="/brands" element={<Brands />} />
//           </Route>
//           <Route path="/Login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/basket" element={<Basket />} />
//           <Route path="/compare" element={<Compare />} />
//         </Routes>
//         {compareList.length > 0 && <CompareSection />}
//         {/* CompareSection, compareList boş değilse gösterilecek */}
//       </CompareProvider>
//     </AuthProvider>
//   );
// }

// export default App;
