import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";

// eslint-disable-next-line react/prop-types
const LoginRequiredModal = ({ visible, onClose }) => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    onClose();
    navigate("/login");
  };

  return (
    <Modal
      title={
        <span>
          <ExclamationCircleOutlined
            style={{ color: "#faad14", marginRight: 8 }}
          />
          Giriş Gerekli
        </span>
      }
      open={visible}
      onOk={handleLoginRedirect}
      onCancel={onClose}
      okText="Giriş Yap"
      cancelText="Vazgeç"
    >
      <p>Bu işlemi gerçekleştirmek için lütfen hesabınıza giriş yapın.</p>
    </Modal>
  );
};

export default LoginRequiredModal;
