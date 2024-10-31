import "../Register/Register.css";
import { useNavigate } from "react-router-dom";
function Register() {
  const navigate = useNavigate();
  return (
    <>
      <div className="RegisterPageMain">
        <div className="boxOfRegister">
          <div className="LoginAndRegisterButtonRgs">
            <div
              className="UnderLoginAndRegisterButtonRgs"
              style={{
                backgroundColor: "#2C2C2C",
                borderRadius: "10px",
                color: "white",
                padding: "3px 8px",
              }}
            >
              <button onClick={() => navigate("/")}>Login</button>
            </div>
            <div
              className="UnderLoginAndRegisterButtonRgs"
              style={{ backgroundColor: "##2C2C2C" }}
            >
              <button>Register</button>
            </div>
          </div>
          <div className="allInputsRgs">
            <div>
              <input
                className="inputsOfLoginRgs"
                type="text"
                placeholder="Full Name"
              />
            </div>
            <div>
              <input
                className="inputsOfLoginRgs"
                type="email"
                placeholder="E-Posta"
              />
            </div>
            <div>
              <input
                className="inputsOfLoginRgs"
                type="password"
                placeholder="Password"
              />
            </div>
            <div>
              <input
                className="inputsOfLoginRgs"
                type="password"
                placeholder="Confirm Password"
              />
            </div>
            <div className="checkboxRgs">
              <input className="inputsOfLoginRgs" type="checkbox" /> Contact
              Permissions{" "}
            </div>
          </div>
          <div className="loginButtonRegister">
            <button>Login</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
