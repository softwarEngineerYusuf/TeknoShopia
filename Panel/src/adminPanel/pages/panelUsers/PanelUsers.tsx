import { useState } from "react";
import { userRows } from "../../../menuData";
import DataTable from "../../components/dataTable/DataTable";
import "./panelUsers.scss";
import { GridColDef } from "@mui/x-data-grid";
import Add from "../../components/add/Add";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "img",
    headerName: "Avatar",
    width: 100,
    renderCell: (params) => {
      return (
        <img className="avatarImg" src={params.row.img || "/noavatar.png"} />
      );
    },
  },

  {
    field: "firstName",
    type: "string",
    headerName: "First name",
    width: 150,
  },
  {
    field: "lastName",
    type: "string",
    headerName: "Last name",
    width: 150,
  },
  {
    field: "email",
    type: "string",
    headerName: "Email",
    width: 200,
  },
  {
    field: "phone",
    type: "string",
    headerName: "string",

    width: 200,
  },
  {
    field: "CreatedAt",
    headerName: "Created At",
    width: 200,
    type: "string",
  },
  {
    field: "verified",

    headerName: "Verified",
    width: 200,
    type: "boolean",
  },
];

const PanelUsers = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="users">
      <div className="info">
        <h1>Users</h1>
        <button onClick={() => setOpen(true)}>Add New User</button>
      </div>

      <DataTable slug="userDetail" columns={columns} rows={userRows} />
      {open && <Add slug="user" columns={columns} setOpen={setOpen} />}
    </div>
  );
};

export default PanelUsers;
