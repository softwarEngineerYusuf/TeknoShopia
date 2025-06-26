import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../Navbar/Navbar.css";
import logo from "../../assets/TeknoShopiaLogo.png";
// YENİ İMPORTLAR
import { useEffect, useState, useRef } from "react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { HeartFilled } from "@ant-design/icons";
import ViewListIcon from "@mui/icons-material/ViewList";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { message } from "antd";
// YENİ İMPORTLAR
import { getAllProducts } from "../../allAPIs/product";
import SearchResults from "../SearchResults/SearchResults";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const [allProducts, setAllProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      const products = await getAllProducts();
      setAllProducts(products);
    };
    fetchAllProducts();
  }, []);

  // Arama kutusuna yazıldıkça filtreleme yap
  const handleSearchChange = (e) => {
    const currentSearchTerm = e.target.value;
    setSearchTerm(currentSearchTerm);

    if (currentSearchTerm.length > 0) {
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(currentSearchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]); // Arama kutusu boşsa sonuçları temizle
    }
  };

  // Sonuç listesini kapatma fonksiyonu
  const closeSearchResults = () => {
    setSearchTerm("");
    setFilteredProducts([]);
  };

  // Dışarı tıklandığında arama sonuçlarını kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        closeSearchResults();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  const ClearUser = () => {
    message.success("Logged Out Successfully!");
    if (logout) logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-image" />
        </Link>
      </div>

      <div className="navbar-search" ref={searchContainerRef}>
        <div className="navbar-search-inner">
          {" "}
          {/* Konumlandırma referansımız bu div olacak */}
          <FaSearch className="navbar-search-icon" />
          <input
            type="search"
            name="Search"
            placeholder="Search the products..."
            className="navbar-search-input"
            value={searchTerm}
            onChange={handleSearchChange}
            autoComplete="off"
          />
          {/* SearchResults'ı input ile aynı seviyeye, içeri taşıdık */}
          <SearchResults
            results={filteredProducts}
            onResultClick={closeSearchResults}
          />
        </div>
      </div>

      <button
        className="navbar-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span className="navbar-menu-icon">☰</span>
      </button>

      <div className={`navbar-buttons${menuOpen ? " open" : ""}`}>
        {user ? (
          <button
            className="navbar-button navbar-user-btn"
            onClick={ClearUser}
            title="Çıkış yap"
          >
            <DeleteRoundedIcon />
            <span className="ml-1">{user.name}</span>
          </button>
        ) : (
          <Link to="/Login" className="navbar-button navbar-login-btn">
            <FaUser className="iconNav" />
            <span>Login</span>
          </Link>
        )}
        <Link to="/basket" className="navbar-button navbar-cart-button">
          <FaShoppingCart className="iconNav" />
          <span>My Cart</span>
          {cartItemCount > 0 && (
            <span className="cart-badge">{cartItemCount}</span>
          )}
        </Link>
        {user && (
          <>
            <Link to="/favorites" className="navbar-button">
              <HeartFilled className="iconNav" />
              <span>Favorites</span>
            </Link>
            <Link to="/myorders" className="navbar-button">
              <ViewListIcon className="iconNav" />
              <span>My Orders</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
