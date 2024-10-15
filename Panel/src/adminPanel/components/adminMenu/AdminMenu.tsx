import { Link } from "react-router-dom";
import "./adminMenu.scss";
import { menuData, MenuItem, ListItem } from "../../../menuData";

const AdminMenu = () => {
  return (
    <div className="adminMenu">
      {menuData.map((menuItem: MenuItem) => (
        <div className="menuItem" key={menuItem.id}>
          <span className="menuTitle">{menuItem.title}</span>
          {menuItem.listItems.map((item: ListItem) => (
            <Link to={item.url} className="menuListItem" key={item.id}>
              <img src={item.icon} alt="" />
              <span className="menuListTitle">{item.title}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AdminMenu;
