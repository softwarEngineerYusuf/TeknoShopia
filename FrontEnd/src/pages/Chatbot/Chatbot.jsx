import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Chatbot.css"; // Birazdan bu CSS dosyasını oluşturacağız

const Chatbot = () => {
  // State'ler: Mesajları, input değerini ve yüklenme durumunu tutar
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Merhaba! Ben Site Asistanı. Size nasıl yardımcı olabilirim?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Her yeni mesajda en alta kaydırmak için referans
  const messagesEndRef = useRef(null);

  // messages state'i her güncellendiğinde bu fonksiyon çalışır
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mesaj gönderme fonksiyonu
  const handleSendMessage = async (e) => {
    e.preventDefault(); // Formun sayfayı yenilemesini engelle
    const userMessage = inputValue.trim();
    if (!userMessage || isLoading) return;

    // Kullanıcının mesajını ekrana ekle
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInputValue(""); // Input'u temizle
    setIsLoading(true); // Yükleniyor durumunu başlat

    try {
      // Backend'deki /api/chatbot/chat endpoint'ine istek at
      const response = await axios.post("/api/chatbot/chat", {
        message: userMessage,
      });

      // Bot'un cevabını ekrana ekle
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: response.data.reply },
      ]);
    } catch (error) {
      console.error("Chatbot'a mesaj gönderilirken hata oluştu:", error);
      // Hata durumunda kullanıcıya bilgi ver
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Üzgünüm, bir sorun oluştu. Lütfen daha sonra tekrar deneyin.",
        },
      ]);
    } finally {
      setIsLoading(false); // Yükleniyor durumunu bitir
    }
  };

  return (
    <div className="chatbot-page-container">
      <div className="chatbot-page-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.from}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {isLoading && (
          <div className="message bot">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        {/* Bu boş div, sohbetin sonuna otomatik kaydırma yapmak için kullanılır */}
        <div ref={messagesEndRef} />
      </div>

      <form className="chatbot-page-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Merak ettiğiniz bir şey sorun..."
          disabled={isLoading}
          autoFocus
        />
        <button type="submit" disabled={isLoading}>
          Gönder
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
