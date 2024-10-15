import { Link } from "react-router-dom";
import "./dataTable.scss";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";

type Props = {
  columns: GridColDef[];
  rows: object[];
  slug: string;
};

const handleDelete = (id: number) => {
  //delete the item
  //axios.delete("/api/${slug}/id")
  console.log(id + "has been deleted");
};

const DataTable = (props: Props) => {
  const actionColumn: GridColDef = {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="action">
          <Link to={`/${props.slug}/${params.row.id}`}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/5525/5525861.png"
              alt=""
            />
          </Link>

          <div className="delete" onClick={() => handleDelete(params.row.id)}>
            <img src="https://cdn-icons-png.flaticon.com/512/5525/5525861.png" />
          </div>
        </div>
      );
    },
  };

  return (
    <div className="dataTable">
      <DataGrid
        className="dataGrid"
        rows={props.rows}
        columns={[...props.columns, actionColumn]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />
    </div>
  );
};

export default DataTable;
