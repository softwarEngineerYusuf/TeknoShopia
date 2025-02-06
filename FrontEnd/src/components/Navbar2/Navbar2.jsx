import "./Navbar2.css";
import Chatbot from "../../assets/chatbot.png";

function Navbar2() {
  return (
    <div className="Navbar2All">
      <div className="Navbar2Links">
        <a href="">TV</a>
        <a href="">Telephone</a>
        <a href="">Tablet</a>
        <a href="">Smart Watch</a>
        <a href="">Camera</a>
        <a href="">Speaker</a>
        <a href="">Printer</a>
        <a href="">Game Console</a>
        <a href="">Game Chair</a>
        <a href="">Earphones </a>
        <a href="">Bluetooth Headset</a>
        <a href="">
          <img
            style={{ width: "50px", height: "50px" }}
            src={Chatbot}
            alt="Chatbot"
          />
        </a>
      </div>
    </div>
  );
}

export default Navbar2;
