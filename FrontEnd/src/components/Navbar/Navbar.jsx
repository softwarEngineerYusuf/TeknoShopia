import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom"; // Link'i içe aktar
import { useNavigate } from "react-router-dom";
import "../Navbar/Navbar.css";
import logo from "../../assets/TeknoShopiaLogo.png";
import { useSelector } from "react-redux";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useDispatch } from "react-redux";
import { clearUser } from "../../reduxToolkit/userSlice";
import { persistor } from "../../reduxToolkit/store";
function Navbar() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const ClearUser = () => {
    console.log("silinmeye basıldı");
    dispatch(clearUser());
    persistor.purge();
    navigate("/");
  };
  const dispatch = useDispatch();
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
        {user ? (
          <Link
            to="/"
            className="navbar-button"
            onClick={(e) => {
              e.preventDefault();
              ClearUser();
            }}
          >
            <DeleteRoundedIcon />
            {user.name}
          </Link>
        ) : (
          <Link to="/" className="navbar-button">
            <div className="login-container d-flex align-items-center">
              <FaUser className="icon" />
              <span>Login</span>
            </div>
          </Link>
        )}

        <Link to="/basket" className="navbar-button">
          <FaShoppingCart className="icon" /> {/* Sepetim ikonu */}
          Basket
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
