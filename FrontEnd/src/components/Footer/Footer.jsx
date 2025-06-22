import "./footer.css";
import { YouTube, Instagram, LinkedIn, Twitter } from "@mui/icons-material";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-navbar justify-content-between p-5 mt-5">
        <nav>
          <ul>
            <li>
              <a className="fs-5" href="#">TeknoShopia</a>
            </li>
            <li>
              <div className="social-icons">
                <a href="https://www.youtube.com/@uskudaruniversitesi">
                  <YouTube className="icon" />
                </a>
                <a href="https://www.instagram.com/uskudaruni/">
                  <Instagram className="icon" />
                </a>
                <a href="https://www.linkedin.com/school/uskudar-universitesi/posts/?feedView=all">
                  <LinkedIn className="icon" />
                </a>
                <a href="https://x.com/uskudaruni?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor">
                  <Twitter className="icon" />
                </a>
              </div>
            </li>
            <li className="fs-5" >Customer Service: 0850 666 19 07</li>
          </ul>
        </nav>
      </div>
      
      <div className="footer-content">
        <div className="footer-section">
          <h3>TeknoShopia</h3>
          <ul>
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Our Human Resources</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Categories</h3>
          <ul>
            <li>
              <a href="#">Computer</a>
            </li>
            <li>
              <a href="#">Mobile Phone</a>
            </li>
            <li>
              <a href="#">Tablet</a>
            </li>
            <li>
              <a href="#">Laptop</a>
            </li>
            <li>
              <a href="#">Television</a>
            </li>
            <li>
              <a href="#">Smart Watch</a>
            </li>
            <li>
              <a href="#">Printer</a>
            </li>
            <li>
              <a href="#">Speaker</a>
            </li>
            <li>
              <a href="#">Gaming Chair</a>
            </li>
            <li>
              <a href="#">Game Console</a>
            </li>
            <li>
              <a href="#">Headphones</a>
            </li>
            <li>
              <a href="#">Camera</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Customer Service</h3>
          <ul>
            <li>
              <a href="#">Process Guide</a>
            </li>
            <li>
              <a href="#">Cancellation and Return</a>
            </li>
            <li>
              <a href="#">Payment Options</a>
            </li>
            <li>
              <a href="#">Warranty</a>
            </li>
            <li>
              <a href="#">E-Invoice</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
