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

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/productDetail" element={<ProductDetail/>} />
      </Routes>
    </Router>
  );
}

export default App;
