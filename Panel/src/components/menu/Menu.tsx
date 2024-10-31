import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import CategoryIcon from "@mui/icons-material/Category";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonIcon from "@mui/icons-material/Person";

interface MenuProps {
  isCollapsed: boolean;
}

const Menu: React.FC<MenuProps> = ({ isCollapsed }) => {
  return (
    <div className=" mt-10">
      <div className="flex items-center mb-4  ">
        <Link
          to="/"
          className="mx-1 flex flex-1 items-center p-2  hover:bg-gray-400 rounded-md transition-colors duration-200 text-xl"
        >
          {" "}
          <span className="mr-2 flex items-center">
            <HomeIcon color="primary" />
          </span>
          {!isCollapsed && "Home"}
        </Link>
      </div>
      <div className="flex items-center  mb-4 ">
        <Link
          to="/"
          className="mx-1 flex flex-1 items-center p-2  hover:bg-gray-400 rounded-md transition-colors duration-200 text-xl"
        >
          {" "}
          <span className="mr-2 flex items-center">
            <PersonIcon color="primary" />
          </span>
          Users
        </Link>
      </div>
      <div className="flex items-center  mb-4 ">
        <Link
          to="/products"
          className="mx-1 flex flex-1 items-center p-2  hover:bg-gray-400 rounded-md transition-colors duration-200 text-xl"
        >
          {" "}
          <span className="mr-2 flex items-center">
            <ProductionQuantityLimitsIcon color="primary" />
          </span>
          Products
        </Link>
      </div>
      <div className="flex items-center mb-4  ">
        <Link
          to="/"
          className="mx-1 flex flex-1 items-center p-2  hover:bg-gray-400 rounded-md transition-colors duration-200 text-xl"
        >
          {" "}
          <span className="mr-2 flex items-center">
            <CategoryIcon color="primary" />
          </span>
          Category
        </Link>
      </div>
      <div className="flex items-center mb-4  ">
        <Link
          to="/"
          className="mx-1 flex flex-1 items-center p-2  hover:bg-gray-400 rounded-md transition-colors duration-200 text-xl"
        >
          {" "}
          <span className="mr-2 flex items-center">
            <BrandingWatermarkIcon color="primary" />
          </span>
          Brands
        </Link>
      </div>

      <div className="flex items-center mb-4  ">
        <Link
          to="/orders"
          className="mx-1 flex flex-1 items-center p-2  hover:bg-gray-400 rounded-md transition-colors duration-200 text-xl"
        >
          {" "}
          <span className="mr-2 flex items-center">
            <AttachMoneyIcon color="primary" />
          </span>
          Orders
        </Link>
      </div>
    </div>
  );
};

export default Menu;
