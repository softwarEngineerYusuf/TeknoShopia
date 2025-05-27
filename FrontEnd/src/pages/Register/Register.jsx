import "../Register/Register.css";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../context/AuthContext"; // AuthContext import edildi
import { Typography } from "@mui/material";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      setLoading(false);
      return;
    }

    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
      navigate("/"); // Başarılı kayıt sonrası anasayfaya yönlendir
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Kayıt sırasında bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
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
              style={{ backgroundColor: "##2C2C2C" }} // Çift # var, #2C2C2C olmalı
            >
              <button>Register</button>
            </div>
          </div>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ "& > :not(style)": { width: "100%" } }}
            noValidate
            autoComplete="off"
          >
            <div className="allInputsRgs">
              <div className="inputRgs">
                <TextField
                  id="fullName"
                  name="name"
                  label="FullName"
                  variant="outlined"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </div>
              <div className="inputRgs">
                <TextField
                  id="email"
                  name="email"
                  label="E-Posta"
                  variant="outlined"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </div>
              <div className="inputRgs">
                <FormControl sx={{ width: "100%" }} variant="outlined">
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <OutlinedInput
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
              </div>
              <div className="inputRgs">
                <FormControl sx={{ width: "100%" }} variant="outlined">
                  <InputLabel htmlFor="confirmPassword">
                    Confirm Password
                  </InputLabel>
                  <OutlinedInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Confirm Password"
                  />
                </FormControl>
              </div>
              {error && (
                <Typography
                  color="error"
                  variant="body2"
                  sx={{ mt: 1, textAlign: "center" }}
                >
                  {error}
                </Typography>
              )}
              <div className="checkboxRgs" style={{ maxWidth: "350px" }}>
                <input className="inputsOfLoginRgs" type="checkbox" /> I approve
                of Teknoshopia sending commercial electronic messages via
                e-mail.
              </div>
            </div>
            <div className="loginButtonRegister">
              <Stack spacing={2} direction="row">
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                >
                  {loading ? "Kaydediliyor..." : "Register"}
                </Button>
              </Stack>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
}

export default Register;
