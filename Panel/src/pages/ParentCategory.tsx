import ParentCategoryTable from "../components/categoryTable/ParentCategoryTable";
const ParentCategory = () => {
  return (
    <div className="mr-5 ml-5">
      {" "}
      <div className="mt-4">
        <h1> Parent Category List</h1>
        <ParentCategoryTable />
      </div>
    </div>
  );
};

export default ParentCategory;
