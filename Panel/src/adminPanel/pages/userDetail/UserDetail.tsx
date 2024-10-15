import { singleUser } from "../../../menuData";
import Single from "../../components/single/Single";
import "./userDetail.scss";

const UserDetail = () => {

  // veri çek ve single componente gönder
  return <div className="userDetail">
    <Single {...singleUser}/>
  </div>;
};

export default UserDetail;
