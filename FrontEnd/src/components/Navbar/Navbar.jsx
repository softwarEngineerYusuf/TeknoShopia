import React from 'react';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa'; // İkonları içe aktar
import '../Navbar/Navbar.css';
import  logo from '../../assets/TeknoShopiaLogo.png';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" className="logo-image" /> {/* Logo resmini buraya ekleyin */}
      </div>
      
      <div className="navbar-search">
        <input type="text" placeholder="Search" className="search-input" />
        <FaSearch className="search-icon" /> {/* Arama ikonu */}
      </div>
      
      <div className="navbar-buttons">
        <button className="navbar-button">
          <FaUser className="icon" /> {/* Giriş Yap ikonu */}
          Login
        </button>
        <button className="navbar-button">
          <FaShoppingCart className="icon" /> {/* Sepetim ikonu */}
          Basket
        </button>
      </div>
    </nav>
  );
}

export default Navbar;