import "../Register/Register.css";
import { useNavigate } from "react-router-dom";
import * as React from "react";
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

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

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
              <button onClick={() => navigate("/login")}>Login</button>
            </div>
            <div
              className="UnderLoginAndRegisterButtonRgs"
              style={{ backgroundColor: "##2C2C2C" }}
            >
              <button>Register</button>
            </div>
          </div>
          <div className="allInputsRgs">
            <div className="inputRgs">
              <Box
                component="form"
                sx={{ "& > :not(style)": { width: "100%" } }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-basic"
                  label="FullName"
                  variant="outlined"
                />
              </Box>
            </div>
            <div className="inputRgs">
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
                />
              </Box>
            </div>
            <div className="inputRgs">
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
            <div className="inputRgs">
              <Box
                component="form"
                sx={{ "& .MuiTextField-root": { width: "100%" } }}
                noValidate
                autoComplete="off"
              >
                <FormControl sx={{ width: "100%" }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-password">
                    Confirm Password
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
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
            <div className="checkboxRgs" style={{ maxWidth: "350px" }}>
              <input className="inputsOfLoginRgs" type="checkbox" /> I approve
              of Teknoshopia sending commercial electronic messages via e-mail.{" "}
            </div>
          </div>
          <div className="loginButtonRegister">
            <Stack spacing={2} direction="row">
              <Button variant="contained">Register</Button>
            </Stack>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
