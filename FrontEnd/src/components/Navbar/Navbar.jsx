import React from "react";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom"; // Link'i içe aktar
import "../Navbar/Navbar.css";
import logo from "../../assets/TeknoShopiaLogo.png";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-image" />{" "}
        </Link>
      </div>

      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search Product"
          className="search-input"
        />
        <FaSearch className="search-icon" /> {/* Arama ikonu */}
      </div>

      <div className="navbar-buttons">
        <Link to="/login" className="navbar-button">
          <FaUser className="icon" /> {/* Giriş Yap ikonu */}
          Login
        </Link>
        <Link to="/basket" className="navbar-button">
          <FaShoppingCart className="icon" /> {/* Sepetim ikonu */}
          Basket
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
