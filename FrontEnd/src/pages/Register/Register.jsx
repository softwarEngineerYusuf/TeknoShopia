import "../Register/Register.css";
import { useNavigate } from "react-router-dom";
import * as React from "react";
import "antd/dist/reset.css";
import { Card, Input, Button, Typography, Divider, Form, message, Checkbox } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext"; // AuthContext import edildi
import { useEffect, useRef } from "react";

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
  const [form] = Form.useForm();
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.opacity = 0;
      cardRef.current.style.transform = "translateY(40px) scale(0.98)";
      setTimeout(() => {
        cardRef.current.style.transition = "opacity 0.6s cubic-bezier(.4,0,.2,1), transform 0.6s cubic-bezier(.4,0,.2,1)";
        cardRef.current.style.opacity = 1;
        cardRef.current.style.transform = "translateY(0) scale(1)";
      }, 60);
    }
  }, []);

  const handleSubmit = async (values) => {
    setError("");
    setLoading(true);

    if (values.password !== values.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await register(values.name, values.email, values.password, values.confirmPassword);
      navigate("/"); // Redirect to homepage after successful registration
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred during registration."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #21005D 60%, #7B2FF2 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Card
        ref={cardRef}
        style={{
          width: 420,
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(33,0,93,0.12)",
          opacity: 0,
          transform: "translateY(40px) scale(0.98)",
        }}
      >
        <Typography.Title level={3} style={{ textAlign: "center", color: "#21005D", marginBottom: 8 }}>TeknoShopia Register</Typography.Title>
        <Divider style={{ margin: "12px 0 24px 0" }} />
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 24 }}>
          <Button style={{ background: "#f4f7fb", color: "#21005D", borderRadius: 8, border: "1px solid #e0e0e0" }} onClick={() => navigate("/login")}>Login</Button>
          <Button type="primary" style={{ background: "#21005D", borderRadius: 8, color: "#fff" }} disabled>Register</Button>
        </div>
        {error && <Typography.Text type="danger" style={{ display: "block", textAlign: "center", marginBottom: 12 }}>{error}</Typography.Text>}
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" rules={[{ required: true, message: "Name is required" }]}>
            <Input prefix={<UserOutlined />} placeholder="Name" size="large" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </Form.Item>
          <Form.Item name="email" rules={[{ required: true, message: "Email is required" }, { type: "email", message: "Please enter a valid email" }]}>
            <Input prefix={<MailOutlined />} placeholder="Email" size="large" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: "Password is required" }, { min: 6, message: "Password must be at least 6 characters" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
          </Form.Item>
          <Form.Item name="confirmPassword" rules={[{ required: true, message: "Password confirmation is required" }, { min: 6, message: "Password must be at least 6 characters" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" size="large" iconRender={visible => visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />} value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} />
          </Form.Item>
          <Form.Item>
            <Checkbox style={{ color: "#21005D" }}>I agree to receive commercial electronic communications from TeknoShopia.</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" style={{ borderRadius: 8, background: "#21005D" }} loading={loading}>{loading ? "Registering..." : "Register"}</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Register;
