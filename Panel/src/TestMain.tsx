import Test from "./Test"; // Test bileşenini import ediyoruz

const TestMain = () => {
  return (
    <div style={{ width: "100%", height: 600, marginTop: "10rem" }}>
      {" "}
      {/* Bu div bileşeninin uygun boyutlarda olmasını sağlar */}
      <Test /> {/* Test bileşenini burada kullanıyoruz */}
    </div>
  );
};

export default TestMain;
