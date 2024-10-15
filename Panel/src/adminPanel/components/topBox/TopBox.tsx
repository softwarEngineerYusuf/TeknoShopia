import "./topbox.scss";
import { topDealUsers } from "../../../menuData";
const TopBox = () => {
  return (
    <div className="topBox">
      <h1>Top Deals</h1>
      <div className="topBoxList">
        {topDealUsers.map((user) => (
          <div className="topBoxListItem" key={user.id}>
            <div className="topBoxListUser">
              <img src={user.img} alt="" />
              <div className="userText">
                <span className="username">{user.username}</span>
                <span className="email">{user.email}</span>
              </div>
            </div>
            <span className="amount">{user.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopBox;
