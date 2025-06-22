import "../Login/Login.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "antd/dist/reset.css";
import { Card, Input, Button, Typography, Divider, Form, message } from "antd";
import {
  GoogleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("yusufkaya722172@gmail.com");
  const [password, setPassword] = useState("123456789");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [form] = Form.useForm();
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.opacity = 0;
      cardRef.current.style.transform = "translateY(40px) scale(0.98)";
      setTimeout(() => {
        cardRef.current.style.transition =
          "opacity 0.6s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1)";
        cardRef.current.style.opacity = 1;
        cardRef.current.style.transform = "translateY(0) scale(1)";
      }, 60);
    }
  }, []);

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
      message.success("Logged In Successfully!");
      navigate("/");
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setError("Email or password is incorrect.");
      message.error("Email or password is incorrect.");
    }
  };
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #21005D 60%, #7B2FF2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        ref={cardRef}
        style={{
          width: 380,
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(33,0,93,0.12)",
          opacity: 0,
          transform: "translateY(40px) scale(0.98)",
        }}
      >
        <Typography.Title
          level={3}
          style={{
            textAlign: "center",
            color: "#21005D",
            marginBottom: 8,
          }}
        >
          TeknoShopia Login
        </Typography.Title>
        <Divider style={{ margin: "12px 0 24px 0" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <Button
            type="primary"
            style={{
              background: "#21005D",
              borderRadius: 8,
              color: "#fff",
            }}
            disabled
          >
            Login
          </Button>
          <Button
            style={{
              background: "#f4f7fb",
              color: "#21005D",
              borderRadius: 8,
              border: "1px solid #e0e0e0",
            }}
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </div>
        {error && (
          <Typography.Text
            type="danger"
            style={{
              display: "block",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            {error}
          </Typography.Text>
        )}
        <Form form={form} layout="vertical" onFinish={handleLogin}>
          <Form.Item
            name="email"
            initialValue={email}
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            initialValue={password}
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{
                borderRadius: 8,
                background: "#21005D",
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        <div
          style={{
            textAlign: "center",
            margin: "8px 0 12px 0",
          }}
        >
          <a href="#" style={{ color: "#21005D" }}>
            Forgot Password?
          </a>
        </div>
        <Divider plain>or</Divider>
        <Button
          icon={<GoogleOutlined />}
          block
          size="large"
          style={{
            borderRadius: 8,
            background: "#fff",
            color: "#21005D",
            border: "1px solid #21005D",
          }}
          onClick={handleGoogleLogin}
        >
          Login with Google
        </Button>
      </Card>
    </div>
  );
}

export default Login;
