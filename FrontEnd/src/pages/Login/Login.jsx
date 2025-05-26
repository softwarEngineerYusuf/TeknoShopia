import "../Login/Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import GoogleIcon from "@mui/icons-material/Google";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("yusuf1@gmail.com");
  const [password, setPassword] = useState("123456789");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:5000/api/auth/google", "_self");
  };

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      setError("E-posta adresi veya şifre yanlış.");
      console.error("Giriş başarısız:", error);
    }
  };

  return (
    <>
      <div className="LoginPageMain">
        <div className="boxOfLogin" style={{ padding: "50px 50px" }}>
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
          {error && (
            <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
          )}
          <div className="allInputsLgn">
            <div className="emailInputLogin">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "100%" } }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-basic"
                  label="E-Posta"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Box>
            </div>
            <div>
              <Box
                component="form"
                sx={{ "& .MuiTextField-root": { width: "100%" } }}
                noValidate
                autoComplete="off"
              >
                <FormControl sx={{ width: "100%" }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword
                              ? "hide the password"
                              : "display the password"
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
              </Box>
            </div>
          </div>
          <div>
            <div className="loginButtonLogin">
              <Stack spacing={2} direction="row">
                <Button variant="contained" onClick={handleLogin}>
                  Login
                </Button>
              </Stack>
            </div>
            <div className="forgotPasswordLink">
              {" "}
              <a href="">Forgot Password?</a>{" "}
            </div>
            <div className="googleLoginButton">
              <button
                style={{
                  border: "1px solid #21005D",
                  borderRadius: "30px",
                  width: "100%",
                }}
                onClick={handleGoogleLogin}
              >
                <GoogleIcon style={{ color: "red" }} /> sign up with google
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
