import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../Navbar/Navbar.css";
import logo from "../../assets/TeknoShopiaLogo.png";
import { useEffect, useState } from "react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { HeartFilled } from "@ant-design/icons";
import ViewListIcon from "@mui/icons-material/ViewList";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { message } from "antd";
function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const ClearUser = () => {
    message.success("Başarıyla çıkış yapıldı!");
    if (logout) logout();
    navigate("/");
  };
  useEffect(() => {
    // Kullanıcı değişimini logla
    // console.log("User bilgisi:", user);
  }, [user]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-image" />
        </Link>
      </div>

      <div className="navbar-search">
        <div className="navbar-search-inner">
          <FaSearch className="navbar-search-icon" />
          <input
            type="search"
            name="Search"
            placeholder="Ürün, marka veya kategori ara..."
            className="navbar-search-input"
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
            <span>Giriş Yap</span>
          </Link>
        )}
        <Link to="/basket" className="navbar-button navbar-cart-button">
          {" "}
          {/* YENİ: Özel bir class ekledik */}
          <FaShoppingCart className="iconNav" />
          <span>Sepetim</span>
          {/* Ürün sayısı 0'dan büyükse rozeti göster */}
          {cartItemCount > 0 && (
            <span className="cart-badge">{cartItemCount}</span>
          )}
        </Link>
        {user && (
          <>
            <Link to="/favorites" className="navbar-button">
              <HeartFilled className="iconNav" />
              <span>Favoriler</span>
            </Link>
            <Link to="/myorders" className="navbar-button">
              <ViewListIcon className="iconNav" />
              <span>Siparişlerim</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
