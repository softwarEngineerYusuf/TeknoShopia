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
import Brands from "./pages/Brands/Brands";
// AuthProvider, App bileşeninin kendisini sarmalamalı
import { AuthProvider } from "./context/AuthContext";
// Sadece Provider'ı App'de kullanacağız
import { CompareProvider } from "./context/CompareContext";
// Hook'u ve Section'ı artık yeni bileşenimizde kullanacağız
import CompareSection from "./components/CompareSection/CompareSection";
import { useCompare } from "./context/CompareContext";

// Layout bileşeni aynı kalabilir, bir sorun yok.
function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

// 1. Rotaları ve context'i kullanan mantığı içeren yeni bir bileşen oluşturun.
function AppContent() {
  // useCompare hook'u artık CompareProvider'ın içinde çağrıldığı için doğru çalışacak.
  const { compareList } = useCompare();

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          {/* productDetail yerine product/:id daha standart bir kullanımdır */}
          <Route path="/productDetail/:id" element={<ProductDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/TopPicksMore" element={<TopPicksMore />} />
          <Route path="/category/:id" element={<Category />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/compare" element={<Compare />} />
        </Route>
        <Route path="/Login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/basket" element={<Basket />} />
      </Routes>

      {/* Bu mantık artık doğru yerde. */}
      {compareList.length > 0 && <CompareSection />}
    </>
  );
}

// 2. App bileşenini basitleştirin. Görevi sadece Provider'ları ayarlamak olsun.
function App() {
  return (
    <AuthProvider>
      <CompareProvider>
        {/* Asıl uygulama mantığını içeren AppContent'i burada render edin */}
        <AppContent />
      </CompareProvider>
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
