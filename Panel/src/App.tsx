import AdminFooter from "./adminPanel/components/adminFooter/AdminFooter";
import AdminMenu from "./adminPanel/components/adminMenu/AdminMenu";
import AdminNavbar from "./adminPanel/components/adminNavbar/AdminNavbar";
import Home from "./adminPanel/pages/home/Home";
import Login from "./adminPanel/pages/login/Login";
import PanelProducts from "./adminPanel/pages/panelProducts/PanelProducts";
import PanelUsers from "./adminPanel/pages/panelUsers/PanelUsers";
import ProductDetail from "./adminPanel/pages/productDetail/ProductDetail";
import UserDetail from "./adminPanel/pages/userDetail/UserDetail";


import "./styles/global.scss";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

function App() {
  const Layout = () => {
    return (
      <div className="main">
        <AdminNavbar />
        <div className="appContainer">
          <div className="menuContainer">
            <AdminMenu />
          </div>
          <div className="contentContainer">
            <Outlet />
          </div>
        </div>
        <AdminFooter />
      </div>
    );
  };
  return (
    <>
      {" "}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/users" element={<PanelUsers />} />
            <Route path="/products" element={<PanelProducts />} />
            <Route path="/productDetail/:id" element={<ProductDetail />} />
            <Route path="/userDetail/:id" element={<UserDetail />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
