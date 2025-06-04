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
                <a href="#">
                  <YouTube className="icon" />
                </a>
                <a href="#">
                  <Instagram className="icon" />
                </a>
                <a href="#">
                  <LinkedIn className="icon" />
                </a>
                <a href="#">
                  <Twitter className="icon" />
                </a>
              </div>
            </li>
            <li className="fs-5" >Müşteri Hattı: 0850 666 19 07</li>
          </ul>
        </nav>
      </div>
      
      <div className="footer-content">
        <div className="footer-section">
          <h3>TeknoShopia</h3>
          <ul>
            <li>
              <a href="#">Hakkımızda</a>
            </li>
            <li>
              <a href="#">İletişim</a>
            </li>
            <li>
              <a href="#">Gizlilik Politikamız</a>
            </li>
            <li>
              <a href="#">İnsan Kaynaklarımız</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Kategoriler</h3>
          <ul>
            <li>
              <a href="#">Bilgisayar</a>
            </li>
            <li>
              <a href="#">Cep Telefonu</a>
            </li>
            <li>
              <a href="#">Tablet</a>
            </li>
            <li>
              <a href="#">Laptop</a>
            </li>
            <li>
              <a href="#">Televizyon</a>
            </li>
            <li>
              <a href="#">Akıllı Saat</a>
            </li>
            <li>
              <a href="#">Yazıcı</a>
            </li>
            <li>
              <a href="#">Hoparlör</a>
            </li>
            <li>
              <a href="#">Oyuncu Koltuğu</a>
            </li>
            <li>
              <a href="#">Oyun Konsolu</a>
            </li>
            <li>
              <a href="#">Kulaklık</a>
            </li>
            <li>
              <a href="#">Kamera</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Müşteri Hizmetleri</h3>
          <ul>
            <li>
              <a href="#">İşlem Rehberi</a>
            </li>
            <li>
              <a href="#">İptal ve İade</a>
            </li>
            <li>
              <a href="#">Ödeme Seçenekleri</a>
            </li>
            <li>
              <a href="#">Garanti</a>
            </li>
            <li>
              <a href="#">E-Fatura</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
