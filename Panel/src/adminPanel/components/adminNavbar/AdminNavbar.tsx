import "./adminNavbar.scss";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdSquareOutline } from "react-icons/io";
import { HiSquares2X2 } from "react-icons/hi2";
const AdminNavbar = () => {
  return (
    <div className="adminNavbar">
      <div className="navbarLogo">
        <img
          style={{ width: "2rem" }}
          src="https://cdn-icons-png.freepik.com/512/6489/6489458.png"
          alt=""
        />
        <span>AdminPanemName</span>
      </div>
      <div className="navbarIcons">
        <IoSearchOutline  className="iconn"/>
        <IoMdSquareOutline className="iconn"/>
        <HiSquares2X2 className="iconn"/>
        <div className="notification">
          <IoNotificationsOutline />
          <span>1</span>
        </div>
        <div className="user">
          <img src="https://mui.com/static/images/avatar/1.jpg" alt="" />
          <span>Yusuf</span>
        </div>
        <img src="" alt="" className="imgIcon" />
      </div>
    </div>
  );
};

export default AdminNavbar;
