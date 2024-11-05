import "../Login/Login.css";
import { useNavigate } from "react-router-dom";
function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    window.open("http://localhost:5000/api/auth/google", "_self");
  };

  const handleGoogleLogout = () => {
    // Kullanıcıyı Google'dan çıkış yaptırmak için Google'ın logout URL'sini açıyoruz
    window.open("https://accounts.google.com/Logout", "_self");
    navigate("/");
  };

  return (
    <>
      <div className="LoginPageMain">
        <div className="boxOfLogin">
          <div className="LoginAndRegisterButtonLgn">
            <div
              className="UnderLoginAndRegisterButtonLgn"
              style={{ backgroundColor: "##2C2C2C" }}
            >
              <button>Login</button>
            </div>
            <div
              className="UnderLoginAndRegisterButtonLgn"
              style={{
                backgroundColor: "#2C2C2C",
                borderRadius: "10px",
                color: "white",
                padding: "3px 8px",
              }}
            >
              <button onClick={() => navigate("/register")}>Register</button>
            </div>
          </div>
          <div className="allInputsLgn">
            <div>
              <input
                className="inputsOfLoginLgn"
                type="email"
                name="E-Posta"
                placeholder="E-Posta"
              />
            </div>
            <div>
              <input
                className="inputsOfLoginLgn"
                type="password"
                placeholder="Password"
              />
            </div>
          </div>
          <div>
            <div className="loginButtonLogin">
              <button>Login</button>
            </div>
            <div className="forgotPasswordLink">
              {" "}
              <a href="">Forgot Password</a>{" "}
            </div>
            <button onClick={handleGoogleLogin}>Google ile Giriş Yap</button>
            <div>
              <button onClick={handleGoogleLogout}>Çıkış</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
