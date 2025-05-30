import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../Navbar/Navbar.css";
import logo from "../../assets/TeknoShopiaLogo.png";
import { useEffect } from "react";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { HeartFilled } from "@ant-design/icons";
import ViewListIcon from "@mui/icons-material/ViewList";
import { useAuth } from "../../context/AuthContext";
function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const ClearUser = () => {
    console.log("silinmeye basıldı");

    navigate("/");
  };
  useEffect(() => {
    console.log("User bilgisi:", user);
  }, [user]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-image" />{" "}
        </Link>
      </div>

      <div className="navbar-search ">
        <fieldset className="w-full space-y-1 dark:text-gray-800">
          <label htmlFor="Search" className="hidden">
            Search
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
              <button
                type="button"
                title="search"
                className="p-1 focus:outline-none focus:ring"
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 512 512"
                  className="w-4 h-4 dark:text-gray-800"
                >
                  <path d="M479.6,399.716l-81.084-81.084-62.368-25.767A175.014,175.014,0,0,0,368,192c0-97.047-78.953-176-176-176S16,94.953,16,192,94.953,368,192,368a175.034,175.034,0,0,0,101.619-32.377l25.7,62.2L400.4,478.911a56,56,0,1,0,79.2-79.195ZM48,192c0-79.4,64.6-144,144-144s144,64.6,144,144S271.4,336,192,336,48,271.4,48,192ZM456.971,456.284a24.028,24.028,0,0,1-33.942,0l-76.572-76.572-23.894-57.835L380.4,345.771l76.573,76.572A24.028,24.028,0,0,1,456.971,456.284Z"></path>
                </svg>
              </button>
            </span>
            <input
              type="search"
              name="Search"
              placeholder="Search..."
              className="w-32 py-2 pl-10 text-sm rounded-md sm:w-auto focus:outline-none dark:bg-gray-100 dark:text-gray-800 focus:dark:bg-gray-50 focus:dark:border-violet-600"
            />
          </div>
        </fieldset>
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
          <Link to="/Login" className="navbar-button">
            <div className="login-container d-flex align-items-center">
              <FaUser className="iconNav" />
              <span>Login</span>
            </div>
          </Link>
        )}

        <Link to="/basket" className="navbar-button">
          <FaShoppingCart className="iconNav" />
          Basket
        </Link>

        <Link to="/favorites" className="navbar-button">
          <HeartFilled className="iconNav" />
          Favorites
        </Link>

        <Link to="/myorders" className="navbar-button">
          <ViewListIcon className="iconNav" />
          My Orders
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
